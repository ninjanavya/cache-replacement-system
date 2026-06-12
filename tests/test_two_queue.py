import unittest
from cache.two_queue import TwoQueueCache

class TestTwoQueueCache(unittest.TestCase):
    def test_basic_operations(self):
        cache = TwoQueueCache(capacity=3)
        self.assertEqual(len(cache), 0)
        
        # Insert elements
        cache.put("k1", "v1")
        cache.put("k2", "v2")
        cache.put("k3", "v3")
        self.assertEqual(len(cache), 3)
        
        # Retrieve elements (Hits)
        self.assertEqual(cache.get("k1"), "v1")
        self.assertEqual(cache.get("k2"), "v2")
        self.assertEqual(cache.get("k3"), "v3")
        self.assertEqual(cache.hits, 3)
        self.assertEqual(cache.misses, 0)
        
        # Miss
        self.assertIsNone(cache.get("k4"))
        self.assertEqual(cache.misses, 1)

    def test_eviction_and_promotion(self):
        # Cache capacity = 4. A1_in_cap = 1. A1_out_cap = 2.
        cache = TwoQueueCache(capacity=4)
        
        cache.put("k1", "v1")
        cache.put("k2", "v2")
        cache.put("k3", "v3")
        cache.put("k4", "v4")
        
        # Since cache is full, putting k5 triggers reclaim.
        # len(A1_in) is 4 >= A1_in_cap (1), so oldest in A1_in (k1) is evicted to A1_out.
        cache.put("k5", "v5")
        
        self.assertIsNone(cache.get("k1"))  # Evicted from memory
        self.assertIn("k1", cache._A1_out_set)  # Key tracked in A1_out metadata
        self.assertEqual(cache.evictions, 1)
        
        # Accessing k1 will trigger a read-through put since it is a miss in get()
        cache.put("k1", "v1")  # Triggers promotion to Am
        
        # k1 is now in Am, and k2 (oldest in A1_in) is evicted to A1_out to make space.
        self.assertNotIn("k2", cache._A1_in_set)
        self.assertIn("k2", cache._A1_out_set)
        self.assertIn("k1", cache._Am_cache)
        self.assertEqual(cache.get("k1"), "v1")  # Hit in Am!

    def test_scan_resistance(self):
        # Capacity = 4. A1_in_cap = 1.
        cache = TwoQueueCache(capacity=4)
        
        cache.put("k1", "v1")
        cache.put("k2", "v2")
        cache.put("k3", "v3")
        cache.put("k4", "v4")
        
        # Promote k1 and k2 to Am by simulating a second access (via mock read-through)
        # Note: In our simulation framework, a second put/get on a key in A1_out promotes it.
        # Alternatively, a second put on an in-memory key is Scenario 1 or 2, which updates but doesn't promote.
        # But if the item was evicted to A1_out, a subsequent put promotes it to Am.
        # Let's verify by checking how to promote:
        # 1. Put k1 -> A1_in
        # 2. Put k5 -> triggers eviction of k1 to A1_out
        # 3. Put k1 -> promotes k1 to Am.
        # Let's do this for k1 and k2 to put them both in Am.
        cache.put("k5", "v5")  # evicts k1 to A1_out
        cache.put("k1", "v1")  # promotes k1 to Am, evicts k2 to A1_out
        cache.put("k2", "v2")  # promotes k2 to Am, evicts k3 to A1_out
        
        # Now Am contains {k1, k2}. A1_in contains {k4, k5}. Cache is at capacity.
        self.assertIn("k1", cache._Am_cache)
        self.assertIn("k2", cache._Am_cache)
        
        # Now perform a sequential scan of new keys: k6, k7, k8.
        # Each new key goes to A1_in. Since capacity is full, and len(A1_in) >= 1,
        # it will evict from A1_in, leaving Am untouched!
        cache.put("k6", "v6")  # evicts k4 to A1_out
        cache.put("k7", "v7")  # evicts k5 to A1_out
        cache.put("k8", "v8")  # evicts k6 to A1_out
        
        # Verify k1 and k2 are still in the cache! Scan did not evict them.
        self.assertEqual(cache.get("k1"), "v1")
        self.assertEqual(cache.get("k2"), "v2")
        
        # Check that scanned keys k4 and k5 were evicted
        self.assertIsNone(cache.get("k4"))
        self.assertIsNone(cache.get("k5"))

    def test_clear_stats(self):
        cache = TwoQueueCache(capacity=2)
        cache.put("k1", "v1")
        cache.get("k1")
        cache.get("k2")
        self.assertEqual(cache.hits, 1)
        self.assertEqual(cache.misses, 1)
        
        cache.clear()
        self.assertEqual(len(cache), 0)
        self.assertEqual(cache.hits, 0)
        self.assertEqual(cache.misses, 0)
        self.assertEqual(cache.evictions, 0)

if __name__ == "__main__":
    unittest.main()
