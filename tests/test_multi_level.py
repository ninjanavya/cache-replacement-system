import unittest
from cache.lru import LRUCache
from cache.fifo import FIFOCache
from cache.multi_level import MultiLevelCache

class TestMultiLevelCache(unittest.TestCase):
    def test_exclusive_cache_promotions_and_demotions(self):
        """Test Exclusive Mode cache mechanics.
        Items should exist in L1 or L2, never both.
        L1 eviction demotes to L2. L2 hit promotes to L1 and removes from L2.
        """
        # Create Multi-level cache with L1 capacity 2, L2 capacity 3
        ml = MultiLevelCache(
            l1_class=LRUCache,
            l1_capacity=2,
            l2_class=LRUCache,
            l2_capacity=3,
            policy_mode="exclusive"
        )
        
        # 1. Put k1 and k2
        ml.put("k1", "v1")
        ml.put("k2", "v2")
        
        # Both should be in L1; L2 should be empty
        self.assertIn("k1", ml.l1._cache)
        self.assertIn("k2", ml.l1._cache)
        self.assertEqual(len(ml.l2), 0)
        
        # 2. Put k3 -> triggers L1 capacity overflow (L1 capacity is 2)
        # Oldest in L1 is k1, which should be evicted and demoted to L2
        ml.put("k3", "v3")
        
        # L1 should have k2, k3
        self.assertNotIn("k1", ml.l1._cache)
        self.assertIn("k2", ml.l1._cache)
        self.assertIn("k3", ml.l1._cache)
        
        # L2 should have k1
        self.assertIn("k1", ml.l2._cache)
        
        # 3. Access k1 (L1 Miss, L2 Hit)
        # k1 should be promoted to L1 and removed from L2.
        # Since L1 is full (k2, k3), inserting k1 to L1 evicts L1's oldest, which is k2.
        # k2 is demoted to L2.
        val = ml.get("k1")
        self.assertEqual(val, "v1")
        self.assertEqual(ml.l1_misses, 1)
        self.assertEqual(ml.l2_hits, 1)
        
        # Verify L1 has k3, k1
        self.assertNotIn("k2", ml.l1._cache)
        self.assertIn("k3", ml.l1._cache)
        self.assertIn("k1", ml.l1._cache)
        
        # Verify L2 has k2, and k1 was removed
        self.assertIn("k2", ml.l2._cache)
        self.assertNotIn("k1", ml.l2._cache)

    def test_inclusive_cache_backdraft_eviction(self):
        """Test Inclusive Mode cache mechanics.
        L2 must contain a copy of everything in L1.
        L2 eviction triggers backdraft eviction in L1.
        """
        # Set L1 capacity to 3, L2 capacity to 2.
        # This allows L2 to fill and evict while L1 has enough capacity.
        ml = MultiLevelCache(
            l1_class=LRUCache,
            l1_capacity=3,
            l2_class=LRUCache,
            l2_capacity=2,
            policy_mode="inclusive"
        )
        
        # 1. Put k1 and k2
        ml.put("k1", "v1")
        ml.put("k2", "v2")
        
        # Verify both are in L1 and L2
        self.assertIn("k1", ml.l1._cache)
        self.assertIn("k2", ml.l1._cache)
        self.assertIn("k1", ml.l2._cache)
        self.assertIn("k2", ml.l2._cache)
        
        # 2. Put k3 -> writes to L2 (capacity 2).
        # L2 evicts oldest (k1).
        # Eviction of k1 from L2 triggers backdraft deletion of k1 from L1.
        ml.put("k3", "v3")
        
        # Verify L2 contains k2, k3 (k1 evicted)
        self.assertNotIn("k1", ml.l2._cache)
        self.assertIn("k2", ml.l2._cache)
        self.assertIn("k3", ml.l2._cache)
        
        # Verify L1 contains k2, k3 (k1 deleted via backdraft, even though L1 was under capacity!)
        self.assertNotIn("k1", ml.l1._cache)
        self.assertIn("k2", ml.l1._cache)
        self.assertIn("k3", ml.l1._cache)

    def test_eat_calculations(self):
        ml = MultiLevelCache(
            l1_class=LRUCache, l1_capacity=2,
            l2_class=LRUCache, l2_capacity=5,
            policy_mode="exclusive",
            t_l1=1.0, t_l2=10.0, t_db=100.0
        )
        
        # Access key, triggering L1 miss, L2 miss, DB fetch
        ml.get("k1") # L1 miss, L2 miss, DB read. L1={k1}
        ml.get("k1") # L1 hit.
        
        # Total requests = 2.
        # L1 hits = 1, misses = 1.
        # L2 hits = 0, misses = 1.
        # DB reads = 1.
        
        stats = ml.get_stats()
        self.assertEqual(stats["l1_hit_rate"], 50.0)
        self.assertEqual(stats["l2_hit_rate"], 0.0)
        self.assertEqual(stats["db_read_rate"], 50.0)
        
        # Expected EAT = 0.5 * 1.0 (L1 hit) + 0.0 (L2 hit) + 0.5 * (1.0 + 10.0 + 100.0) (DB read)
        #             = 0.5 * 1.0 + 0.5 * 111.0 = 0.5 + 55.5 = 56.0
        self.assertEqual(stats["eat_us"], 56.0)
        self.assertEqual(stats["no_cache_eat_us"], 100.0)
        
        # L1-only EAT = p_l1_hit * T_L1 + (1 - p_l1_hit) * (T_L1 + T_DB)
        #             = 0.5 * 1.0 + 0.5 * (1.0 + 100.0) = 0.5 + 50.5 = 51.0
        self.assertEqual(stats["l1_only_eat_us"], 51.0)

if __name__ == "__main__":
    unittest.main()
