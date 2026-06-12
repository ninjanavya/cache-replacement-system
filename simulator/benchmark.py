import time
from typing import List, Dict, Type
from cache.base import BaseCache

class CacheBenchmark:
    """Harness to run simulations and compare cache replacement policies."""
    def __init__(self, capacity: int):
        self.capacity = capacity

    def run_policy(self, cache_class: Type[BaseCache], workload: List[str]) -> dict:
        """Run workload against a specific cache policy and return measured metrics."""
        cache = cache_class(self.capacity)
        
        start_time = time.perf_counter()
        
        # Simulate read-through cache access
        for key in workload:
            value = cache.get(key)
            if value is None:
                # Cache miss: fetch "data" from source and populate cache
                cache.put(key, f"val_{key}")
                
        duration_sec = time.perf_counter() - start_time
        avg_latency_us = (duration_sec / len(workload)) * 1_000_000 if workload else 0.0
        
        stats = cache.get_stats()
        stats["name"] = cache.__class__.__name__
        stats["time_sec"] = round(duration_sec, 6)
        stats["avg_latency_us"] = round(avg_latency_us, 3)
        
        # Collect final resident keys for UI visualization
        if cache.__class__.__name__ == "RedisCache":
            if cache.is_mock:
                stats["resident_keys"] = list(cache.client._db.keys())
            else:
                try:
                    stats["resident_keys"] = [k.decode("utf-8") if isinstance(k, bytes) else k for k in cache.client.keys()]
                except Exception:
                    stats["resident_keys"] = []
        else:
            stats["resident_keys"] = list(cache._cache.keys())
            
        return stats

    def run_all(self, policies: List[Type[BaseCache]], workload: List[str]) -> List[dict]:
        """Run all policies and return a list of their execution metrics."""
        results = []
        for policy in policies:
            results.append(self.run_policy(policy, workload))
        return results

    @staticmethod
    def print_results(results: List[dict]) -> None:
        """Helper to format and print benchmark results to console in a nice table."""
        header = f"{'Policy':<12} | {'Capacity':<8} | {'Hit Rate':<10} | {'Hits':<8} | {'Misses':<8} | {'Evictions':<10} | {'Latency (us)':<12}"
        separator = "-" * len(header)
        
        print(separator)
        print(header)
        print(separator)
        for r in results:
            name = r["name"]
            cap = r["capacity"]
            hit_rate = f"{r['hit_rate']}%"
            hits = r["hits"]
            misses = r["misses"]
            evictions = r["evictions"]
            latency = f"{r['avg_latency_us']:.3f}"
            print(f"{name:<12} | {cap:<8} | {hit_rate:<10} | {hits:<8} | {misses:<8} | {evictions:<10} | {latency:<12}")
        print(separator)
        print()
