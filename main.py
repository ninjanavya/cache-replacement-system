import argparse
import sys
from cache import FIFOCache, LRUCache, LFUCache, RedisCache, TwoQueueCache
from simulator import WorkloadGenerator, CacheBenchmark

def run_simulation(capacity: int, length: int, universe_size: int, alpha: float, workload_type: str):
    policies = [FIFOCache, LRUCache, LFUCache, TwoQueueCache, RedisCache]
    benchmark = CacheBenchmark(capacity)
    
    print("=" * 70)
    print(f"CACHE BENCHMARK SIMULATOR")
    print(f"Config: Capacity={capacity}, Workload Length={length}, Key Universe={universe_size}")
    print("=" * 70)
    print()

    workloads = {}
    if workload_type in ["random", "all"]:
        workloads["Random (Uniform) Workload"] = WorkloadGenerator.generate_random(length, universe_size, seed=42)
    if workload_type in ["zipf", "all"]:
        workloads[f"Zipfian Skewed Workload (alpha={alpha})"] = WorkloadGenerator.generate_zipf(length, universe_size, alpha, seed=42)
    if workload_type in ["scan", "all"]:
        # Scan size is set to capacity * 1.5 to guarantee evictions
        scan_size = int(capacity * 1.5)
        workloads[f"Sequential Scan Workload (scan size={scan_size})"] = WorkloadGenerator.generate_sequential_scan(length, scan_size)
    if workload_type in ["mixed", "all"]:
        workloads["Mixed Workload (Locality + Scans)"] = WorkloadGenerator.generate_mixed(length, universe_size, seed=42)

    for name, workload in workloads.items():
        print(f"--- Running: {name} ---")
        results = benchmark.run_all(policies, workload)
        benchmark.print_results(results)


def main():
    parser = argparse.ArgumentParser(description="Smart Cache Management System CLI Benchmark Simulator")
    parser.add_argument("-c", "--capacity", type=int, default=100, help="Cache capacity limit (default: 100)")
    parser.add_argument("-l", "--length", type=int, default=10000, help="Workload length / number of requests (default: 10000)")
    parser.add_argument("-u", "--universe", type=int, default=1000, help="Size of unique key universe (default: 1000)")
    parser.add_argument("-a", "--alpha", type=float, default=1.01, help="Zipf distribution alpha coefficient (default: 1.01)")
    parser.add_argument("-w", "--workload", type=str, default="all", choices=["random", "zipf", "scan", "mixed", "all"],
                        help="Specific workload pattern to test (default: all)")

    args = parser.parse_args()
    
    if args.capacity <= 0:
        print("Error: Capacity must be a positive integer.", file=sys.stderr)
        sys.exit(1)
    if args.length <= 0:
        print("Error: Length must be a positive integer.", file=sys.stderr)
        sys.exit(1)
    if args.universe <= 0:
        print("Error: Universe size must be a positive integer.", file=sys.stderr)
        sys.exit(1)

    run_simulation(args.capacity, args.length, args.universe, args.alpha, args.workload)

if __name__ == "__main__":
    main()
