import numpy as np
from sklearn.ensemble import RandomForestRegressor
from cache.base import BaseCache

class RandomForestCache(BaseCache):
    """Random Forest Cache Policy.
    Uses an online-trained Random Forest Regressor to predict the reuse distance 
    (number of accesses until next request) for keys in the cache, evicting the 
    one with the largest predicted reuse distance (furthest in the future).
    """
    def __init__(self, capacity: int):
        super().__init__(capacity)
        self._cache = {}  # key -> value
        self.history = []  # List of tuples (features, target_reuse_distance)
        self.key_stats = {}  # key -> stats dict
        self.step = 0
        self.model = None
        self.retrain_interval = 100
        self.min_samples_to_train = 40
        self.max_training_samples = 250

    def __len__(self) -> int:
        return len(self._cache)

    def _extract_features(self, key, current_step) -> list:
        """Extract features for a key to predict its reuse distance.
        Features:
        1. Recency: Steps since last access
        2. Frequency: Total access count
        3. Mean interval: Average steps between accesses
        4. Std interval: Standard deviation of steps between accesses
        """
        stats = self.key_stats.get(key, {"frequency": 0, "last_access": -1, "accesses": []})
        frequency = stats["frequency"]
        recency = current_step - stats["last_access"] if stats["last_access"] != -1 else current_step
        
        accesses = stats["accesses"]
        if len(accesses) > 1:
            intervals = np.diff(accesses)
            avg_interval = float(np.mean(intervals))
            std_interval = float(np.std(intervals))
        else:
            # Default values for keys with limited history
            avg_interval = 9999.0
            std_interval = 0.0
            
        return [recency, frequency, avg_interval, std_interval]

    def get(self, key):
        """GET key. Track access history and features, then perform standard lookup."""
        self.step += 1
        
        if key not in self.key_stats:
            self.key_stats[key] = {"frequency": 0, "last_access": -1, "accesses": []}
            
        stats = self.key_stats[key]
        stats["accesses"].append(self.step)
        
        # If this key has been accessed before, we now know the actual reuse distance
        # between the last access and this current access. We can record a training sample.
        if stats["last_access"] != -1 and "prev_features" in stats:
            prev_features = stats["prev_features"]
            reuse_distance = self.step - stats["last_access"]
            self.history.append((prev_features, reuse_distance))
            if len(self.history) > self.max_training_samples:
                self.history.pop(0)
                
        # Extract features for the current state (to be used as features when the next access occurs)
        stats["frequency"] += 1
        stats["prev_features"] = self._extract_features(key, self.step)
        stats["last_access"] = self.step
        
        if key in self._cache:
            self.hits += 1
            return self._cache[key]
        else:
            self.misses += 1
            return None

    def put(self, key, value) -> None:
        """SET key value. Evicts key with longest predicted reuse distance if full."""
        if self.capacity <= 0:
            return
            
        if key in self._cache:
            self._cache[key] = value
            return
            
        if len(self._cache) >= self.capacity:
            self.evictions += 1
            evict_key = self._select_eviction_key()
            self.last_evicted_key = evict_key
            self.last_evicted_value = self._cache[evict_key]
            del self._cache[evict_key]
            
        self._cache[key] = value

    def _select_eviction_key(self) -> str:
        """Select a key to evict using the Random Forest model, or fallback to LRU."""
        # Check if we should retrain
        if self.step % self.retrain_interval == 0 and len(self.history) >= self.min_samples_to_train:
            self._train_model()
            
        if self.model is not None:
            try:
                features_matrix = []
                cached_keys = list(self._cache.keys())
                for k in cached_keys:
                    features_matrix.append(self._extract_features(k, self.step))
                    
                predictions = self.model.predict(features_matrix)
                # Evict the key with the maximum predicted reuse distance (furthest in the future)
                evict_idx = int(np.argmax(predictions))
                return cached_keys[evict_idx]
            except Exception:
                # Fallback on prediction error
                pass
                
        # Fallback: LRU (evict key with largest recency)
        evict_key = None
        max_recency = -1
        for k in self._cache.keys():
            stats = self.key_stats.get(k, {"last_access": self.step})
            recency = self.step - stats["last_access"]
            if recency > max_recency:
                max_recency = recency
                evict_key = k
        return evict_key

    def _train_model(self) -> None:
        """Train a lightweight Random Forest regressor on collected reuse history."""
        try:
            X = [item[0] for item in self.history]
            y = [item[1] for item in self.history]
            # Use small parameters for speed
            rf = RandomForestRegressor(n_estimators=8, max_depth=3, random_state=42)
            rf.fit(X, y)
            self.model = rf
        except Exception:
            pass

    def clear(self) -> None:
        """Reset stats and clear all data structures."""
        super().clear()
        self._cache.clear()
        self.history.clear()
        self.key_stats.clear()
        self.step = 0
        self.model = None
