from cache.base import BaseCache

class Node:
    """Node for storing cache item in LFU list."""
    def __init__(self, key=None, value=None, freq=1):
        self.key = key
        self.value = value
        self.freq = freq
        self.prev = None
        self.next = None
        self.parent_freq_node = None


class FrequencyNode:
    """Doubly linked list node representing an access frequency level.
    Maintains its own doubly linked list of items having this frequency.
    """
    def __init__(self, freq=0):
        self.freq = freq
        self.prev = None
        self.next = None
        # Dummy nodes for DLL of items at this frequency
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def is_empty(self) -> bool:
        """Return True if there are no items at this frequency level."""
        return self.head.next == self.tail

    def add_to_head(self, node: Node) -> None:
        """Add a cache item node to the head of this frequency's list (Most Recently Used)."""
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
        node.parent_freq_node = self

    def remove_node(self, node: Node) -> None:
        """Remove a cache item node from this frequency's list."""
        if node.prev:
            node.prev.next = node.next
        if node.next:
            node.next.prev = node.prev
        node.prev = None
        node.next = None
        node.parent_freq_node = None


class LFUCache(BaseCache):
    """LFU (Least Frequently Used) Cache Implementation.
    Achieves O(1) GET and PUT complexity using a doubly-linked list of frequency levels,
    each containing a doubly-linked list of cache items.
    """
    def __init__(self, capacity: int):
        super().__init__(capacity)
        self._cache = {}  # Map key -> Node
        
        # Dummy head and tail for the DLL of active FrequencyNodes
        self._freq_head = FrequencyNode()
        self._freq_tail = FrequencyNode()
        self._freq_head.next = self._freq_tail
        self._freq_tail.prev = self._freq_head

    def _insert_freq_node_after(self, new_freq_node: FrequencyNode, ref_node: FrequencyNode) -> None:
        """Insert a new frequency node after an existing frequency node."""
        new_freq_node.next = ref_node.next
        new_freq_node.prev = ref_node
        ref_node.next.prev = new_freq_node
        ref_node.next = new_freq_node

    def _remove_freq_node(self, freq_node: FrequencyNode) -> None:
        """Remove a frequency node from the frequency list."""
        freq_node.prev.next = freq_node.next
        freq_node.next.prev = freq_node.prev
        freq_node.prev = None
        freq_node.next = None

    def _increment_frequency(self, node: Node) -> None:
        """Increment frequency of a node and move it to the correct frequency list. O(1) complexity."""
        current_freq_node = node.parent_freq_node
        next_freq = node.freq + 1
        node.freq = next_freq

        # Determine/create the target FrequencyNode
        target_freq_node = current_freq_node.next
        if target_freq_node == self._freq_tail or target_freq_node.freq != next_freq:
            # Create next frequency node on-demand
            target_freq_node = FrequencyNode(next_freq)
            self._insert_freq_node_after(target_freq_node, current_freq_node)

        # Move item from current frequency list to target list
        current_freq_node.remove_node(node)
        target_freq_node.add_to_head(node)

        # Clean up current frequency node if it became empty
        if current_freq_node.is_empty():
            self._remove_freq_node(current_freq_node)

    def get(self, key):
        """Retrieve key and increment frequency. O(1) complexity."""
        if key in self._cache:
            self.hits += 1
            node = self._cache[key]
            self._increment_frequency(node)
            return node.value
        
        self.misses += 1
        return None

    def put(self, key, value) -> None:
        """Insert/update cache item. O(1) complexity."""
        self.last_evicted_key = None
        self.last_evicted_value = None

        if self.capacity <= 0:
            return

        if key in self._cache:
            # Update existing value and increment frequency
            node = self._cache[key]
            node.value = value
            self._increment_frequency(node)
            return

        # Handle eviction if cache is full
        if len(self._cache) >= self.capacity:
            # LFU node is the tail node (LRU) of the lowest active frequency list
            min_freq_node = self._freq_head.next
            # Assert min_freq_node is valid (must be, since len >= capacity > 0)
            if min_freq_node != self._freq_tail:
                lru_node = min_freq_node.tail.prev
                self.last_evicted_key = lru_node.key
                self.last_evicted_value = lru_node.value
                min_freq_node.remove_node(lru_node)
                del self._cache[lru_node.key]
                self.evictions += 1
                
                # Clean up frequency node if empty
                if min_freq_node.is_empty():
                    self._remove_freq_node(min_freq_node)

        # Insert new key-value pair with freq = 1
        new_node = Node(key, value, freq=1)
        
        # Ensure FrequencyNode of frequency 1 exists
        freq_one_node = self._freq_head.next
        if freq_one_node == self._freq_tail or freq_one_node.freq != 1:
            freq_one_node = FrequencyNode(1)
            self._insert_freq_node_after(freq_one_node, self._freq_head)

        freq_one_node.add_to_head(new_node)
        self._cache[key] = new_node

    def clear(self) -> None:
        """Clear cache state and stats."""
        super().clear()
        self._cache.clear()
        self._freq_head.next = self._freq_tail
        self._freq_tail.prev = self._freq_head

    def __len__(self) -> int:
        return len(self._cache)
