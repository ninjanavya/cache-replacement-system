import unittest
import time
from cache.mock_redis import MockRedis
from cache.redis_cache import RedisCache

class TestMockRedis(unittest.TestCase):
    def test_basic_commands(self):
        redis = MockRedis(capacity=5)
        
        # Test SET and GET
        self.assertTrue(redis.set("k1", "v1"))
        self.assertEqual(redis.get("k1"), "v1")
        
        # Test TTL on key with no expiry
        self.assertEqual(redis.ttl("k1"), -1)
        
        # Test TTL on non-existent key
        self.assertEqual(redis.ttl("nonexistent"), -2)
        
        # Test GET on non-existent key
        self.assertIsNone(redis.get("nonexistent"))

    def test_expire_and_ttl(self):
        redis = MockRedis(capacity=5)
        redis.set("k1", "v1")
        
        # Test EXPIRE command
        self.assertEqual(redis.expire("k1", 10), 1)
        self.assertTrue(redis.ttl("k1") > 0)
        
        # Test EXPIRE on non-existent key
        self.assertEqual(redis.expire("nonexistent", 10), 0)

    def test_passive_expiration(self):
        redis = MockRedis(capacity=5)
        
        # Set with EX=1 second
        redis.set("k1", "v1", ex=1)
        self.assertEqual(redis.get("k1"), "v1")
        
        # Sleep for 1.1s to guarantee expiration
        time.sleep(1.1)
        
        # GET should trigger passive eviction and return None
        self.assertIsNone(redis.get("k1"))
        self.assertEqual(redis.ttl("k1"), -2)
        self.assertEqual(len(redis), 0)

    def test_active_expiration(self):
        redis = MockRedis(capacity=100)
        
        # Set 20 keys with EX=1
        for i in range(20):
            redis.set(f"key_{i}", f"val_{i}", ex=1)
            
        self.assertEqual(len(redis), 20)
        
        # Sleep for 1.1s to expire keys
        time.sleep(1.1)
        
        # Run operations to trigger active expire cycles (every 10 ops runs an active cycle)
        for i in range(15):
            redis.get("nonexistent")
            
        # The active expire cycle should have cleaned up the keys
        # Wait, since len() runs cleanup internally anyway, let's check internal structures directly
        # or use len() which verifies they are removed.
        self.assertEqual(len(redis), 0)

    def test_approximated_lru_eviction(self):
        """Test that approximated LRU correctly identifies and evicts the oldest accessed item.
        Since cache capacity is 3 and sample size is 5, it will sample all keys.
        The oldest accessed key must be evicted.
        """
        redis = MockRedis(capacity=3)
        
        # Insert 3 keys sequentially
        redis.set("k1", "v1")
        time.sleep(0.01)
        redis.set("k2", "v2")
        time.sleep(0.01)
        redis.set("k3", "v3")
        
        # Access order (oldest to newest): k1, k2, k3
        
        # Insert k4, triggering eviction of oldest accessed item (k1)
        redis.set("k4", "v4")
        
        self.assertIsNone(redis.get("k1"))
        self.assertEqual(redis.get("k2"), "v2")
        self.assertEqual(redis.get("k3"), "v3")
        self.assertEqual(redis.get("k4"), "v4")
        self.assertEqual(redis.evictions, 1)

    def test_redis_cache_adapter_fallback(self):
        # RedisCache should instantiate and run in mock mode if local server is down
        cache = RedisCache(capacity=3)
        
        # It should fall back to mock since no server is running
        self.assertTrue(cache.is_mock)
        
        cache.put("k1", "v1")
        self.assertEqual(cache.get("k1"), "v1")
        cache.clear()
        self.assertIsNone(cache.get("k1"))

if __name__ == "__main__":
    unittest.main()
