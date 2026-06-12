import time
from typing import Any, Optional, Type
from cache.base import BaseCache

def force_delete_from_cache(cache: BaseCache, key: Any) -> None:
    """Manually delete a specific key from a cache, unlinking its nodes/queues.
    Used to maintain multi-level inclusive and exclusive invariants.
    """
    name = cache.__class__.__name__
    if name == "FIFOCache":
        if key in cache._cache:
            del cache._cache[key]
            # Remove key from deque (O(N) operation but acceptable for simulator cleanup)
            try:
                cache._queue.remove(key)
            except ValueError:
                pass
    elif name == "LRUCache":
        if key in cache._cache:
            node = cache._cache[key]
            cache._remove(node)
            del cache._cache[key]
    elif name == "LFUCache":
        if key in cache._cache:
            node = cache._cache[key]
            freq_node = node.parent_freq_node
            freq_node.remove_node(node)
            if freq_node.is_empty():
                cache._remove_freq_node(freq_node)
            del cache._cache[key]
    elif name == "RedisCache":
        if cache.is_mock:
            cache.client._delete_key(key)
        else:
            try:
                cache.client.delete(key)
            except Exception:
                pass
    elif name == "TwoQueueCache":
        # Delete from all structures: A1_in, A1_out, Am
        if key in cache._cache:
            del cache._cache[key]
        if key in cache._A1_in_set:
            cache._A1_in_set.remove(key)
            try:
                cache._A1_in.remove(key)
            except ValueError:
                pass
        if key in cache._A1_out_set:
            cache._A1_out_set.remove(key)
            try:
                cache._A1_out.remove(key)
            except ValueError:
                pass
        if key in cache._Am_cache:
            node = cache._Am_cache[key]
            cache._remove_node_from_Am(node)
            del cache._Am_cache[key]


class MultiLevelCache:
    """Simulates L1 -> L2 -> Database tiered storage architecture.
    Supports Inclusive and Exclusive cache lookup and eviction policies.
    """
    def __init__(
        self,
        l1_class: Type[BaseCache],
        l1_capacity: int,
        l2_class: Type[BaseCache],
        l2_capacity: int,
        policy_mode: str = "exclusive",
        t_l1: float = 1.0,    # Latency of L1 read in microseconds
        t_l2: float = 10.0,   # Latency of L2 read in microseconds
        t_db: float = 250.0,  # Latency of DB read in microseconds
    ):
        self.l1 = l1_class(l1_capacity)
        self.l2 = l2_class(l2_capacity)
        self.policy_mode = policy_mode.lower() # "inclusive" or "exclusive"
        
        self.t_l1 = t_l1
        self.t_l2 = t_l2
        self.t_db = t_db
        
        # Metrics
        self.l1_hits = 0
        self.l1_misses = 0
        self.l2_hits = 0
        self.l2_misses = 0
        self.db_reads = 0
        self.total_requests = 0

    def get(self, key: str) -> str:
        """GET key. Check L1 -> L2 -> DB."""
        self.total_requests += 1
        
        # 1. Check L1 Cache
        val = self.l1.get(key)
        if val is not None:
            self.l1_hits += 1
            return val
            
        # L1 Miss
        self.l1_misses += 1
        
        # 2. Check L2 Cache
        val = self.l2.get(key)
        if val is not None:
            self.l2_hits += 1
            
            # Promotion to L1
            if self.policy_mode == "exclusive":
                # Remove from L2 so it is strictly in L1
                force_delete_from_cache(self.l2, key)
                
                # Insert into L1. Eviction from L1 triggers demotion to L2.
                self.l1.put(key, val)
                if self.l1.last_evicted_key is not None:
                    # Demote to L2
                    self.l2.put(self.l1.last_evicted_key, self.l1.last_evicted_value)
            else: # inclusive
                # Insert into L1 (leave a copy in L2)
                self.l1.put(key, val)
                
            return val
            
        # L1 Miss + L2 Miss
        self.l2_misses += 1
        self.db_reads += 1
        
        # 3. Fetch from Database
        db_val = f"val_{key}"
        
        # Insert fetched key into cache layers
        if self.policy_mode == "exclusive":
            # Exclusive: Insert directly into L1.
            # Evictions from L1 demote to L2.
            self.l1.put(key, db_val)
            if self.l1.last_evicted_key is not None:
                self.l2.put(self.l1.last_evicted_key, self.l1.last_evicted_value)
        else: # inclusive
            # Inclusive: Write to both L1 and L2.
            # L2 must contain everything in L1.
            # If L2 evicts, L1 must evict too (Backdraft).
            self.l2.put(key, db_val)
            if self.l2.last_evicted_key is not None:
                # Backdraft eviction: delete from L1
                force_delete_from_cache(self.l1, self.l2.last_evicted_key)
            self.l1.put(key, db_val)
            
        return db_val

    def put(self, key: str, value: str) -> None:
        """SET key value. Writes through L1 and L2 depending on inclusion policy."""
        self.total_requests += 1
        
        if self.policy_mode == "exclusive":
            # Write only to L1. Evicted item is demoted to L2.
            # Ensure it is deleted from L2 if it existed.
            force_delete_from_cache(self.l2, key)
            
            self.l1.put(key, value)
            if self.l1.last_evicted_key is not None:
                self.l2.put(self.l1.last_evicted_key, self.l1.last_evicted_value)
        else: # inclusive
            # Write to both L1 and L2
            self.l2.put(key, value)
            if self.l2.last_evicted_key is not None:
                force_delete_from_cache(self.l1, self.l2.last_evicted_key)
            self.l1.put(key, value)

    def clear(self) -> None:
        """Clear cache stats and contents."""
        self.l1.clear()
        self.l2.clear()
        self.l1_hits = 0
        self.l1_misses = 0
        self.l2_hits = 0
        self.l2_misses = 0
        self.db_reads = 0
        self.total_requests = 0

    def get_stats(self) -> dict:
        """Calculate and return hit rates, DB queries, and Effective Access Time (EAT)."""
        l1_hit_rate = (self.l1_hits / self.total_requests) * 100 if self.total_requests > 0 else 0.0
        l2_hit_rate = (self.l2_hits / self.total_requests) * 100 if self.total_requests > 0 else 0.0
        db_read_rate = (self.db_reads / self.total_requests) * 100 if self.total_requests > 0 else 0.0
        
        # Calculate Effective Access Time (EAT)
        # EAT = L1_hit_rate * T_L1 + L1_miss_rate * L2_hit_rate * (T_L1 + T_L2) + L1_miss_rate * L2_miss_rate * (T_L1 + T_L2 + T_DB)
        p_l1_hit = self.l1_hits / self.total_requests if self.total_requests > 0 else 0.0
        p_l2_hit = self.l2_hits / self.total_requests if self.total_requests > 0 else 0.0
        p_db_read = self.db_reads / self.total_requests if self.total_requests > 0 else 0.0
        
        eat = (p_l1_hit * self.t_l1) + \
              (p_l2_hit * (self.t_l1 + self.t_l2)) + \
              (p_db_read * (self.t_l1 + self.t_l2 + self.t_db))
              
        return {
            "l1_hits": self.l1_hits,
            "l1_misses": self.l1_misses,
            "l1_hit_rate": round(l1_hit_rate, 2),
            "l2_hits": self.l2_hits,
            "l2_misses": self.l2_misses,
            "l2_hit_rate": round(l2_hit_rate, 2),
            "db_reads": self.db_reads,
            "db_read_rate": round(db_read_rate, 2),
            "total_requests": self.total_requests,
            "eat_us": round(eat, 3),
            "no_cache_eat_us": self.t_db,  # EAT if looking up directly from DB
            "l1_only_eat_us": round((p_l1_hit * self.t_l1) + ((1 - p_l1_hit) * (self.t_l1 + self.t_db)), 3)
        }
