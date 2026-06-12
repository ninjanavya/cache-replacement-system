from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import time

from cache import FIFOCache, LRUCache, LFUCache, RedisCache, TwoQueueCache, MultiLevelCache, RandomForestCache
from simulator import WorkloadGenerator, CacheBenchmark

app = FastAPI(
    title="Smart Cache Management System API",
    description="Backend API for simulating and benchmarking cache policies.",
    version="1.0.0"
)

# Enable CORS for localhost frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BenchmarkRequest(BaseModel):
    capacity: int = Field(100, ge=1, le=10000)
    length: int = Field(1000, ge=10, le=100000)
    universe_size: int = Field(500, ge=2, le=50000)
    alpha: float = Field(1.01, ge=0.01, le=3.0)
    workload_type: str = Field("zipf", pattern="^(random|zipf|scan|mixed)$")


@app.get("/api/health")
def health_check():
    """Verify backend is running."""
    return {"status": "healthy", "timestamp": time.time()}


@app.post("/api/benchmark")
def benchmark_caches(req: BenchmarkRequest) -> Dict[str, Any]:
    """Run simulations on FIFO, LRU, and LFU caches and generate:
    1. Summary metrics (hit rate, latency, evictions).
    2. Time-series data representing the running hit rate trend.
    """
    # 1. Generate workload
    if req.workload_type == "random":
        workload = WorkloadGenerator.generate_random(req.length, req.universe_size, seed=42)
        workload_name = "Random (Uniform)"
    elif req.workload_type == "zipf":
        workload = WorkloadGenerator.generate_zipf(req.length, req.universe_size, req.alpha, seed=42)
        workload_name = f"Zipfian Skewed (alpha={req.alpha})"
    elif req.workload_type == "scan":
        scan_size = int(req.capacity * 1.5)
        workload = WorkloadGenerator.generate_sequential_scan(req.length, scan_size)
        workload_name = f"Sequential Scan (size={scan_size})"
    elif req.workload_type == "mixed":
        workload = WorkloadGenerator.generate_mixed(req.length, req.universe_size, seed=42)
        workload_name = "Mixed (Locality + Scan)"
    else:
        raise HTTPException(status_code=400, detail="Invalid workload type.")

    policies = [FIFOCache, LRUCache, LFUCache, TwoQueueCache, RedisCache, RandomForestCache]
    benchmark = CacheBenchmark(req.capacity)
    
    # 2. Run standard benchmarking for summary results
    summary_results = benchmark.run_all(policies, workload)
    
    # 3. Generate detailed running hit rate trend data for visualization
    # We collect ~50 checkpoints to keep the frontend chart smooth
    num_points = 50
    interval = max(1, req.length // num_points)
    
    trends: Dict[str, Any] = {
        "labels": [],
        "FIFOCache": [],
        "LRUCache": [],
        "LFUCache": [],
        "TwoQueueCache": [],
        "RedisCache": [],
        "RandomForestCache": []
    }
    
    labels_populated = False
    
    for policy_class in policies:
        name = policy_class.__name__
        cache = policy_class(req.capacity)
        
        running_hits = 0
        for i, key in enumerate(workload):
            val = cache.get(key)
            if val is None:
                # Miss: write mock data
                cache.put(key, f"val_{key}")
            else:
                running_hits += 1
                
            # Log data point at interval boundary or at the very end
            current_index = i + 1
            if current_index % interval == 0 or current_index == req.length:
                running_hit_rate = (running_hits / current_index) * 100
                trends[name].append(round(running_hit_rate, 2))
                
                if not labels_populated:
                    trends["labels"].append(current_index)
                    
        labels_populated = True
        
    # Generate workload statistics
    freq_map = {}
    for key in workload:
        freq_map[key] = freq_map.get(key, 0) + 1
        
    sequence_sample = workload[:200]
        
    return {
        "workload_name": workload_name,
        "summary": summary_results,
        "trends": trends,
        "freq_map": freq_map,
        "sequence_sample": sequence_sample
    }

class MultiLevelRequest(BaseModel):
    l1_policy: str = Field("LRUCache", pattern="^(LRUCache|LFUCache|FIFOCache|TwoQueueCache)$")
    l1_capacity: int = Field(20, ge=1, le=1000)
    l2_policy: str = Field("RedisCache", pattern="^(LRUCache|LFUCache|FIFOCache|TwoQueueCache|RedisCache)$")
    l2_capacity: int = Field(100, ge=1, le=10000)
    policy_mode: str = Field("exclusive", pattern="^(inclusive|exclusive)$")
    t_l1: float = Field(1.0, ge=0.0)
    t_l2: float = Field(10.0, ge=0.0)
    t_db: float = Field(250.0, ge=0.0)
    length: int = Field(1000, ge=10, le=100000)
    universe_size: int = Field(500, ge=2, le=50000)
    alpha: float = Field(1.01, ge=0.01, le=3.0)
    workload_type: str = Field("zipf", pattern="^(random|zipf|scan|mixed)$")


POLICY_MAP = {
    "LRUCache": LRUCache,
    "LFUCache": LFUCache,
    "FIFOCache": FIFOCache,
    "TwoQueueCache": TwoQueueCache,
    "RedisCache": RedisCache,
    "RandomForestCache": RandomForestCache
}


@app.post("/api/multilevel")
def benchmark_multilevel(req: MultiLevelRequest) -> Dict[str, Any]:
    """Run simulation on L1 -> L2 -> DB multi-level cache architecture."""
    # 1. Generate workload
    if req.workload_type == "random":
        workload = WorkloadGenerator.generate_random(req.length, req.universe_size, seed=42)
    elif req.workload_type == "zipf":
        workload = WorkloadGenerator.generate_zipf(req.length, req.universe_size, req.alpha, seed=42)
    elif req.workload_type == "scan":
        scan_size = int(req.l2_capacity * 1.5)
        workload = WorkloadGenerator.generate_sequential_scan(req.length, scan_size)
    elif req.workload_type == "mixed":
        workload = WorkloadGenerator.generate_mixed(req.length, req.universe_size, seed=42)
    else:
        raise HTTPException(status_code=400, detail="Invalid workload type.")

    l1_class = POLICY_MAP[req.l1_policy]
    l2_class = POLICY_MAP[req.l2_policy]

    ml_cache = MultiLevelCache(
        l1_class=l1_class,
        l1_capacity=req.l1_capacity,
        l2_class=l2_class,
        l2_capacity=req.l2_capacity,
        policy_mode=req.policy_mode,
        t_l1=req.t_l1,
        t_l2=req.t_l2,
        t_db=req.t_db
    )

    num_points = 50
    interval = max(1, req.length // num_points)
    
    trends = {
        "labels": [],
        "eat_trend": [],
        "l1_hit_rate_trend": [],
        "l2_hit_rate_trend": []
    }
    
    for i, key in enumerate(workload):
        ml_cache.get(key)
        
        current_index = i + 1
        if current_index % interval == 0 or current_index == req.length:
            stats = ml_cache.get_stats()
            trends["labels"].append(current_index)
            trends["eat_trend"].append(stats["eat_us"])
            trends["l1_hit_rate_trend"].append(stats["l1_hit_rate"])
            trends["l2_hit_rate_trend"].append(stats["l2_hit_rate"])

    stats = ml_cache.get_stats()
    return {
        "stats": stats,
        "trends": trends
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
