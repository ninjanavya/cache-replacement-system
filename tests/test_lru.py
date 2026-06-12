import unittest
from cache.lru import LRUCache

class TestLRUCache(unittest.TestCase):
    def test_basic_operations(self):
        cache = LRUCache(capacity=3)
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

    def test_eviction_order(self):
        cache = LRUCache(capacity=3)
        cache.put("k1", "v1")
        cache.put("k2", "v2")
        cache.put("k3", "v3")
        
        # Make "k1" most recently used
        self.assertEqual(cache.get("k1"), "v1")
        
        # Now LRU order is: k2, k3, k1 (with k2 as LRU)
        # Insert k4, which should evict k2
        cache.put("k4", "v4")
        self.assertIsNone(cache.get("k2"))
        self.assertEqual(cache.get("k1"), "v1")
        self.assertEqual(cache.get("k3"), "v3")
        self.assertEqual(cache.get("k4"), "v4")
        self.assertEqual(cache.evictions, 1)

    def test_update_changes_order(self):
        cache = LRUCache(capacity=2)
        cache.put("k1", "v1")
        cache.put("k2", "v2")
        
        # Update k1, making it MRU
        cache.put("k1", "new_v1")
        
        # Insert k3, which should evict k2
        cache.put("k3", "v3")
        self.assertIsNone(cache.get("k2"))
        self.assertEqual(cache.get("k1"), "new_v1")
        self.assertEqual(cache.get("k3"), "v3")
        self.assertEqual(cache.evictions, 1)

    def test_clear_stats(self):
        cache = LRUCache(capacity=2)
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
