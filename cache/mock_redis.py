import random
import time
from typing import Dict, Any, Optional

class MockRedis:
    """High-fidelity emulation of a Redis database server.
    Implements key-value storage, TTLs (GET/SET/EXPIRE/TTL), passive/active
    expiration, and Redis's actual Approximated LRU eviction algorithm.
    """
    def __init__(self, capacity: int):
        self.capacity = capacity
        
        self._db: Dict[str, Any] = {}          # Main keyspace: key -> value
        self._expires: Dict[str, float] = {}   # Expiration mapping: key -> expiry_timestamp
        self._access_times: Dict[str, float] = {} # Access history: key -> last_accessed_timestamp
        
        self.hits = 0
        self.misses = 0
        self.evictions = 0
        self.last_evicted_key = None
        self.last_evicted_value = None
        self._op_counter = 0  # To trigger active expiration cycles periodically

    def _passive_expire(self, key: str) -> bool:
        """Check if a key is expired. If yes, delete it. Return True if expired."""
        if key in self._expires:
            if time.time() > self._expires[key]:
                self._delete_key(key)
                return True
        return False

    def _delete_key(self, key: str) -> None:
        """Helper to cleanly delete a key from all structures."""
        self._db.pop(key, None)
        self._expires.pop(key, None)
        self._access_times.pop(key, None)

    def _active_expire_cycle(self) -> None:
        """Redis active expiration cycle simulation.
        Randomly samples keys with expirations, checks if they are expired, and deletes them.
        Repeats if more than 25% of the sampled keys are expired.
        """
        if not self._expires:
            return

        active = True
        iterations = 0
        max_iterations = 4 # Prevent infinite loops
        
        while active and iterations < max_iterations:
            iterations += 1
            keys = list(self._expires.keys())
            sample_size = min(20, len(keys))
            sample_keys = random.sample(keys, sample_size)
            
            expired_count = 0
            for key in sample_keys:
                # Direct check against timestamp
                if time.time() > self._expires[key]:
                    self._delete_key(key)
                    expired_count += 1
            
            # If less than 25% (5 keys in a sample of 20) are expired, stop the cycle
            if sample_size == 0 or (expired_count / sample_size) < 0.25:
                active = False

    def _evict_approximated_lru(self) -> None:
        """Redis Approximated LRU Eviction.
        Instead of sorting all elements, Redis samples N random keys (default 5)
        and evicts the one with the oldest access time.
        """
        if not self._db:
            return

        keys = list(self._db.keys())
        sample_size = min(5, len(keys))
        sample_keys = random.sample(keys, sample_size)
        
        # Find key with minimum last accessed time
        lru_key = min(sample_keys, key=lambda k: self._access_times.get(k, 0.0))
        
        self.last_evicted_key = lru_key
        self.last_evicted_value = self._db.get(lru_key)
        self._delete_key(lru_key)
        self.evictions += 1

    def get(self, key: str) -> Optional[Any]:
        """GET key. Triggers passive expiration."""
        self._op_counter += 1
        if self._op_counter % 10 == 0:
            self._active_expire_cycle()

        if key not in self._db:
            self.misses += 1
            return None

        # Check if expired (passive eviction)
        if self._passive_expire(key):
            self.misses += 1
            return None

        self.hits += 1
        self._access_times[key] = time.time()
        return self._db[key]

    def set(self, key: str, value: Any, ex: Optional[int] = None) -> bool:
        """SET key value [EX seconds]. Triggers active expiration & eviction checks."""
        self.last_evicted_key = None
        self.last_evicted_value = None
        self._op_counter += 1
        if self._op_counter % 10 == 0:
            self._active_expire_cycle()

        # Handle eviction if cache is full
        if key not in self._db and len(self._db) >= self.capacity:
            self._evict_approximated_lru()

        # Perform set operation
        self._db[key] = value
        self._access_times[key] = time.time()

        if ex is not None:
            if ex <= 0:
                # Immediate expiration if EX <= 0
                self._delete_key(key)
                return True
            self._expires[key] = time.time() + ex
        else:
            # Clear existing TTL if updating without EX
            self._expires.pop(key, None)

        return True

    def expire(self, key: str, seconds: int) -> int:
        """EXPIRE key seconds. Returns 1 if key exists, 0 otherwise."""
        if key not in self._db or self._passive_expire(key):
            return 0
        
        if seconds <= 0:
            self._delete_key(key)
        else:
            self._expires[key] = time.time() + seconds
        return 1

    def ttl(self, key: str) -> int:
        """TTL key. Returns remaining TTL in seconds.
        -1 if no expire, -2 if key does not exist.
        """
        if key not in self._db:
            return -2
            
        if self._passive_expire(key):
            return -2

        if key not in self._expires:
            return -1

        remaining = int(round(self._expires[key] - time.time()))
        return max(0, remaining)

    def clear(self) -> None:
        """Reset databases and stats."""
        self._db.clear()
        self._expires.clear()
        self._access_times.clear()
        self.hits = 0
        self.misses = 0
        self.evictions = 0
        self.last_evicted_key = None
        self.last_evicted_value = None
        self._op_counter = 0

    def __len__(self) -> int:
        # Check and remove any expired keys before reporting length
        expired_keys = [k for k in self._expires if time.time() > self._expires[k]]
        for k in expired_keys:
            self._delete_key(k)
        return len(self._db)
