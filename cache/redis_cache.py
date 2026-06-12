import logging
from cache.base import BaseCache
from cache.mock_redis import MockRedis

logger = logging.getLogger(__name__)

class RedisCache(BaseCache):
    """Redis Cache Adapter.
    Integrates Redis into the benchmark harness.
    Attempts to connect to a real Redis server running on localhost:6379.
    If unavailable, falls back to the custom, high-fidelity MockRedis emulator.
    """
    def __init__(self, capacity: int, host: str = "localhost", port: int = 6379):
        super().__init__(capacity)
        self.is_mock = True
        self.client = None
        
        try:
            import redis
            # Setup a short connection timeout (0.5s) to avoid freezing if Redis is offline
            self.client = redis.Redis(host=host, port=port, socket_connect_timeout=0.5)
            # Test connection
            self.client.ping()
            self.is_mock = False
            self.client.flushdb()  # Reset db for clean benchmark
            logger.info("Successfully connected to real Redis server on localhost:6379.")
        except Exception as e:
            logger.warning(
                f"Redis server connection failed: {e}. "
                "Falling back to high-fidelity MockRedis emulator."
            )
            self.client = MockRedis(capacity)
            self.is_mock = True

    def get(self, key):
        """GET key. O(1) time complexity."""
        if self.is_mock:
            val = self.client.get(key)
            self.hits = self.client.hits
            self.misses = self.client.misses
            self.evictions = self.client.evictions
            return val
        else:
            # Real Redis GET
            val = self.client.get(key)
            if val is not None:
                self.hits += 1
                return val.decode("utf-8")
            else:
                self.misses += 1
                return None

    def put(self, key, value) -> None:
        """SET key value. Evicts items if capacity exceeded. O(1) complexity."""
        self.last_evicted_key = None
        self.last_evicted_value = None

        if self.capacity <= 0:
            return

        if self.is_mock:
            self.client.set(key, value)
            self.hits = self.client.hits
            self.misses = self.client.misses
            self.evictions = self.client.evictions
            self.last_evicted_key = self.client.last_evicted_key
            self.last_evicted_value = self.client.last_evicted_value
            return

        # Real Redis item-capacity emulation:
        # Since standard Redis eviction is byte-size based (maxmemory),
        # we emulate item-based capacity constraints for a direct benchmark comparison.
        try:
            if not self.client.exists(key) and self.client.dbsize() >= self.capacity:
                # Emulate Redis's volatile/allkeys-lru algorithm
                # Sample 5 random keys using RANDOMKEY command
                sample_keys = []
                for _ in range(5):
                    rk = self.client.randomkey()
                    if rk and rk not in sample_keys:
                        sample_keys.append(rk)
                
                if sample_keys:
                    # OBJECT IDLETIME returns the time in seconds since the key was last read/written.
                    # The key with the highest idle time is the LRU eviction candidate.
                    lru_key = max(sample_keys, key=lambda k: self.client.object("idletime", k) or 0)
                    lru_val = self.client.get(lru_key)
                    self.last_evicted_key = lru_key.decode("utf-8") if isinstance(lru_key, bytes) else lru_key
                    self.last_evicted_value = lru_val.decode("utf-8") if isinstance(lru_val, bytes) else lru_val
                    self.client.delete(lru_key)
                    self.evictions += 1
            
            self.client.set(key, value)
        except Exception as e:
            # Handle mid-run disconnections
            logger.error(f"Error during real Redis SET operation: {e}")
            self.misses += 1

    def clear(self) -> None:
        """Flush database and reset statistics."""
        super().clear()
        if self.is_mock:
            self.client.clear()
        else:
            try:
                self.client.flushdb()
            except Exception as e:
                logger.error(f"Error flushing real Redis DB: {e}")

    def __len__(self) -> int:
        if self.is_mock:
            return len(self.client)
        else:
            try:
                return self.client.dbsize()
            except Exception:
                return 0
