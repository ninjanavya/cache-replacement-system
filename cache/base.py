import abc

class BaseCache(abc.ABC):
    """Abstract base class for all cache implementations.
    Provides standard interface and auto-tracks hit, miss, and eviction statistics.
    """
    def __init__(self, capacity: int):
        if capacity <= 0:
            raise ValueError("Cache capacity must be a positive integer.")
        self.capacity = capacity
        self.hits = 0
        self.misses = 0
        self.evictions = 0
        self.last_evicted_key = None
        self.last_evicted_value = None

    @abc.abstractmethod
    def get(self, key):
        """Retrieve an item from the cache.
        Updates internal metrics (hits/misses).
        """
        pass

    @abc.abstractmethod
    def put(self, key, value) -> None:
        """Insert or update an item in the cache.
        If cache exceeds capacity, an eviction must occur.
        """
        pass

    @abc.abstractmethod
    def clear(self) -> None:
        """Reset the cache state and clear all stats."""
        self.hits = 0
        self.misses = 0
        self.evictions = 0
        self.last_evicted_key = None
        self.last_evicted_value = None

    @abc.abstractmethod
    def __len__(self) -> int:
        """Return current number of items in the cache."""
        pass

    def get_stats(self) -> dict:
        """Return dictionary containing performance statistics."""
        total_accesses = self.hits + self.misses
        hit_rate = (self.hits / total_accesses) * 100 if total_accesses > 0 else 0.0
        return {
            "capacity": self.capacity,
            "size": len(self),
            "hits": self.hits,
            "misses": self.misses,
            "evictions": self.evictions,
            "hit_rate": round(hit_rate, 2),
        }
