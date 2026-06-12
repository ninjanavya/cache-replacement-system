from cache.base import BaseCache

class ListNode:
    """Node class for custom Doubly Linked List."""
    def __init__(self, key=None, value=None):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache(BaseCache):
    """LRU (Least Recently Used) Cache Implementation.
    Uses a custom Doubly Linked List and Hash Map to achieve O(1) GET and PUT complexity.
    """
    def __init__(self, capacity: int):
        super().__init__(capacity)
        self._cache = {}  # Map key -> ListNode
        
        # Initialize dummy head and tail for the DLL
        self._head = ListNode()
        self._tail = ListNode()
        self._head.next = self._tail
        self._tail.prev = self._head

    def _remove(self, node: ListNode) -> None:
        """Remove an existing node from the doubly linked list."""
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _add_to_head(self, node: ListNode) -> None:
        """Insert a node right after the dummy head (most recently used)."""
        node.next = self._head.next
        node.prev = self._head
        self._head.next.prev = node
        self._head.next = node

    def get(self, key):
        """Retrieve an item from cache, moving it to the MRU position. O(1) complexity."""
        if key in self._cache:
            self.hits += 1
            node = self._cache[key]
            self._remove(node)
            self._add_to_head(node)
            return node.value
        
        self.misses += 1
        return None

    def put(self, key, value) -> None:
        """Insert or update a key-value pair. O(1) complexity."""
        self.last_evicted_key = None
        self.last_evicted_value = None

        if self.capacity <= 0:
            return

        if key in self._cache:
            # Update value and move node to head (MRU)
            node = self._cache[key]
            node.value = value
            self._remove(node)
            self._add_to_head(node)
            return

        # If capacity is exceeded, evict the LRU node (just before tail)
        if len(self._cache) >= self.capacity:
            lru_node = self._tail.prev
            self.last_evicted_key = lru_node.key
            self.last_evicted_value = lru_node.value
            self._remove(lru_node)
            del self._cache[lru_node.key]
            self.evictions += 1

        # Insert new key
        new_node = ListNode(key, value)
        self._add_to_head(new_node)
        self._cache[key] = new_node

    def clear(self) -> None:
        """Clear cache state and stats."""
        super().clear()
        self._cache.clear()
        self._head.next = self._tail
        self._tail.prev = self._head

    def __len__(self) -> int:
        return len(self._cache)
