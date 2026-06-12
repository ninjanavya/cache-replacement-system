from collections import deque
from cache.base import BaseCache

class FIFOCache(BaseCache):
    """FIFO (First-In, First-Out) Cache Implementation.
    Evicts the oldest inserted item first.
    O(1) GET and PUT complexity.
    """
    def __init__(self, capacity: int):
        super().__init__(capacity)
        self._cache = {}
        self._queue = deque()

    def get(self, key):
        """Retrieve key. O(1) time complexity."""
        if key in self._cache:
            self.hits += 1
            return self._cache[key]
        self.misses += 1
        return None

    def put(self, key, value) -> None:
        """Insert/update key-value pair. O(1) time complexity."""
        self.last_evicted_key = None
        self.last_evicted_value = None

        if self.capacity <= 0:
            return

        if key in self._cache:
            # Update existing value (does not change FIFO order)
            self._cache[key] = value
            return

        # Handle eviction if capacity is reached
        if len(self._cache) >= self.capacity:
            # Find candidate key in queue that is still in cache (or just pop from queue directly)
            while self._queue:
                oldest_key = self._queue.popleft()
                if oldest_key in self._cache:
                    self.last_evicted_key = oldest_key
                    self.last_evicted_value = self._cache[oldest_key]
                    del self._cache[oldest_key]
                    self.evictions += 1
                    break

        # Insert new key
        self._cache[key] = value
        self._queue.append(key)

    def clear(self) -> None:
        """Clear the cache and reset metrics."""
        super().clear()
        self._cache.clear()
        self._queue.clear()

    def __len__(self) -> int:
        return len(self._cache)
