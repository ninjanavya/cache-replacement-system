import random
from typing import List

class ZipfGenerator:
    """Utility class to generate zipf-distributed integers without external dependencies.
    Employs precomputed cumulative distribution function (CDF) and binary search lookup.
    """
    def __init__(self, size: int, alpha: float = 1.01):
        if size <= 0:
            raise ValueError("Size must be positive.")
        self.size = size
        self.alpha = alpha
        
        # Calculate weights: 1 / (i^alpha)
        weights = [1.0 / (i ** alpha) for i in range(1, size + 1)]
        total = sum(weights)
        
        # Calculate Cumulative Distribution Function (CDF)
        self.cdf = []
        current_sum = 0.0
        for w in weights:
            current_sum += w / total
            self.cdf.append(current_sum)
        # Ensure the last value is exactly 1.0 to avoid floating point errors
        self.cdf[-1] = 1.0

    def next(self) -> int:
        """Sample an index in [0, size - 1] based on Zipf distribution."""
        r = random.random()
        # Binary search CDF
        low, high = 0, len(self.cdf) - 1
        while low < high:
            mid = (low + high) // 2
            if self.cdf[mid] < r:
                low = mid + 1
            else:
                high = mid
        return low


class WorkloadGenerator:
    """Generates synthetic traffic patterns of cache access requests (key sequences)."""
    
    @staticmethod
    def generate_random(length: int, universe_size: int, seed: int = None) -> List[str]:
        """Uniform random access workload."""
        if seed is not None:
            random.seed(seed)
        return [f"key_{random.randint(0, universe_size - 1)}" for _ in range(length)]

    @staticmethod
    def generate_zipf(length: int, universe_size: int, alpha: float = 1.01, seed: int = None) -> List[str]:
        """Realistic workload with temporal locality where a few hot keys dominate."""
        if seed is not None:
            random.seed(seed)
        zipf = ZipfGenerator(universe_size, alpha)
        return [f"key_{zipf.next()}" for _ in range(length)]

    @staticmethod
    def generate_sequential_scan(length: int, scan_size: int) -> List[str]:
        """Sequential scan workload, looping through keys in order to simulate a database table scan.
        Guarantees poor performance for caches with capacities smaller than scan_size.
        """
        return [f"key_{i % scan_size}" for i in range(length)]

    @staticmethod
    def generate_mixed(length: int, universe_size: int, seed: int = None) -> List[str]:
        """A mixed workload combining local Zipfian access with periodic sequential scans.
        Simulates realistic system activity (e.g. general reads + daily bulk reporting).
        """
        if seed is not None:
            random.seed(seed)
        
        zipf = ZipfGenerator(universe_size, alpha=1.01)
        workload = []
        
        # Alternate between phases of high locality and scans
        phase_length = length // 4
        
        # Phase 1: Heavy Locality (Zipfian)
        for _ in range(phase_length):
            workload.append(f"key_{zipf.next()}")
            
        # Phase 2: Sequential Scan
        scan_size = universe_size // 2
        for i in range(phase_length):
            workload.append(f"key_{i % scan_size}")
            
        # Phase 3: Heavy Locality (Zipfian)
        for _ in range(phase_length):
            workload.append(f"key_{zipf.next()}")
            
        # Phase 4: Random Scan
        for _ in range(length - len(workload)):
            workload.append(f"key_{random.randint(0, universe_size - 1)}")
            
        return workload
