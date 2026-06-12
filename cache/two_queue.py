from collections import deque
from cache.base import BaseCache

class ListNode:
    """Node class for Am doubly linked list in 2Q."""
    def __init__(self, key=None, value=None):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class TwoQueueCache(BaseCache):
    """2Q (Two Queue) Cache Implementation.
    Enhancement over LRU that is scan-resistant.
    Uses:
      - A1_in: FIFO queue for items accessed once (stores values).
      - A1_out: FIFO queue for tracking keys evicted from A1_in (stores keys only).
      - Am: LRU queue for items accessed frequently (stores values).
    Total in-memory keys = len(A1_in) + len(Am) <= capacity.
    """
    def __init__(self, capacity: int):
        super().__init__(capacity)
        
        # Partition size heuristics
        self.A1_in_cap = max(1, capacity // 4)
        self.A1_out_cap = max(1, capacity // 2)
        
        # In-memory storage mapping key -> value
        self._cache = {}
        
        # A1_in FIFO structures
        self._A1_in = deque()
        self._A1_in_set = set()
        
        # A1_out FIFO structures (metadata only, no values stored in memory)
        self._A1_out = deque()
        self._A1_out_set = set()
        
        # Am LRU structures
        self._Am_cache = {}  # Map key -> ListNode
        self._Am_head = ListNode()
        self._Am_tail = ListNode()
        self._Am_head.next = self._Am_tail
        self._Am_tail.prev = self._Am_head

    def _remove_node_from_Am(self, node: ListNode) -> None:
        """Remove a node from the Am doubly linked list."""
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _add_node_to_Am_head(self, node: ListNode) -> None:
        """Insert a node at the head of the Am doubly linked list."""
        node.next = self._Am_head.next
        node.prev = self._Am_head
        self._Am_head.next.prev = node
        self._Am_head.next = node

    def get(self, key):
        """Retrieve key. If present, update access order if it is in Am. O(1) complexity."""
        if key in self._Am_cache:
            # Hit in Am: move node to MRU head
            self.hits += 1
            node = self._Am_cache[key]
            self._remove_node_from_Am(node)
            self._add_node_to_Am_head(node)
            return node.value
            
        if key in self._A1_in_set:
            # Hit in A1_in: no queue order change in standard 2Q
            self.hits += 1
            return self._cache[key]
            
        # Miss (even if key is in A1_out, its value is not in memory)
        self.misses += 1
        return None

    def put(self, key, value) -> None:
        """Insert or update a key-value pair. O(1) complexity."""
        self.last_evicted_key = None
        self.last_evicted_value = None

        if self.capacity <= 0:
            return

        # Scenario 1: Key is already in Am
        if key in self._Am_cache:
            # Update value in main cache and node, move to head
            self._cache[key] = value
            node = self._Am_cache[key]
            node.value = value
            self._remove_node_from_Am(node)
            self._add_node_to_Am_head(node)
            return

        # Scenario 2: Key is already in A1_in
        if key in self._A1_in_set:
            # Update value in main cache (FIFO position remains unchanged)
            self._cache[key] = value
            return

        # Scenario 3: Key is in A1_out (was evicted from A1_in, now accessed again -> promote to Am)
        if key in self._A1_out_set:
            # Remove key from A1_out
            self._A1_out_set.remove(key)
            # Remove from deque (O(N) search but acceptable; usually deque is small)
            try:
                self._A1_out.remove(key)
            except ValueError:
                pass
                
            # Evict if we are at memory capacity
            if len(self._cache) >= self.capacity:
                self._reclaim_memory()
                
            # Insert into Am
            self._cache[key] = value
            node = ListNode(key, value)
            self._add_node_to_Am_head(node)
            self._Am_cache[key] = node
            return

        # Scenario 4: First time access (not in Am, A1_in, or A1_out)
        if len(self._cache) >= self.capacity:
            self._reclaim_memory()
            
        # Insert into A1_in
        self._cache[key] = value
        self._A1_in.append(key)
        self._A1_in_set.add(key)

    def _reclaim_memory(self) -> None:
        """Reclaim a page of memory. Evicts from A1_in to A1_out, or from Am."""
        # Check if A1_in is overflowing its partition target
        if len(self._A1_in) >= self.A1_in_cap:
            # Evict from A1_in (FIFO)
            out_key = self._A1_in.popleft()
            self._A1_in_set.remove(out_key)
            
            # Save value before deleting from main cache
            out_val = self._cache[out_key]
            del self._cache[out_key]
            
            self.last_evicted_key = out_key
            self.last_evicted_value = out_val
            self.evictions += 1
            
            # Push metadata (key only) to A1_out
            self._A1_out.append(out_key)
            self._A1_out_set.add(out_key)
            
            # If A1_out overflows its capacity, discard oldest metadata
            if len(self._A1_out) > self.A1_out_cap:
                discarded_key = self._A1_out.popleft()
                self._A1_out_set.remove(discarded_key)
        else:
            # Evict from Am (LRU)
            lru_node = self._Am_tail.prev
            if lru_node != self._Am_head:
                self._remove_node_from_Am(lru_node)
                del self._Am_cache[lru_node.key]
                
                out_key = lru_node.key
                out_val = lru_node.value
                del self._cache[out_key]
                
                self.last_evicted_key = out_key
                self.last_evicted_value = out_val
                self.evictions += 1

    def clear(self) -> None:
        """Clear cache state and stats."""
        super().clear()
        self._cache.clear()
        
        self._A1_in.clear()
        self._A1_in_set.clear()
        
        self._A1_out.clear()
        self._A1_out_set.clear()
        
        self._Am_cache.clear()
        self._Am_head.next = self._Am_tail
        self._Am_tail.prev = self._Am_head

    def __len__(self) -> int:
        return len(self._cache)
