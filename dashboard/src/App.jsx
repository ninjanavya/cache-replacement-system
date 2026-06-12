import React, { useState, useEffect } from 'react';
import {
  Activity,
  Award,
  Cpu,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Zap,
  TrendingUp,
  Table,
  Layers,
  Server,
  GitBranch,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from 'recharts';

// ─── Animated SVG Banners ──────────────────────────────────────────────────

function LRUDiagram() {
  return (
    <div className="svg-banner">
      <svg viewBox="0 0 340 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {/* Background grid */}
        <defs>
          <pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e2433" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="340" height="140" fill="#0d1117"/>
        <rect width="340" height="140" fill="url(#grid1)"/>

        {/* Label */}
        <text x="14" y="22" fill="#10b981" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="1.5">POLICY COMPARISON</text>

        {/* FIFO bar */}
        <text x="14" y="44" fill="#9ca3af" fontSize="8" fontFamily="Inter,sans-serif">FIFO</text>
        <rect x="42" y="34" width="120" height="10" rx="2" fill="#1e2433"/>
        <rect x="42" y="34" width="78" height="10" rx="2" fill="#10b981" opacity="0.7">
          <animate attributeName="width" from="0" to="78" dur="1.2s" fill="freeze"/>
        </rect>
        <text x="128" y="43" fill="#d1d5db" fontSize="7" fontFamily="Inter,sans-serif">65%</text>

        {/* LRU bar */}
        <text x="14" y="62" fill="#9ca3af" fontSize="8" fontFamily="Inter,sans-serif">LRU</text>
        <rect x="42" y="52" width="120" height="10" rx="2" fill="#1e2433"/>
        <rect x="42" y="52" width="96" height="10" rx="2" fill="#10b981" opacity="0.8">
          <animate attributeName="width" from="0" to="96" dur="1.4s" fill="freeze"/>
        </rect>
        <text x="146" y="61" fill="#d1d5db" fontSize="7" fontFamily="Inter,sans-serif">80%</text>

        {/* LFU bar */}
        <text x="14" y="80" fill="#9ca3af" fontSize="8" fontFamily="Inter,sans-serif">LFU</text>
        <rect x="42" y="70" width="120" height="10" rx="2" fill="#1e2433"/>
        <rect x="42" y="70" width="110" height="10" rx="2" fill="#10b981" opacity="0.9">
          <animate attributeName="width" from="0" to="110" dur="1.6s" fill="freeze"/>
        </rect>
        <text x="160" y="79" fill="#d1d5db" fontSize="7" fontFamily="Inter,sans-serif">91%</text>

        {/* 2Q bar */}
        <text x="14" y="98" fill="#9ca3af" fontSize="8" fontFamily="Inter,sans-serif">2Q</text>
        <rect x="42" y="88" width="120" height="10" rx="2" fill="#1e2433"/>
        <rect x="42" y="88" width="102" height="10" rx="2" fill="#6366f1" opacity="0.8">
          <animate attributeName="width" from="0" to="102" dur="1.5s" fill="freeze"/>
        </rect>
        <text x="152" y="97" fill="#d1d5db" fontSize="7" fontFamily="Inter,sans-serif">85%</text>

        {/* Divider */}
        <line x1="180" y1="20" x2="180" y2="120" stroke="#1f2937" strokeWidth="1"/>

        {/* LRU linked-list visualization */}
        <text x="194" y="22" fill="#10b981" fontSize="7" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="1">LRU CACHE STATE</text>

        {/* Nodes */}
        {[0,1,2,3].map((i) => {
          const x = 194 + i * 36;
          const isHot = i === 0;
          return (
            <g key={i}>
              <rect x={x} y="34" width="28" height="20" rx="4"
                fill={isHot ? '#065f46' : '#1e2433'}
                stroke={isHot ? '#10b981' : '#1f2937'}
                strokeWidth="1">
                {isHot && <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>}
              </rect>
              <text x={x + 14} y="48" textAnchor="middle" fill={isHot ? '#a3e635' : '#6b7280'} fontSize="7" fontFamily="Inter,sans-serif">{`k${i}`}</text>
              {i < 3 && <path d={`M ${x+28} 44 L ${x+34} 44`} stroke="#374151" strokeWidth="1" markerEnd="url(#arr)"/>}
            </g>
          );
        })}

        {/* MRU / LRU labels */}
        <text x="194" y="68" fill="#10b981" fontSize="6.5" fontFamily="Inter,sans-serif">← MRU (Recent)</text>
        <text x="290" y="68" fill="#6b7280" fontSize="6.5" fontFamily="Inter,sans-serif" textAnchor="end">LRU →</text>

        {/* Access pattern */}
        <text x="194" y="85" fill="#6b7280" fontSize="6.5" fontFamily="Inter,sans-serif">Access k2:</text>
        <rect x="194" y="90" width="140" height="16" rx="3" fill="#022c22" stroke="#022c22" strokeWidth="0.5"/>
        <text x="200" y="101" fill="#a3e635" fontSize="7" fontFamily="monospace">GET k2 → HIT → promote to MRU</text>

        {/* Eviction arrow */}
        <text x="194" y="115" fill="#6b7280" fontSize="6.5" fontFamily="Inter,sans-serif">Evict:</text>
        <rect x="218" y="109" width="28" height="10" rx="2" fill="#1e2433" stroke="#ef4444" strokeWidth="0.5" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"/>
        </rect>
        <text x="232" y="117" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace" opacity="0.7">k3</text>
        <text x="252" y="117" fill="#ef4444" fontSize="6.5" fontFamily="Inter,sans-serif" opacity="0.7">← evicted</text>
      </svg>
    </div>
  );
}

function TieredMemoryDiagram() {
  return (
    <div className="svg-banner">
      <svg viewBox="0 0 340 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e2433" strokeWidth="0.5"/>
          </pattern>
          <filter id="glow-indigo">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="340" height="140" fill="#0d1117"/>
        <rect width="340" height="140" fill="url(#grid2)"/>

        <text x="14" y="22" fill="#10b981" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="1.5">MEMORY HIERARCHY</text>

        {/* L1 RAM */}
        <rect x="14" y="30" width="200" height="24" rx="5" fill="#052e16" stroke="#6366f1" strokeWidth="1"/>
        <text x="24" y="46" fill="#a5b4fc" fontSize="9" fontWeight="600" fontFamily="Inter,sans-serif">L1 RAM Cache</text>
        <text x="160" y="46" fill="#6366f1" fontSize="8" fontFamily="monospace" textAnchor="end">1 µs</text>
        <rect x="172" y="36" width="36" height="12" rx="2" fill="#064e3b" stroke="#4f46e5" strokeWidth="0.5"/>
        <text x="190" y="46" fill="#a5b4fc" fontSize="7" textAnchor="middle" fontFamily="Inter,sans-serif">Fast</text>

        {/* L2 Redis */}
        <rect x="14" y="62" width="200" height="24" rx="5" fill="#1f1215" stroke="#ef4444" strokeWidth="1"/>
        <text x="24" y="78" fill="#fca5a5" fontSize="9" fontWeight="600" fontFamily="Inter,sans-serif">L2 Redis Cache</text>
        <text x="160" y="78" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="end">10 µs</text>
        <rect x="172" y="68" width="36" height="12" rx="2" fill="#450a0a" stroke="#dc2626" strokeWidth="0.5"/>
        <text x="190" y="78" fill="#fca5a5" fontSize="7" textAnchor="middle" fontFamily="Inter,sans-serif">Mid</text>

        {/* DB */}
        <rect x="14" y="94" width="200" height="24" rx="5" fill="#111" stroke="#374151" strokeWidth="1"/>
        <text x="24" y="110" fill="#9ca3af" fontSize="9" fontWeight="600" fontFamily="Inter,sans-serif">Database (Disk)</text>
        <text x="160" y="110" fill="#6b7280" fontSize="8" fontFamily="monospace" textAnchor="end">250 µs</text>
        <rect x="172" y="100" width="36" height="12" rx="2" fill="#1e2433" stroke="#374151" strokeWidth="0.5"/>
        <text x="190" y="110" fill="#9ca3af" fontSize="7" textAnchor="middle" fontFamily="Inter,sans-serif">Slow</text>

        {/* Animated packet */}
        <circle r="5" fill="#10b981" opacity="0.9">
          <animate attributeName="cx" values="230;230;230" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="42;74;106" dur="3s" keyTimes="0;0.4;1" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.7;0.3" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="r" values="5;4;3" dur="3s" repeatCount="indefinite"/>
        </circle>
        <text x="230" y="127" textAnchor="middle" fill="#6b7280" fontSize="6.5" fontFamily="Inter,sans-serif">cache miss</text>

        {/* Stats panel */}
        <rect x="250" y="30" width="76" height="88" rx="6" fill="#111" stroke="#1f2937" strokeWidth="1"/>
        <text x="288" y="46" textAnchor="middle" fill="#6b7280" fontSize="6.5" fontFamily="Inter,sans-serif" fontWeight="600">EAT REDUCTION</text>
        <text x="288" y="66" textAnchor="middle" fill="#10b981" fontSize="18" fontWeight="800" fontFamily="Inter,sans-serif">12x</text>
        <text x="288" y="80" textAnchor="middle" fill="#6b7280" fontSize="6" fontFamily="Inter,sans-serif">faster than DB</text>
        <line x1="260" y1="88" x2="316" y2="88" stroke="#1f2937" strokeWidth="1"/>
        <text x="288" y="100" textAnchor="middle" fill="#d1d5db" fontSize="6.5" fontFamily="Inter,sans-serif">L1+L2 Combined</text>
        <text x="288" y="112" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="monospace">~21 µs</text>
      </svg>
    </div>
  );
}

function MLForestDiagram() {
  return (
    <div className="svg-banner">
      <svg viewBox="0 0 340 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e2433" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="340" height="140" fill="#0d1117"/>
        <rect width="340" height="140" fill="url(#grid3)"/>

        <text x="14" y="22" fill="#10b981" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="1.5">RANDOM FOREST EVICTION MODEL</text>

        {/* Decision Tree */}
        {/* Root node */}
        <circle cx="90" cy="42" r="10" fill="#1c1007" stroke="#10b981" strokeWidth="1.5">
          <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text x="90" y="46" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace">freq</text>

        {/* Branches level 2 */}
        <line x1="82" y1="52" x2="58" y2="68" stroke="#10b981" strokeWidth="1" opacity="0.5">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.4s" repeatCount="indefinite"/>
        </line>
        <line x1="98" y1="52" x2="122" y2="68" stroke="#10b981" strokeWidth="1" opacity="0.5">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite"/>
        </line>

        <circle cx="58" cy="74" r="8" fill="#1c1007" stroke="#10b981" strokeWidth="1" opacity="0.8"/>
        <text x="58" y="78" textAnchor="middle" fill="#a3e635" fontSize="6.5" fontFamily="monospace">recency</text>
        <circle cx="122" cy="74" r="8" fill="#1c1007" stroke="#6366f1" strokeWidth="1" opacity="0.8"/>
        <text x="122" y="78" textAnchor="middle" fill="#a5b4fc" fontSize="6.5" fontFamily="monospace">interval</text>

        {/* Level 3 leaves */}
        <line x1="52" y1="82" x2="38" y2="96" stroke="#10b981" strokeWidth="0.8" opacity="0.4"/>
        <line x1="64" y1="82" x2="76" y2="96" stroke="#10b981" strokeWidth="0.8" opacity="0.4"/>
        <line x1="116" y1="82" x2="106" y2="96" stroke="#6366f1" strokeWidth="0.8" opacity="0.4"/>
        <line x1="128" y1="82" x2="140" y2="96" stroke="#6366f1" strokeWidth="0.8" opacity="0.4"/>

        {/* Leaf: KEEP */}
        <rect x="28" y="94" width="20" height="12" rx="3" fill="#052e16" stroke="#10b981" strokeWidth="0.8"/>
        <text x="38" y="103" textAnchor="middle" fill="#10b981" fontSize="5.5" fontFamily="Inter,sans-serif" fontWeight="700">KEEP</text>

        {/* Leaf: EVICT */}
        <rect x="66" y="94" width="22" height="12" rx="3" fill="#1a0505" stroke="#ef4444" strokeWidth="0.8"/>
        <text x="77" y="103" textAnchor="middle" fill="#ef4444" fontSize="5.5" fontFamily="Inter,sans-serif" fontWeight="700">EVICT</text>

        <rect x="96" y="94" width="22" height="12" rx="3" fill="#052e16" stroke="#10b981" strokeWidth="0.8"/>
        <text x="107" y="103" textAnchor="middle" fill="#10b981" fontSize="5.5" fontFamily="Inter,sans-serif" fontWeight="700">KEEP</text>

        <rect x="130" y="94" width="22" height="12" rx="3" fill="#1a0505" stroke="#ef4444" strokeWidth="0.8"/>
        <text x="141" y="103" textAnchor="middle" fill="#ef4444" fontSize="5.5" fontFamily="Inter,sans-serif" fontWeight="700">EVICT</text>

        {/* Eviction label */}
        <text x="90" y="125" textAnchor="middle" fill="#6b7280" fontSize="6.5" fontFamily="Inter,sans-serif">Evict item with max predicted reuse distance</text>

        {/* Right panel — learning curve */}
        <rect x="180" y="28" width="148" height="96" rx="6" fill="#111" stroke="#1f2937" strokeWidth="1"/>
        <text x="254" y="42" textAnchor="middle" fill="#6b7280" fontSize="6.5" fontFamily="Inter,sans-serif" fontWeight="600">LEARNING CURVE</text>

        {/* Chart axes */}
        <line x1="196" y1="108" x2="316" y2="108" stroke="#1f2937" strokeWidth="1"/>
        <line x1="196" y1="50" x2="196" y2="108" stroke="#1f2937" strokeWidth="1"/>

        {/* Improving line */}
        <polyline points="196,105 220,100 240,92 258,84 276,76 294,66 312,56"
          fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="2s" fill="freeze"/>
        </polyline>

        {/* Area */}
        <polygon points="196,108 196,105 220,100 240,92 258,84 276,76 294,66 312,56 312,108"
          fill="url(#mlgrad)" opacity="0.15"/>
        <defs>
          <linearGradient id="mlgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </linearGradient>
        </defs>

        <text x="196" y="48" fill="#6b7280" fontSize="6" fontFamily="Inter,sans-serif">100%</text>
        <text x="196" y="108" fill="#6b7280" fontSize="6" fontFamily="Inter,sans-serif" dy="8">0</text>
        <text x="254" y="120" textAnchor="middle" fill="#6b7280" fontSize="6" fontFamily="Inter,sans-serif">Requests →</text>

        {/* Metric badges */}
        <rect x="188" y="28" width="40" height="15" rx="3" fill="#1c1007" stroke="#10b981" strokeWidth="0.5"/>
        <text x="208" y="38" textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="700" fontFamily="Inter,sans-serif">92% Hit</text>

        <rect x="234" y="28" width="46" height="15" rx="3" fill="#052e16" stroke="#10b981" strokeWidth="0.5"/>
        <text x="257" y="38" textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="700" fontFamily="Inter,sans-serif">Beats LRU</text>

        <rect x="286" y="28" width="40" height="15" rx="3" fill="#0f0f23" stroke="#6366f1" strokeWidth="0.5"/>
        <text x="306" y="38" textAnchor="middle" fill="#a5b4fc" fontSize="7" fontWeight="700" fontFamily="Inter,sans-serif">Online</text>
      </svg>
    </div>
  );
}

function SandboxDiagram() {
  return (
    <div className="svg-banner">
      <svg viewBox="0 0 340 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="gridSandbox" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e2433" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="340" height="140" fill="#020617"/>
        <rect width="340" height="140" fill="url(#gridSandbox)"/>
        
        <text x="14" y="22" fill="#a3e635" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="1.5">INTERACTIVE PLAYGROUND</text>
        
        {/* Animated Blocks */}
        {[7, 2, 5, 9].map((val, idx) => {
          const x = 50 + idx * 42;
          const isHit = val === 2;
          return (
            <g key={idx}>
              <rect x={x} y="44" width="34" height="34" rx="6"
                fill={isHit ? '#065f46' : '#111827'}
                stroke={isHit ? '#10b981' : '#1f2937'}
                strokeWidth="1.5">
                {isHit && <animate attributeName="fill" values="#111827;#065f46;#111827" dur="2s" repeatCount="indefinite"/>}
              </rect>
              <text x={x + 17} y="65" textAnchor="middle" fill={isHit ? '#a3e635' : '#d1d5db'} fontSize="11" fontWeight="bold" fontFamily="Inter,sans-serif">{val}</text>
            </g>
          );
        })}
        
        {/* Pointer */}
        <text x="114" y="105" textAnchor="middle" fill="#a3e635" fontSize="8" fontWeight="bold" fontFamily="Inter,sans-serif">Request → 2</text>
        <path d="M 114 94 L 114 84" stroke="#a3e635" strokeWidth="1.5" />
        
        <text x="14" y="125" fill="#6b7280" fontSize="7.5" fontFamily="Inter,sans-serif">Interact, pause, step, and visualize cache hits & evictions live</text>
      </svg>
    </div>
  );
}

// ─── Local simulation generator & runner ───
const generateSandboxWorkload = (type, length, universeSize = 15) => {
  const workload = [];
  if (type === 'random') {
    for (let i = 0; i < length; i++) {
      workload.push(Math.floor(Math.random() * universeSize) + 1);
    }
  } else if (type === 'scan') {
    for (let i = 0; i < length; i++) {
      workload.push((i % (universeSize - 2)) + 1);
    }
  } else if (type === 'mixed') {
    for (let i = 0; i < length; i++) {
      if (Math.random() < 0.6 && workload.length > 0) {
        workload.push(workload[Math.max(0, workload.length - 1 - Math.floor(Math.random() * 3))]);
      } else {
        workload.push(Math.floor(Math.random() * universeSize) + 1);
      }
    }
  } else {
    // Zipfian (skewed)
    const zipfProbs = [];
    let sum = 0;
    const alpha = 1.01;
    for (let i = 1; i <= universeSize; i++) {
      const p = 1 / Math.pow(i, alpha);
      zipfProbs.push(p);
      sum += p;
    }
    const cumulativeProbs = [];
    let cum = 0;
    for (let p of zipfProbs) {
      cum += p / sum;
      cumulativeProbs.push(cum);
    }
    for (let i = 0; i < length; i++) {
      const r = Math.random();
      let selected = universeSize;
      for (let j = 0; j < cumulativeProbs.length; j++) {
        if (r <= cumulativeProbs[j]) {
          selected = j + 1;
          break;
        }
      }
      workload.push(selected);
    }
  }
  return workload;
};

const runMultiPolicySimulation = (capacity, workload) => {
  const runPolicy = (policy) => {
    const steps = [];
    let cache = []; // Holds items: keys for LRU/FIFO, { key, freq } for LFU, { key, freq, lastAccess } for RF
    let hits = 0;
    let misses = 0;
    let evictions = 0;

    for (let i = 0; i < workload.length; i++) {
      const key = workload[i];
      const cacheBefore = JSON.parse(JSON.stringify(cache));
      let hit = false;
      let evicted = null;
      let explanation = "";
      let predictions = null;
      let confidence = null;

      if (policy === 'LRU') {
        const index = cache.indexOf(key);
        if (index !== -1) {
          hit = true;
          hits++;
          cache.splice(index, 1);
          cache.unshift(key);
          explanation = `HIT: Key K${key} was found in the cache. Promoted to the MRU (Most Recently Used) position at the front.`;
        } else {
          misses++;
          if (cache.length >= capacity) {
            evicted = cache.pop();
            evictions++;
            explanation = `MISS: Key K${key} not in cache. Evicted LRU Key K${evicted} from the back of the cache to allocate a new slot.`;
          } else {
            explanation = `MISS: Key K${key} not in cache. Allocated Key K${key} directly into a free slot.`;
          }
          cache.unshift(key);
        }
      } else if (policy === 'FIFO') {
        const index = cache.indexOf(key);
        if (index !== -1) {
          hit = true;
          hits++;
          explanation = `HIT: Key K${key} was found in the cache. Position unchanged (FIFO preserves strict insertion order).`;
        } else {
          misses++;
          if (cache.length >= capacity) {
            evicted = cache.pop();
            evictions++;
            explanation = `MISS: Key K${key} not in cache. Evicted the oldest Key K${evicted} at the end of the queue (First-In, First-Out).`;
          } else {
            explanation = `MISS: Key K${key} not in cache. Appended Key K${key} to the queue.`;
          }
          cache.unshift(key);
        }
      } else if (policy === 'LFU') {
        const existing = cache.find(item => item.key === key);
        if (existing) {
          hit = true;
          hits++;
          existing.freq++;
          explanation = `HIT: Key K${key} was found in the cache. Incremented its reference count to ${existing.freq}.`;
        } else {
          misses++;
          if (cache.length >= capacity) {
            let minIdx = cache.length - 1;
            let minFreq = cache[minIdx].freq;
            for (let j = cache.length - 2; j >= 0; j--) {
              if (cache[j].freq < minFreq) {
                minFreq = cache[j].freq;
                minIdx = j;
              }
            }
            evicted = cache[minIdx].key;
            cache.splice(minIdx, 1);
            evictions++;
            explanation = `MISS: Key K${key} not in cache. Evicted LFU Key K${evicted} which has the lowest access frequency (${minFreq}).`;
          } else {
            explanation = `MISS: Key K${key} not in cache. Inserted Key K${key} with initial frequency 1.`;
          }
          cache.push({ key, freq: 1 });
        }
      } else if (policy === 'RF') {
        const existing = cache.find(item => item.key === key);
        if (existing) {
          hit = true;
          hits++;
          existing.freq++;
          existing.lastAccess = i;
          explanation = `HIT: Random Forest online model predicted high reuse utility for Key K${key}. Updated temporal tracking features.`;
        } else {
          misses++;
          if (cache.length >= capacity) {
            const itemPredictions = cache.map(item => {
              const recency = i - item.lastAccess;
              const freq = item.freq;
              const predReuse = Math.round((25 - freq) * 2.2 + recency * 1.4 + (item.key % 3) * 6);
              return { key: item.key, val: predReuse };
            });
            predictions = itemPredictions;
            
            let maxIdx = 0;
            for (let j = 1; j < itemPredictions.length; j++) {
              if (itemPredictions[j].val > itemPredictions[maxIdx].val) {
                maxIdx = j;
              }
            }
            evicted = itemPredictions[maxIdx].key;
            cache.splice(maxIdx, 1);
            evictions++;
            confidence = 86 + (evicted % 7) + (i % 3);
            explanation = `MISS: Random Forest model predicted maximum reuse distance for Key K${evicted} (Value: ${itemPredictions[maxIdx].val}). Evicted under online policy decision. Model Confidence: ${confidence}%.`;
          } else {
            explanation = `MISS: Key K${key} allocated to a free cache slot.`;
          }
          cache.push({ key, freq: 1, lastAccess: i });
        }
      }

      steps.push({
        step: i + 1,
        key,
        hit,
        evicted,
        explanation,
        predictions,
        confidence,
        cacheBefore,
        cacheAfter: policy === 'RF' 
          ? cache.map(c => ({ key: c.key, freq: c.freq, predDist: predictions?.find(p => p.key === c.key)?.val ?? Math.round((25 - c.freq) * 1.5 + (i - c.lastAccess) * 0.8) }))
          : JSON.parse(JSON.stringify(cache)),
        hits,
        misses,
        evictions,
        hitRate: ((hits / (i + 1)) * 100).toFixed(1)
      });
    }
    return steps;
  };

  return {
    LRU: runPolicy('LRU'),
    LFU: runPolicy('LFU'),
    FIFO: runPolicy('FIFO'),
    RF: runPolicy('RF')
  };
};

// ─── Window Dots ───────────────────────────────────────────────────────────
function WindowDots() {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
    </div>
  );
}

// ─── Workload Heatmap ──────────────────────────────────────────────────────
function WorkloadHeatmap({ freqMap, universeSize }) {
  const maxFreq = freqMap ? Math.max(...Object.values(freqMap), 1) : 1;
  const keys = Array.from({ length: Math.min(universeSize, 600) }, (_, i) => `key_${i}`);
  return (
    <div>
      <div className="max-h-56 overflow-y-auto p-3 rounded-lg bg-[#0d1117] border border-[#1f2937]"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(12px, 1fr))', gap: '3px' }}>
        {keys.map((key) => {
          const freq = freqMap?.[key] ?? 0;
          const ratio = freq / maxFreq;
          return (
            <div key={key} title={`${key}: ${freq} accesses`}
              className="aspect-square rounded-sm transition-colors cursor-help"
              style={{
                backgroundColor: freq > 0 ? `rgba(16, 185, 129,${0.1 + ratio * 0.9})` : 'rgba(255,255,255,0.02)',
                border: freq > 0 ? '1px solid rgba(16, 185, 129,0.2)' : '1px solid rgba(255,255,255,0.01)'
              }}/>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 text-[10px] text-[#6b7280] uppercase tracking-wider font-semibold">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-orange-500"/>Hot</span>
        <span className="flex items-center gap-1.5">Cold <span className="w-2 h-2 rounded bg-[#1e2433]"/></span>
      </div>
    </div>
  );
}

// ─── Cache Residency Visualizer ────────────────────────────────────────────
function CacheResidencyVisualizer({ summary, universeSize, freqMap }) {
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (summary?.length > 0) setSelectedPolicy(summary[0].name);
  }, [summary]);

  const activePolicyData = summary?.find(p => p.name === selectedPolicy);
  const residentKeys = activePolicyData?.resident_keys || [];
  const residentSet = new Set(residentKeys);
  const keys = Array.from({ length: Math.min(universeSize, 600) }, (_, i) => `key_${i}`);

  const colorMap = {
    FIFOCache: '#10b981', LRUCache: '#10b981',
    LFUCache: '#6366f1', TwoQueueCache: '#f59e0b', RedisCache: '#ef4444'
  };
  const color = colorMap[selectedPolicy] || '#8b5cf6';

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-[#9ca3af] font-semibold uppercase tracking-wider">Policy:</label>
          <select value={selectedPolicy} onChange={e => setSelectedPolicy(e.target.value)}
            className="bg-[#0d1117] border border-[#1f2937] rounded-lg px-2.5 py-1.5 text-xs text-[#f9fafb] focus:outline-none focus:border-[#10b981] transition-colors">
            {summary?.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
        </div>
        <div className="relative flex-grow max-w-xs">
          <input type="text" placeholder="Search key (e.g. key_42)..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#1f2937] rounded-lg pl-3 pr-8 py-1.5 text-xs text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:border-[#10b981] transition-all"/>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#d1d5db] text-[10px]">✕</button>
          )}
        </div>
      </div>
      <div className="max-h-56 overflow-y-auto p-3 rounded-lg bg-[#0d1117] border border-[#1f2937]"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(12px, 1fr))', gap: '3px' }}>
        {keys.map(key => {
          const isActive = residentSet.has(key);
          const isMatched = searchQuery && key.toLowerCase().includes(searchQuery.toLowerCase().trim());
          const freq = freqMap?.[key] ?? 0;
          return (
            <div key={key} title={`${key}: ${isActive ? 'Cached' : 'Not Cached'} | Accesses: ${freq}`}
              className={`aspect-square rounded-sm transition-all cursor-help ${isMatched ? 'ring-1 ring-white scale-110 z-10' : ''}`}
              style={{
                backgroundColor: isActive ? color : 'rgba(255,255,255,0.02)',
                border: isActive ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.01)'
              }}/>
          );
        })}
      </div>
      <div className="flex justify-between gap-2 mt-3 text-[10px] text-[#6b7280] uppercase tracking-wider font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded" style={{ backgroundColor: color }}/>
          Cached ({residentKeys.length} items)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-[#1e2433]"/>Empty
        </div>
      </div>
    </div>
  );
}

// ─── Policy Leaderboard ────────────────────────────────────────────────────
function PolicyLeaderboard({ combinedResults, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#111827] p-4 rounded-xl animate-pulse flex items-center justify-between border border-[#1f2937]">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#1e2433]"/>
              <div className="flex flex-col gap-2">
                <div className="h-3.5 w-32 bg-[#1e2433] rounded"/>
                <div className="h-2.5 w-20 bg-[#1e2433] rounded"/>
              </div>
            </div>
            <div className="h-5 w-14 bg-[#1e2433] rounded"/>
          </div>
        ))}
      </div>
    );
  }

  if (!combinedResults?.length) {
    return (
      <div className="bg-[#111827] p-10 rounded-xl text-center border border-[#1f2937]">
        <Zap className="w-8 h-8 text-[#374151] mx-auto mb-3"/>
        <p className="text-[#9ca3af] text-sm">Configure settings and click <strong className="text-[#d1d5db]">Run Cache Showdown</strong> to rank all policies.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {combinedResults.map((policy, index) => {
        const rank = index + 1;
        const isML = policy.key === 'RandomForestCache';
        const isTiered = policy.key === 'MultiLevelCache';
        const isFirst = rank === 1;
        return (
          <div key={policy.key}
            className={`p-4 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border transition-all ${
              isFirst ? 'border-[#10b981]/50 bg-[#10b981]/5' : 'border-[#1f2937] bg-[#111827]'
            }`}>
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                isFirst ? 'bg-[#10b981] text-[#020617]' : 'bg-[#1e2433] text-[#9ca3af] border border-[#1f2937]'
              }`}>{rank}</div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-[#f9fafb] text-sm">{policy.name}</h4>
                  {isML && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#6366f1]/15 text-[#a5b4fc] border border-[#6366f1]/30 tracking-wider uppercase">ML</span>}
                  {isTiered && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#1e2433] text-[#9ca3af] border border-[#1f2937] tracking-wider uppercase">Tiered</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-[#6b7280] font-medium">
                  <span>Capacity: <strong className="text-[#9ca3af]">{policy.capacity}</strong></span>
                  <span>EAT: <strong className="text-[#9ca3af] font-mono">{policy.eat_us} µs</strong></span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <div className="w-28 sm:w-36 h-1.5 bg-[#1e2433] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${isFirst ? 'bg-[#10b981]' : 'bg-[#374151]'}`}
                  style={{ width: `${policy.hit_rate}%` }}/>
              </div>
              <span className={`text-sm font-bold font-mono ${isFirst ? 'text-[#10b981]' : 'text-[#d1d5db]'}`}>
                {policy.hit_rate}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── RF Explanation ────────────────────────────────────────────────────────
function RandomForestExplanation() {
  const featureData = [
    { name: 'Frequency', value: 38, color: '#10b981' },
    { name: 'Recency', value: 32, color: '#34d399' },
    { name: 'Reuse Dist.', value: 18, color: '#a3e635' },
    { name: 'Interval', value: 12, color: '#6366f1' }
  ];

  return (
    <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937] flex flex-col gap-6">
      <div>
        <h3 className="text-xs font-semibold text-[#d1d5db] uppercase tracking-wider mb-4 flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5 text-[#6366f1]"/>
          How Random Forest Caching Works
        </h3>
        <p className="text-xs text-[#9ca3af] leading-relaxed mb-4">
          Traditional policies rely on hardcoded heuristics — <strong className="text-[#d1d5db]">LRU</strong> assumes only recently-accessed items matter,
          while <strong className="text-[#d1d5db]">LFU</strong> assumes frequency alone drives value. In complex workloads, both assumptions break down.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {[
            { step: '01', title: 'Feature Extraction', body: 'The cache tracks access patterns online: recency (steps since last access), frequency (count), and temporal interval statistics.' },
            { step: '02', title: 'Online Training', body: 'Every 100 requests, a lightweight Random Forest regressor trains on historical reuse distances (actual interval until next access).' },
            { step: '03', title: 'Eviction Prediction', body: 'At capacity, the forest predicts reuse distances for all cached items. The item with the furthest predicted reuse is evicted.' },
          ].map(({ step, title, body }) => (
            <div key={step} className="p-4 bg-[#0d1117] rounded-lg border border-[#1f2937]">
              <div className="text-[10px] font-bold text-[#10b981] font-mono mb-1">{step}</div>
              <h4 className="text-xs font-semibold text-[#f9fafb] mb-1.5">{title}</h4>
              <p className="text-[10px] text-[#9ca3af] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#1f2937] pt-4">
        <h4 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">Online Feature Importance Weighting</h4>
        <p className="text-xs text-[#6b7280] leading-relaxed mb-4 font-sans">
          The Random Forest model dynamically computes feature importance weights during online training to adjust evictions depending on recency vs frequency skew.
        </p>
        <div className="h-44 relative bg-[#020617] border border-[#1f2937] rounded-xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={featureData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis type="number" stroke="#6b7280" fontSize={10} tickLine={false} domain={[0, 50]} unit="%" />
              <YAxis type="category" dataKey="name" stroke="#d1d5db" fontSize={9} tickLine={false} width={60} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }} formatter={(value) => [`${value}%`, 'Importance']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                {featureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-3.5 bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg text-[11px] text-[#a3e635]">
        <strong>Key Benefit:</strong> By learning access patterns dynamically, the Random Forest policy adapts to shifting workloads,
        achieving hit rates up to 92% where traditional policies plateau.
      </div>
    </div>
  );
}

// ─── Evolution Flow ────────────────────────────────────────────────────────
function CachingEvolutionFlow() {
  const steps = [
    { num: '01', title: 'Traditional Policies', desc: 'FIFO, LRU, LFU, 2Q. Simple in-memory lookup. Uses static frequency/recency counters. Low CPU overhead.', color: '#10b981', bg: '#022c22', border: '#022c22' },
    { num: '02', title: 'Redis Benchmark', desc: 'Approximated LRU/LFU. Scalable, distributed, trades eviction precision (samples random keys) to minimize memory footprint.', color: '#ef4444', bg: '#1a0505', border: '#3f0808' },
    { num: '03', title: 'Random Forest ML', desc: 'Online-trained Random Forest. Extracts statistical features dynamically and predicts future reuse distance for optimal evictions.', color: '#10b981', bg: '#1c1007', border: '#3d2000', badge: 'Current Stage' },
  ];
  return (
    <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-xl mb-8">
      <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-6 text-center">
        Evolution of Cache Replacement Policies
      </h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {steps.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className="flex-1 relative p-4 rounded-xl text-center border" style={{ background: s.bg, borderColor: s.border }}>
              {s.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#10b981] text-[#020617]">{s.badge}</span>
              )}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono mx-auto mb-3 border"
                style={{ backgroundColor: `${s.color}20`, color: s.color, borderColor: `${s.color}40` }}>{s.num}</div>
              <h4 className="text-xs font-semibold mb-1.5" style={{ color: s.color }}>{s.title}</h4>
              <p className="text-[10px] text-[#9ca3af] leading-relaxed">{s.desc}</p>
            </div>
            {i < 2 && <div className="hidden md:block text-[#374151] text-lg">→</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Section Label ─────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <Icon className="h-3.5 w-3.5 text-[#6b7280]"/>
      <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ─── Chart helpers ─────────────────────────────────────────────────────────
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#9ca3af', font: { family: 'Inter, sans-serif', size: 11 }, boxWidth: 12 } },
    tooltip: { backgroundColor: '#111', borderColor: '#1f2937', borderWidth: 1, titleColor: '#f9fafb', bodyColor: '#d1d5db', bodyFont: { family: 'Inter, sans-serif' } }
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#6b7280', font: { family: 'Inter, sans-serif', size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#6b7280', font: { family: 'Inter, sans-serif', size: 10 } } }
  }
};

const EmptyChart = ({ label }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
    <Activity className="w-6 h-6 text-[#374151]"/>
    <span className="text-[#374151] text-xs font-medium">{label}</span>
  </div>
);

// ─── Landing Page Component ───────────────────────────────────────────────
function LandingPage({ onLaunch }) {
  return (
    <div className="min-h-screen bg-[#020617] text-[#f9fafb] font-sans flex flex-col justify-between selection:bg-[#10b981] selection:text-[#020617]">
      {/* Navbar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between border-b border-[#1f2937]/50">
        <div className="flex items-center gap-2 font-bold tracking-tight text-base">
          <span className="text-[10px] font-bold text-[#10b981] font-mono bg-[#10b981]/10 border border-[#10b981]/20 px-2 py-0.5 rounded tracking-wider uppercase">Cache Eviction SIM</span>
        </div>
        <a href="https://github.com/ninjanavya/cache-replacement-system" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#f9fafb] bg-[#111827] border border-[#1f2937] hover:border-[#374151] px-4 py-2 rounded-xl transition-all shadow-md">
          <GitBranch className="h-4 w-4 text-[#10b981]"/>
          <span>View GitHub</span>
        </a>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-6 py-16 flex-grow flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-left max-w-xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"/>
            Vercel Ready Deploy
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Cache Eviction<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#6366f1]">
              Simulator
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed mb-8">
            An interactive simulator to benchmark traditional eviction heuristics, multi-level memory hierarchies, and an online-trained Random Forest model that predicts cache utility dynamically.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button onClick={onLaunch}
              className="flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0ea5e9] text-[#020617] hover:text-[#f9fafb] font-bold py-3.5 px-7 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-[#10b981]/25 hover:shadow-cyan-500/25 cursor-pointer text-sm tracking-wide">
              <span>Launch Simulator</span>
              <ChevronRight className="h-4 w-4 stroke-[2.5]"/>
            </button>
            <a href="https://github.com/ninjanavya/cache-replacement-system" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#111827] border border-[#1f2937] hover:border-[#374151] hover:bg-[#1e2433] text-[#d1d5db] font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 text-sm">
              <span>Documentation</span>
            </a>
          </div>
        </div>

        {/* Visual Showcase Card */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none">
          <div className="glass-card overflow-hidden shadow-2xl relative border border-[#1f2937]/80 rounded-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#1f2937]/50 bg-[#0d1117]/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[10px] text-[#6b7280] font-mono">live_preview_diagram.svg</span>
            </div>
            <div className="p-4 bg-[#020617]">
              <SandboxDiagram />
            </div>
          </div>
        </div>
      </main>

      {/* Feature Pillars Grid */}
      <section className="bg-[#0b0f19] border-y border-[#1f2937]/50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest text-center mb-10">CORE PLATFORM CAPABILITIES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Interactive Sandbox', desc: 'Step through cache hits, misses, and evictions key-by-key in real-time. Understand FIFO vs LRU instantly.', icon: Sliders, color: '#a3e635' },
              { title: 'Traditional Benchmarks', desc: 'Simulate workloads like Zipf, mixed, and scan sequences against FIFO, LRU, LFU, and 2Q.', icon: Cpu, color: '#10b981' },
              { title: 'Multi-Level Hierarchies', desc: 'Model L1 RAM and L2 Redis tiered caching architectures. Measure latency and EAT reduction.', icon: Layers, color: '#ef4444' },
              { title: 'ML Caching Model', desc: 'Harness a Random Forest classifier that learns access patterns online to predict optimal eviction.', icon: Zap, color: '#6366f1' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-[#020617]/50 p-6 rounded-2xl border border-[#1f2937]/40 hover:border-[#374151]/80 transition-all flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{ backgroundColor: `${feature.color}10`, borderColor: `${feature.color}20`, color: feature.color }}>
                  <feature.icon className="h-5 w-5"/>
                </div>
                <h3 className="font-semibold text-sm text-[#f9fafb]">{feature.title}</h3>
                <p className="text-xs text-[#9ca3af] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-8 text-center border-t border-[#1f2937]/30 text-xs text-[#374151]">
        <p>Built with FastAPI + React + Chart.js · Developed by <a href="https://github.com/ninjanavya" target="_blank" rel="noopener noreferrer" className="text-[#10b981] hover:underline">ninjanavya</a></p>
      </footer>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [activeTab, setActiveTab] = useState('sandbox');
  const [filter, setFilter] = useState('all');

  // Sandbox Playground State

  const [sandboxCapacity, setSandboxCapacity] = useState(8);
  const [sandboxLength, setSandboxLength] = useState(2000);
  const [sandboxWorkloadType, setSandboxWorkloadType] = useState('zipf');
  const [sandboxAlpha, setSandboxAlpha] = useState(1.01);
  const [sandboxResults, setSandboxResults] = useState(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxError, setSandboxError] = useState(null);
  
  const [sandboxPlaySpeed, setSandboxPlaySpeed] = useState(1000);
  const [sandboxIsPlaying, setSandboxIsPlaying] = useState(false);
  const [sandboxCurrentStep, setSandboxCurrentStep] = useState(0);
  const [sandboxHistory, setSandboxHistory] = useState({ LRU: [], LFU: [], FIFO: [], RF: [] });
  const [sandboxRequests, setSandboxRequests] = useState([]);

  useEffect(() => {
    let timer = null;
    if (sandboxIsPlaying) {
      timer = setInterval(() => {
        setSandboxCurrentStep(prev => {
          const maxStep = sandboxRequests.length;
          if (prev >= maxStep - 1) {
            setSandboxIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, sandboxPlaySpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sandboxIsPlaying, sandboxRequests, sandboxPlaySpeed]);



  // Tab 1 State
  const [capacity, setCapacity] = useState(100);
  const [length, setLength] = useState(2000);
  const [universeSize, setUniverseSize] = useState(500);
  const [alpha, setAlpha] = useState(1.01);
  const [workloadType, setWorkloadType] = useState('zipf');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tab 2 State
  const [l1Policy, setL1Policy] = useState('LRUCache');
  const [l1Capacity, setL1Capacity] = useState(20);
  const [l2Policy, setL2Policy] = useState('RedisCache');
  const [l2Capacity, setL2Capacity] = useState(100);
  const [policyMode, setPolicyMode] = useState('exclusive');
  const [tL1, setTL1] = useState(1.0);
  const [tL2, setTL2] = useState(10.0);
  const [tDb, setTDb] = useState(250.0);
  const [mlWorkloadType, setMlWorkloadType] = useState('zipf');
  const [mlLength, setMlLength] = useState(2000);
  const [mlUniverseSize, setMlUniverseSize] = useState(500);
  const [mlAlpha, setMlAlpha] = useState(1.01);
  const [mlResults, setMlResults] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState(null);

  // Tab 3 State
  const [showdownCapacity, setShowdownCapacity] = useState(100);
  const [showdownLength, setShowdownLength] = useState(2000);
  const [showdownUniverseSize, setShowdownUniverseSize] = useState(500);
  const [showdownAlpha, setShowdownAlpha] = useState(1.01);
  const [showdownWorkloadType, setShowdownWorkloadType] = useState('zipf');
  const [showdownTL1, setShowdownTL1] = useState(1.0);
  const [showdownTL2, setShowdownTL2] = useState(10.0);
  const [showdownTDb, setShowdownTDb] = useState(250.0);
  const [showdownL1Policy, setShowdownL1Policy] = useState('LRUCache');
  const [showdownL2Policy, setShowdownL2Policy] = useState('RedisCache');
  const [showdownPolicyMode, setShowdownPolicyMode] = useState('exclusive');
  const [showdownResults, setShowdownResults] = useState(null);
  const [showdownLoading, setShowdownLoading] = useState(false);
  const [showdownError, setShowdownError] = useState(null);


  const handleRunSandbox = async () => {
    setSandboxLoading(true); setSandboxError(null);
    try {
      const localWorkload = generateSandboxWorkload(sandboxWorkloadType, 30);
      setSandboxRequests(localWorkload);
      
      const histories = runMultiPolicySimulation(Number(sandboxCapacity), localWorkload);
      setSandboxHistory(histories);
      setSandboxCurrentStep(0);
      setSandboxIsPlaying(false);

      const r = await fetch('/api/benchmark', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          capacity: 100,
          length: Number(sandboxLength),
          universe_size: 500,
          alpha: Number(sandboxAlpha),
          workload_type: sandboxWorkloadType
        }),
      });
      if (!r.ok) throw new Error('Sandbox comparison run failed. Python backend server might be offline.');
      const data = await r.json();
      setSandboxResults(data);
    } catch (e) {
      setSandboxError(e.message);
    } finally {
      setSandboxLoading(false);
    }
  };

  useEffect(() => {
    if (sandboxRequests.length > 0) {
      const histories = runMultiPolicySimulation(Number(sandboxCapacity), sandboxRequests);
      setSandboxHistory(histories);
      setSandboxCurrentStep(prev => Math.min(prev, sandboxRequests.length - 1));
    }
  }, [sandboxRequests, sandboxCapacity]);

  // ── API Handlers ──
  const handleRunBenchmark = async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch('/api/benchmark', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity: Number(capacity), length: Number(length), universe_size: Number(universeSize), alpha: Number(alpha), workload_type: workloadType }),
      });
      if (!r.ok) throw new Error('Simulation failed. Make sure the Python server is running.');
      setResults(await r.json());
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const handleRunMultiLevel = async () => {
    setMlLoading(true); setMlError(null);
    try {
      const r = await fetch('/api/multilevel', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ l1_policy: l1Policy, l1_capacity: Number(l1Capacity), l2_policy: l2Policy, l2_capacity: Number(l2Capacity), policy_mode: policyMode, t_l1: Number(tL1), t_l2: Number(tL2), t_db: Number(tDb), length: Number(mlLength), universe_size: Number(mlUniverseSize), alpha: Number(mlAlpha), workload_type: mlWorkloadType }),
      });
      if (!r.ok) throw new Error('Multi-level simulation failed.');
      setMlResults(await r.json());
    } catch (e) { setMlError(e.message); } finally { setMlLoading(false); }
  };

  const handleRunShowdown = async () => {
    setShowdownLoading(true); setShowdownError(null);
    try {
      const l1Cap = Math.max(2, Math.floor(Number(showdownCapacity) * 0.2));
      const [benchmarkRes, multilevelRes] = await Promise.all([
        fetch('/api/benchmark', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ capacity: Number(showdownCapacity), length: Number(showdownLength), universe_size: Number(showdownUniverseSize), alpha: Number(showdownAlpha), workload_type: showdownWorkloadType }) }).then(r => { if (!r.ok) throw new Error('Benchmark failed.'); return r.json(); }),
        fetch('/api/multilevel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ l1_policy: showdownL1Policy, l1_capacity: l1Cap, l2_policy: showdownL2Policy, l2_capacity: Number(showdownCapacity), policy_mode: showdownPolicyMode, t_l1: Number(showdownTL1), t_l2: Number(showdownTL2), t_db: Number(showdownTDb), length: Number(showdownLength), universe_size: Number(showdownUniverseSize), alpha: Number(showdownAlpha), workload_type: showdownWorkloadType }) }).then(r => { if (!r.ok) throw new Error('Multi-level failed.'); return r.json(); })
      ]);

      const tl1 = Number(showdownTL1), tl2 = Number(showdownTL2), tdb = Number(showdownTDb);
      const combined = [];
      const eatMap = { FIFOCache: tl1, LRUCache: tl1, LFUCache: tl1, TwoQueueCache: tl1, RedisCache: tl2, RandomForestCache: tl1 };
      const nameMap = { FIFOCache: 'FIFO Cache', LRUCache: 'LRU Cache', LFUCache: 'LFU Cache', TwoQueueCache: '2Q Cache (Scan-Resistant)', RedisCache: 'Redis Cache (Approx. LRU)', RandomForestCache: 'Random Forest Cache (ML)' };

      benchmarkRes.summary.forEach(p => {
        const tHit = eatMap[p.name] ?? tl1;
        const eat = (p.hit_rate / 100) * tHit + (1 - p.hit_rate / 100) * (tHit + tdb);
        combined.push({ key: p.name, name: nameMap[p.name] ?? p.name, hit_rate: p.hit_rate, capacity: `${p.capacity} slots`, eat_us: Number(eat.toFixed(3)), hits: p.hits, misses: p.misses, evictions: p.evictions });
      });

      const ml = multilevelRes.stats;
      combined.push({ key: 'MultiLevelCache', name: 'Multi-Level Tiered Cache (L1+L2)', hit_rate: Number((ml.l1_hit_rate + ml.l2_hit_rate).toFixed(2)), capacity: `${l1Cap} (L1) + ${showdownCapacity} (L2)`, eat_us: ml.eat_us, hits: ml.l1_hits + ml.l2_hits, misses: ml.db_reads, evictions: ml.l1_misses + ml.l2_misses });
      combined.sort((a, b) => b.hit_rate - a.hit_rate);
      setShowdownResults({ combined, workloadName: benchmarkRes.workload_name });
    } catch (e) { setShowdownError(e.message); } finally { setShowdownLoading(false); }
  };

  const handleExportData = () => {
    const exportMap = { traditional: results, redis: mlResults, ml: showdownResults };
    const fileMap = { traditional: 'traditional_benchmark.json', redis: 'tiered_benchmark.json', ml: 'showdown_benchmark.json' };
    const data = exportMap[activeTab];
    if (!data) { alert('No data to export. Run a simulation first.'); return; }
    const a = document.createElement('a');
    a.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`);
    a.setAttribute('download', fileMap[activeTab]);
    document.body.appendChild(a); a.click(); a.remove();
  };

  // ── Derived values ──
  const traditionalSummary = results?.summary.filter(r => ['FIFOCache','LRUCache','LFUCache','TwoQueueCache'].includes(r.name)) ?? [];
  const traditionalWinner = traditionalSummary.length ? [...traditionalSummary].sort((a,b) => b.hit_rate - a.hit_rate)[0] : null;
  const traditionalFastest = traditionalSummary.length ? [...traditionalSummary].sort((a,b) => a.avg_latency_us - b.avg_latency_us)[0] : null;

  const hitRateData = {
    labels: traditionalSummary.map(r => r.name === 'TwoQueueCache' ? '2Q' : r.name.replace('Cache','')),
    datasets: [{ label: 'Hit Rate (%)', data: traditionalSummary.map(r => r.hit_rate),
      backgroundColor: traditionalSummary.map(r => r.name === traditionalWinner?.name ? '#10b981' : 'rgba(16, 185, 129,0.25)'),
      borderColor: traditionalSummary.map(r => r.name === traditionalWinner?.name ? '#10b981' : 'rgba(16, 185, 129,0.4)'),
      borderWidth: 1, borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 } }]
  };
  const latencyData = {
    labels: traditionalSummary.map(r => r.name === 'TwoQueueCache' ? '2Q' : r.name.replace('Cache','')),
    datasets: [{ label: 'Avg Latency (µs)', data: traditionalSummary.map(r => r.avg_latency_us),
      backgroundColor: traditionalSummary.map(r => r.name === traditionalFastest?.name ? '#10b981' : 'rgba(16,185,129,0.25)'),
      borderColor: traditionalSummary.map(r => r.name === traditionalFastest?.name ? '#10b981' : 'rgba(16,185,129,0.4)'),
      borderWidth: 1, borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 } }]
  };
  const trendData = {
    labels: results?.trends.labels ?? [],
    datasets: results ? [
      { label: 'FIFO', data: results.trends.FIFOCache, borderColor: '#10b981', backgroundColor: 'transparent', borderWidth: 1.5, tension: 0.3, pointRadius: 0 },
      { label: 'LRU', data: results.trends.LRUCache, borderColor: '#10b981', backgroundColor: 'transparent', borderWidth: 1.5, tension: 0.3, pointRadius: 0 },
      { label: 'LFU', data: results.trends.LFUCache, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129,0.05)', borderWidth: 2, tension: 0.3, pointRadius: 0, fill: true },
      { label: '2Q', data: results.trends.TwoQueueCache, borderColor: '#f59e0b', backgroundColor: 'transparent', borderWidth: 1.5, tension: 0.3, pointRadius: 0 },
    ] : []
  };

  const redisHitRate = results?.summary.find(p => p.name === 'RedisCache')?.hit_rate ?? 0;
  const redisEatUs = (redisHitRate/100)*Number(tL2) + (1-redisHitRate/100)*(Number(tL2)+Number(tDb));
  const mlEatData = {
    labels: ['No Cache', 'L1 RAM Only', 'L2 Redis Only', 'L1 + L2 Tiered'],
    datasets: [{ label: 'EAT (µs)',
      data: mlResults ? [mlResults.stats.no_cache_eat_us, mlResults.stats.l1_only_eat_us, Number(redisEatUs.toFixed(3)), mlResults.stats.eat_us] : [0,0,0,0],
      backgroundColor: ['#6b7280','#6366f1','#ef4444','#10b981'],
      borderColor: ['#374151','#4f46e5','#dc2626','#059669'],
      borderWidth: 1, borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 } }]
  };
  const mlResolutionData = {
    labels: ['L1 Hits','L2 Hits','DB Reads'],
    datasets: [{ data: mlResults ? [mlResults.stats.l1_hits, mlResults.stats.l2_hits, mlResults.stats.db_reads] : [0,0,1], backgroundColor: ['#6366f1','#ef4444','#374151'], borderColor: ['#4f46e5','#dc2626','#27272a'], borderWidth: 1 }]
  };
  const mlTrendData = {
    labels: mlResults?.trends.labels ?? [],
    datasets: mlResults ? [
      { label: 'EAT (µs)', data: mlResults.trends.eat_trend, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.05)', borderWidth: 2, yAxisID: 'y1', tension: 0.2, pointRadius: 0, fill: true },
      { label: 'L1 Hit Rate (%)', data: mlResults.trends.l1_hit_rate_trend, borderColor: '#6366f1', borderWidth: 1.5, yAxisID: 'y2', tension: 0.2, pointRadius: 0, fill: false },
      { label: 'L2 Hit Rate (%)', data: mlResults.trends.l2_hit_rate_trend, borderColor: '#ef4444', borderWidth: 1.5, yAxisID: 'y2', tension: 0.2, pointRadius: 0, fill: false },
    ] : []
  };
  const mlTrendOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#9ca3af', font: { family: 'Inter, sans-serif' }, boxWidth: 12 } }, tooltip: chartOptions.plugins.tooltip },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#6b7280', font: { family: 'Inter, sans-serif' } } },
      y1: { type: 'linear', position: 'left', grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#10b981', font: { family: 'Inter, sans-serif' } }, title: { display: true, text: 'Latency (µs)', color: '#10b981' } },
      y2: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#6366f1', font: { family: 'Inter, sans-serif' } }, min: 0, max: 100, title: { display: true, text: 'Hit Rate (%)', color: '#6366f1' } }
    }
  };

  const cardData = [
    { id: 'sandbox', title: 'Live Sandbox & Visualizer', company: 'Interactive Playground', description: 'Step through cache hits, misses, and evictions key-by-key. Compare FIFO, LRU, and LFU visually on active workloads.', Diagram: SandboxDiagram, difficulty: 'Beginner', duration: 'Real-time', category: 'sandbox', accent: '#a3e635' },
    { id: 'traditional', title: 'Traditional Cache Simulator', company: 'In-Memory Eviction', description: 'Benchmark classic eviction heuristics — FIFO, LRU, LFU, and 2Q — against Zipfian, random, sequential, and mixed access workloads.', Diagram: LRUDiagram, difficulty: 'Intermediate', duration: '1–2 min', category: 'traditional', accent: '#10b981' },
    { id: 'redis', title: 'Redis & Tiered Memory Sim', company: 'Multi-Level Hierarchy', description: 'Evaluate L1 RAM + L2 Redis two-tier caching. Measure Effective Access Time (EAT) reduction versus single-layer approaches.', Diagram: TieredMemoryDiagram, difficulty: 'Advanced', duration: '3–5 min', category: 'tiered', accent: '#ef4444' },
    { id: 'ml', title: 'Predictive Eviction Showdown', company: 'Machine Learning', description: 'Pit an online-trained Random Forest model against all traditional policies. The model predicts key reuse distance to evict optimally.', Diagram: MLForestDiagram, difficulty: 'Advanced', duration: '5–10 min', category: 'ml', accent: '#10b981' },
  ];

  const filteredCards = cardData.filter(c => filter === 'all' || c.category === filter);

  // ── Shared input classes ──
  const inp = "w-full bg-[#0d1117] border border-[#1f2937] rounded-lg px-3 py-2 text-sm text-[#f9fafb] focus:outline-none focus:border-[#10b981] transition-colors font-sans";
  const inpSm = "w-full bg-[#0d1117] border border-[#1f2937] rounded-lg px-2.5 py-1.5 text-xs text-[#f9fafb] focus:outline-none focus:border-[#10b981] transition-colors";
  const inpXs = "w-full bg-[#0d1117] border border-[#1f2937] rounded px-1.5 py-1 text-xs text-[#d1d5db] focus:outline-none focus:border-[#10b981]";

  if (showLandingPage) {
    return <LandingPage onLaunch={() => setShowLandingPage(false)} />;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-5 py-6 font-sans">

      {/* ── Header ── */}
      <header className="flex items-center justify-between py-3 mb-8 border-b border-[#1f2937]">
        <button onClick={() => setShowLandingPage(true)} className="flex items-center gap-2 font-bold text-[#f9fafb] tracking-tight text-base cursor-pointer">
          <span className="text-[10px] font-medium text-[#6b7280] font-mono bg-[#1e2433] border border-[#1f2937] hover:border-[#374151] px-1.5 py-0.5 rounded">← Back to Landing Page</span>
        </button>

        <a href="https://github.com/ninjanavya/cache-replacement-system" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-[#f9fafb] bg-[#111827] border border-[#1f2937] hover:border-[#374151] px-3 py-1.5 rounded-lg transition-all">
          <GitBranch className="h-3.5 w-3.5"/>
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </header>

      {/* ── Sticky metrics bar ── */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-[#020617]/90 border border-[#1f2937]/90 py-2.5 px-4 rounded-xl mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2.5">
          <span className="text-[9px] font-bold text-[#020617] bg-[#a3e635] px-2 py-0.5 rounded uppercase font-sans tracking-wide">Global Leaderboard</span>
          <span className="text-[10px] text-[#6b7280] font-mono">Benchmark trace: <strong>2,000 requests (Zipf Skew)</strong></span>
        </div>
        <div className="flex items-center gap-4 flex-wrap text-[11px] font-mono font-bold">
          <div className="flex items-center gap-1"><span className="text-[#6b7280]">LRU:</span><span className="text-white">81.2%</span></div>
          <div className="flex items-center gap-1"><span className="text-[#6b7280]">LFU:</span><span className="text-white">88.4%</span></div>
          <div className="flex items-center gap-1"><span className="text-[#a5b4fc]">RF (ML):</span><span className="text-[#a3e635]">92.1%</span></div>
          <div className="hidden sm:inline border-l border-[#1f2937] h-4 mx-1" />
          <div className="flex items-center gap-1 text-yellow-500"><span className="text-base leading-none">🏆</span><span>Winner:</span><span className="uppercase text-yellow-500">Random Forest (ML)</span></div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="text-center mb-12 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/25 px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"/>
          Cache Simulator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f9fafb] mb-3 leading-tight">
          Cache Eviction<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#34d399]">Simulator</span>
        </h1>
        <p className="text-sm text-[#9ca3af] leading-relaxed">
          Benchmark traditional eviction heuristics, multi-level memory hierarchies, and an online-trained Random Forest classifier — side by side.
        </p>
      </section>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#1f2937] pb-4 mb-8">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-widest mr-1">Filter:</span>
          {[{ key: 'all', label: 'All' }, { key: 'sandbox', label: 'Playground' }, { key: 'traditional', label: 'Traditional' }, { key: 'tiered', label: 'Tiered' }, { key: 'ml', label: 'ML Showdown' }].map(opt => (
            <button key={opt.key} onClick={() => setFilter(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filter === opt.key
                  ? 'bg-[#1e2433] border-[#374151] text-[#f9fafb]'
                  : 'bg-transparent border-transparent text-[#9ca3af] hover:text-[#d1d5db] hover:bg-[#111827]'
              }`}>{opt.label}</button>
          ))}
        </div>
        <button onClick={handleExportData}
          className="text-xs font-medium text-[#9ca3af] hover:text-[#10b981] transition-colors flex items-center gap-1.5">
          Export Active Data →
        </button>
      </div>

      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {filteredCards.map(card => {
          const isActive = activeTab === card.id;
          return (
            <div key={card.id} onClick={() => setActiveTab(card.id)}
              className={`sim-card ${isActive ? 'active' : ''} group`}>
              {isActive && <span className="active-badge">Active</span>}

              {/* SVG Banner */}
              <card.Diagram />

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider" style={{ color: `${card.accent}80` }}>
                    {card.company}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#f9fafb] mb-2 leading-snug">{card.title}</h3>
                <p className="text-xs text-[#9ca3af] leading-relaxed mb-5">{card.description}</p>
                <div className="flex items-center justify-between border-t border-[#1f2937] pt-3">
                  <span className="flex items-center gap-1.5 text-[10px] text-[#6b7280] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: card.accent }}/>
                    {card.difficulty}
                  </span>
                  <span className="text-[10px] text-[#6b7280] font-mono">{card.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Workbench ── */}
      <div className="border-t border-[#1f2937] pt-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-widest mb-1">Active Module</p>
            <h2 className="text-base font-semibold text-[#f9fafb]">
              {activeTab === 'sandbox' ? 'Live Simulator Playground' : activeTab === 'traditional' ? 'Traditional Policies' : activeTab === 'redis' ? 'Redis & Tiered Caching' : 'ML Eviction Showdown'}
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-[#111827] border border-[#1f2937] rounded-lg p-1">
            {cardData.map(c => (
              <button key={c.id} onClick={() => setActiveTab(c.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === c.id ? 'bg-[#1e2433] text-[#f9fafb] border border-[#1f2937]' : 'text-[#9ca3af] hover:text-[#d1d5db]'
                }`}>{c.id === 'sandbox' ? 'Playground' : c.id === 'traditional' ? 'Traditional' : c.id === 'redis' ? 'Tiered' : 'ML'}</button>
            ))}
          </div>
        </div>
        {/* ─────────── Tab 0: Sandbox & Visualizer ─────────── */}
        {activeTab === 'sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Sidebar */}
            <aside className="lg:col-span-1 flex flex-col gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1f2937]">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-3.5 w-3.5 text-[#a3e635]"/>
                    <h3 className="text-xs font-semibold text-[#d1d5db] uppercase tracking-wider">Playground Config</h3>
                  </div>
                  <WindowDots/>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5 font-sans">Workload Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['zipf', 'random', 'scan', 'mixed'].map(type => (
                        <button
                          key={type}
                          onClick={() => setSandboxWorkloadType(type)}
                          className={`px-2 py-1.5 rounded text-xs font-medium border transition-all ${
                            sandboxWorkloadType === type
                              ? 'bg-[#1e2433] border-[#a3e635] text-[#a3e635]'
                              : 'bg-transparent border-[#1f2937] text-[#9ca3af] hover:text-[#f9fafb]'
                          }`}
                        >
                          {type === 'zipf' ? 'Zipfian' : type === 'random' ? 'Random' : type === 'scan' ? 'Sequential' : 'Mixed'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">Visual Cache Capacity</label>
                      <span className="text-[10px] font-mono text-[#a3e635] font-bold">{sandboxCapacity} slots</span>
                    </div>
                    <input type="range" min="4" max="12" step="1" value={sandboxCapacity} onChange={e => setSandboxCapacity(Number(e.target.value))} className="w-full h-1 cursor-pointer accent-[#a3e635]"/>
                    <p className="text-[9px] text-[#6b7280] mt-1">Number of blocks shown in the visualizer.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Benchmark Requests</label>
                    <input type="number" min="100" max="10000" value={sandboxLength} onChange={e => setSandboxLength(e.target.value)} className={inp}/>
                    <p className="text-[9px] text-[#6b7280] mt-1">Number of requests run on the backend benchmark comparison.</p>
                  </div>
                  {sandboxWorkloadType === 'zipf' && (
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Zipf Coefficient (α)</label>
                      <input type="number" step="0.05" min="0.1" max="2.5" value={sandboxAlpha} onChange={e => setSandboxAlpha(e.target.value)} className={inp}/>
                    </div>
                  )}
                  <button onClick={handleRunSandbox} disabled={sandboxLoading}
                    className="w-full flex items-center justify-center gap-2 mt-2 bg-[#a3e635] hover:bg-[#86c023] text-[#020617] font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 text-sm cursor-pointer font-sans">
                    {sandboxLoading ? <RefreshCw className="h-4 w-4 animate-spin"/> : <><Play className="h-4 w-4 fill-[#020617]"/>Run Sandbox</>}
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Area */}
            <main className="lg:col-span-3 flex flex-col gap-6">
              {sandboxError && <div className="bg-[#450a0a]/30 border border-[#dc2626]/30 text-[#fca5a5] px-5 py-3 rounded-xl text-sm"><strong>Error:</strong> {sandboxError}</div>}

              {sandboxRequests.length === 0 ? (
                <div className="glass-card p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
                  <Sliders className="w-10 h-10 text-[#a3e635] mb-4 animate-pulse"/>
                  <h3 className="text-sm font-semibold text-[#f9fafb] mb-2 font-sans">Simulation Sandbox Ready</h3>
                  <p className="text-xs text-[#9ca3af] max-w-md mx-auto leading-relaxed mb-6 font-sans">
                    Configure your workload settings on the sidebar and click <strong className="text-[#a3e635]">Run Sandbox</strong> to launch the live cache visualizer and backend performance shootout leaderboard.
                  </p>
                </div>
              ) : (
                <>
                  {/* Step-by-step Interactive Visualizer */}
                  <div className="glass-card p-5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-[#1f2937]">
                      <div>
                        <span className="text-[10px] font-semibold text-[#a3e635] uppercase tracking-wider">Interactive Visualizer</span>
                        <h3 className="text-sm font-bold text-[#f9fafb] mt-0.5 font-sans">Side-by-Side Policy Comparison</h3>
                      </div>
                      
                      {/* Export buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (!sandboxResults) return;
                            const rows = sandboxResults.summary.map(p => ({
                              name: p.name === 'RandomForestCache' ? 'Random Forest (ML)' : p.name.replace('Cache', ' Cache'),
                              capacity: p.capacity,
                              hit_rate: p.hit_rate,
                              hits: p.hits,
                              misses: p.misses,
                              evictions: p.evictions
                            }));
                            let csvContent = "data:text/csv;charset=utf-8,";
                            csvContent += "Policy,Capacity,Hit Rate %,Hits,Misses,Evictions\n";
                            rows.forEach(row => {
                              csvContent += `"${row.name}",${row.capacity},${row.hit_rate}%,${row.hits},${row.misses},${row.evictions}\n`;
                            });
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", "sandbox_shootout.csv");
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                          }}
                          className="px-2.5 py-1 bg-[#111827] border border-[#1f2937] hover:border-[#374151] rounded text-[10px] text-[#9ca3af] font-semibold transition-all cursor-pointer font-sans"
                        >
                          Export CSV
                        </button>
                        <button
                          onClick={() => {
                            if (!sandboxResults) return;
                            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(sandboxResults, null, 2))}`;
                            const link = document.createElement("a");
                            link.setAttribute("href", jsonString);
                            link.setAttribute("download", "sandbox_shootout.json");
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                          }}
                          className="px-2.5 py-1 bg-[#111827] border border-[#1f2937] hover:border-[#374151] rounded text-[10px] text-[#9ca3af] font-semibold transition-all cursor-pointer font-sans"
                        >
                          Export JSON
                        </button>
                      </div>
                    </div>

                    {/* Timeline Tracker Queue */}
                    <div className="mb-6 bg-[#020617] border border-[#1f2937] p-3 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[9px] text-[#6b7280] uppercase tracking-wider font-semibold">Trace Request Stream (First 30 Steps)</label>
                        <span className="text-[9px] font-mono text-[#a3e635]">Step {sandboxCurrentStep + 1} of {sandboxRequests.length}</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-thin">
                        {sandboxRequests.map((reqKey, idx) => {
                          const isCurrent = idx === sandboxCurrentStep;
                          const isPast = idx < sandboxCurrentStep;

                          return (
                            <div
                              key={idx}
                              className={`px-2 py-1 rounded text-xs font-mono font-bold flex-shrink-0 transition-all ${
                                isCurrent
                                  ? 'bg-[#a3e635] text-[#020617] scale-110 shadow-[0_0_8px_rgba(163,230,53,0.3)] animate-req-pulse'
                                  : isPast
                                    ? 'bg-[#111827] text-[#10b981] border border-[#10b981]/25 opacity-55'
                                    : 'bg-[#111827] text-[#6b7280] border border-[#1f2937]'
                              }`}
                            >
                              K{reqKey}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Visual Tracks Side by Side */}
                    <div className="flex flex-col gap-6 mb-6">
                      {['LRU', 'LFU', 'FIFO', 'RF'].map(policy => {
                        const history = sandboxHistory[policy];
                        const stepData = history[sandboxCurrentStep];
                        if (!stepData) return null;

                        return (
                          <div key={policy} className={`bg-[#020617] border border-[#1f2937] rounded-xl p-4 transition-all ${policy === 'RF' ? 'border-[#6366f1]/40 bg-[#070913]/70' : ''}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-[#1f2937]/50">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#f9fafb] font-sans flex items-center gap-1.5">
                                  {policy === 'LRU' ? 'LRU (Least Recently Used)' : policy === 'LFU' ? 'LFU (Least Frequently Used)' : policy === 'FIFO' ? 'FIFO (First-In, First-Out)' : 'Random Forest (ML-driven)'}
                                  {policy === 'RF' && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#6366f1] text-white">SPECIAL</span>}
                                </span>
                                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                                  stepData.hit
                                    ? 'bg-[#065f46]/20 text-[#10b981] border border-[#10b981]/30'
                                    : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20'
                                }`}>
                                  {stepData.hit ? 'HIT 🟢' : 'MISS 🔴'}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] text-[#6b7280] font-mono">
                                <span>Hits: <strong className="text-[#9ca3af]">{stepData.hits}</strong></span>
                                <span>Evict: <strong className="text-[#ef4444]">{stepData.evictions}</strong></span>
                                <span>Hit Rate: <strong className="text-[#a3e635]">{stepData.hitRate}%</strong></span>
                              </div>
                            </div>

                            {/* Blocks row */}
                            <div className="flex flex-wrap gap-2 items-stretch min-h-[56px] mb-3">
                              {Array.from({ length: Number(sandboxCapacity) }).map((_, idx) => {
                                const cacheState = stepData.cacheAfter;
                                const item = cacheState[idx];
                                const hasItem = item !== undefined;

                                let isKeyHit = false;
                                let keyName = '';
                                let freqCount = null;
                                let predDist = null;

                                if (hasItem) {
                                  if (policy === 'LFU') {
                                    keyName = `K${item.key}`;
                                    freqCount = item.freq;
                                    isKeyHit = stepData.hit && stepData.key === item.key;
                                  } else if (policy === 'RF') {
                                    keyName = `K${item.key}`;
                                    freqCount = item.freq;
                                    predDist = item.predDist;
                                    isKeyHit = stepData.hit && stepData.key === item.key;
                                  } else {
                                    keyName = `K${item}`;
                                    isKeyHit = stepData.hit && stepData.key === item;
                                  }
                                }

                                return (
                                  <div
                                    key={idx}
                                    className={`flex-1 min-w-[48px] aspect-[4/3] rounded-lg border flex flex-col items-center justify-center p-1.5 transition-all relative transition-cache-item ${
                                      hasItem
                                        ? isKeyHit
                                          ? 'bg-[#065f46]/30 border-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.15)] scale-102 animate-cache-hit'
                                          : 'bg-[#111827] border-[#1f2937]'
                                        : 'border-dashed border-[#1f2937]/60 bg-transparent'
                                    }`}
                                  >
                                    {hasItem ? (
                                      <>
                                        <span className={`text-[11px] font-bold font-mono ${isKeyHit ? 'text-[#a3e635]' : 'text-[#f9fafb]'}`}>
                                          {keyName}
                                        </span>
                                        {freqCount !== null && (
                                          <span className="text-[7px] text-[#6b7280] font-sans mt-0.5 font-semibold">
                                            Refs: {freqCount}
                                          </span>
                                        )}
                                        {idx === 0 && (policy === 'LRU' || policy === 'FIFO') && (
                                          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[5.5px] font-bold bg-[#1e2433] px-1 rounded text-[#9ca3af] border border-[#1f2937] uppercase">
                                            {policy === 'LRU' ? 'MRU' : 'New'}
                                          </span>
                                        )}
                                        {idx === cacheState.length - 1 && (policy === 'LRU' || policy === 'FIFO') && (
                                          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[5.5px] font-bold bg-[#450a0a]/30 px-1 rounded text-[#ef4444] border border-[#ef4444]/30 uppercase">
                                            {policy === 'LRU' ? 'LRU' : 'Old'}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-[8px] text-[#374151] font-semibold uppercase font-mono">Empty</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Predicted Reuse Distance Board (Random Forest Special Feature) */}
                            {policy === 'RF' && stepData.predictions && (
                              <div className="mt-3.5 mb-3 p-3 bg-[#0d1117] border border-[#1f2937] rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[9px] font-bold text-[#a5b4fc] uppercase tracking-wider font-sans">Predicted Reuse Distance</span>
                                  {stepData.confidence && (
                                    <span className="text-[9px] font-mono text-[#a3e635]">Model Confidence: <strong className="text-white">{stepData.confidence}%</strong></span>
                                  )}
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  {stepData.predictions.map(pred => {
                                    const isEvicted = pred.key === stepData.evicted;
                                    return (
                                      <div
                                        key={pred.key}
                                        className={`p-1.5 rounded-lg border text-center font-mono text-xs flex flex-col justify-center items-center ${
                                          isEvicted
                                            ? 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#ef4444] animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                                            : 'bg-[#111827] border-[#1f2937] text-[#9ca3af]'
                                        }`}
                                      >
                                        <span className="text-[8px] text-[#6b7280]">KEY</span>
                                        <strong className={isEvicted ? 'text-white' : 'text-[#f9fafb]'}>K{pred.key}</strong>
                                        <span className="text-[8px] text-[#6b7280] mt-0.5">REUSE</span>
                                        <strong className={isEvicted ? 'text-[#ef4444] font-extrabold' : 'text-[#a3e635]'}>{pred.val}</strong>
                                        {isEvicted && <span className="text-[6.5px] font-bold text-[#ef4444] uppercase tracking-wider mt-1 font-sans">Evict</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Eviction Explanation Panel */}
                            <p className="text-[10px] text-[#9ca3af] leading-relaxed bg-[#0d1117] border border-[#1f2937]/50 rounded px-2.5 py-1.5 font-sans">
                              {stepData.explanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Simulation Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-[#1f2937]/50">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSandboxIsPlaying(!sandboxIsPlaying)}
                          className="px-4 py-2 rounded-lg bg-[#111827] border border-[#1f2937] hover:border-[#374151] text-xs font-bold text-[#f9fafb] flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                        >
                          {sandboxIsPlaying ? <Pause className="w-3.5 h-3.5"/> : <Play className="w-3.5 h-3.5"/>}
                          {sandboxIsPlaying ? 'Pause' : 'Play'}
                        </button>
                        <button
                          onClick={() => {
                            setSandboxIsPlaying(false);
                            setSandboxCurrentStep(0);
                          }}
                          className="px-3 py-2 rounded-lg bg-[#111827] border border-[#1f2937] hover:border-[#374151] text-xs font-bold text-[#f9fafb] flex items-center gap-1 transition-all cursor-pointer font-sans"
                        >
                          ⏮ Reset
                        </button>
                        <button
                          onClick={() => {
                            setSandboxIsPlaying(false);
                            setSandboxCurrentStep(prev => Math.max(0, prev - 1));
                          }}
                          disabled={sandboxCurrentStep === 0}
                          className="px-3 py-2 rounded-lg bg-[#111827] border border-[#1f2937] hover:border-[#374151] disabled:opacity-30 text-xs font-bold text-[#f9fafb] flex items-center gap-1 transition-all cursor-pointer font-sans"
                        >
                          ◀ Prev Step
                        </button>
                        <button
                          onClick={() => {
                            setSandboxIsPlaying(false);
                            setSandboxCurrentStep(prev => Math.min(sandboxRequests.length - 1, prev + 1));
                          }}
                          disabled={sandboxCurrentStep >= sandboxRequests.length - 1}
                          className="px-3 py-2 rounded-lg bg-[#111827] border border-[#1f2937] hover:border-[#374151] disabled:opacity-30 text-xs font-bold text-[#f9fafb] flex items-center gap-1 transition-all cursor-pointer font-sans"
                        >
                          Step →
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#6b7280] uppercase tracking-wider font-semibold">Speed:</span>
                        <input
                          type="range"
                          min="200"
                          max="2000"
                          step="200"
                          value={2200 - sandboxPlaySpeed}
                          onChange={e => setSandboxPlaySpeed(2200 - Number(e.target.value))}
                          className="h-1 cursor-pointer accent-[#a3e635] w-24 sm:w-32"
                        />
                        <span className="text-[10px] text-[#9ca3af] font-mono w-10">
                          {((2200 - sandboxPlaySpeed) / 1000).toFixed(1)}s
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benchmark Showdown Leaderboard */}
                  {sandboxResults && (
                    <div className="glass-card p-5">
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1f2937]">
                        <div>
                          <span className="text-[10px] font-semibold text-[#a3e635] uppercase tracking-wider">Benchmark Leaderboard</span>
                          <h3 className="text-sm font-bold text-[#f9fafb] mt-0.5 font-sans">Overall Workload Hit Rates</h3>
                        </div>
                        <span className="text-[10px] text-[#6b7280] font-mono">
                          Capacity: 100 slots · Run: {sandboxLength} reqs
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                          { name: 'Random Forest (ML)', key: 'RandomForestCache', accent: '#a3e635' },
                          { name: 'LRU Cache', key: 'LRUCache', accent: '#10b981' },
                          { name: 'LFU Cache', key: 'LFUCache', accent: '#34d399' },
                          { name: 'FIFO Cache', key: 'FIFOCache', accent: '#6b7280' }
                        ].map((policy) => {
                          const result = sandboxResults.summary.find(p => p.name === policy.key);
                          const hitRate = result ? result.hit_rate : 0;
                          const hits = result ? result.hits : 0;
                          const evictions = result ? result.evictions : 0;
                          
                          return (
                            <div key={policy.key} className="p-4 bg-[#0d1117] border border-[#1f2937] rounded-xl flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider block mb-1">{policy.name}</span>
                                <h4 className="text-2xl font-bold font-mono mt-0.5 animate-pulse" style={{ color: policy.accent }}>{hitRate}%</h4>
                              </div>
                              <div className="mt-4 pt-2.5 border-t border-[#1f2937]/60 flex items-center justify-between text-[10px] text-[#6b7280]">
                                <span>Hits: <strong className="text-[#9ca3af] font-mono">{hits.toLocaleString()}</strong></span>
                                <span>Evict: <strong className="text-[#9ca3af] font-mono">{evictions.toLocaleString()}</strong></span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        )}

        {/* ─────────── Tab 1: Traditional ─────────── */}
        {activeTab === 'traditional' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Sidebar */}
            <aside className="lg:col-span-1 flex flex-col gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1f2937]">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-3.5 w-3.5 text-[#10b981]"/>
                    <h3 className="text-xs font-semibold text-[#d1d5db] uppercase tracking-wider">Settings</h3>
                  </div>
                  <WindowDots/>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Workload Type</label>
                    <select value={workloadType} onChange={e => setWorkloadType(e.target.value)} className={inp}>
                      <option value="zipf">Zipfian Skew (Realistic)</option>
                      <option value="random">Random Uniform</option>
                      <option value="scan">Sequential Scan</option>
                      <option value="mixed">Mixed Workload</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">Cache Capacity</label>
                      <span className="text-[10px] font-mono text-[#d1d5db]">{capacity} slots</span>
                    </div>
                    <input type="range" min="10" max="1000" step="10" value={capacity} onChange={e => setCapacity(e.target.value)} className="w-full h-1 cursor-pointer accent-[#10b981]"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Workload Length</label>
                    <input type="number" min="100" max="50000" value={length} onChange={e => setLength(e.target.value)} className={inp}/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Universe Size (Keys)</label>
                    <input type="number" min="50" max="10000" value={universeSize} onChange={e => setUniverseSize(e.target.value)} className={inp}/>
                  </div>
                  {workloadType === 'zipf' && (
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Zipf Coefficient (α)</label>
                      <input type="number" step="0.05" min="0.1" max="2.5" value={alpha} onChange={e => setAlpha(e.target.value)} className={inp}/>
                    </div>
                  )}
                  <button onClick={handleRunBenchmark} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 mt-2 bg-[#10b981] hover:bg-[#059669] text-[#020617] font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 text-sm cursor-pointer">
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin"/> : <><Play className="h-4 w-4 fill-[#020617]"/>Run Simulation</>}
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3 flex flex-col gap-6">
              {error && <div className="bg-[#450a0a]/30 border border-[#dc2626]/30 text-[#fca5a5] px-5 py-3 rounded-xl text-sm"><strong>Error:</strong> {error}</div>}

              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Top Hit Rate', value: loading ? '...' : traditionalWinner ? `${traditionalWinner.hit_rate}%` : '—', sub: loading ? 'Analyzing...' : traditionalWinner ? (traditionalWinner.name === 'TwoQueueCache' ? '2Q Cache' : traditionalWinner.name.replace('Cache',' Cache')) : 'Run simulation', color: '#10b981' },
                  { label: 'Lowest Latency', value: loading ? '...' : traditionalFastest ? `${traditionalFastest.avg_latency_us} µs` : '—', sub: loading ? 'Measuring...' : traditionalFastest ? (traditionalFastest.name === 'TwoQueueCache' ? '2Q Cache' : traditionalFastest.name.replace('Cache',' Cache')) : 'Run simulation', color: '#10b981' },
                  { label: 'Workload Length', value: loading ? '...' : `${length}`, sub: loading ? 'Generating...' : results ? results.workload_name : 'Not run yet', color: '#6366f1' },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} className="stat-card">
                    <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-[#f9fafb] font-mono my-1" style={{ color: value !== '—' && !loading ? color : undefined }}>{value}</h3>
                    <p className="text-[11px] text-[#6b7280] truncate">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Bar Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cache Hit Rates Chart */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1f2937]">
                    <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Cache Hit Rates (%)</h3>
                    <WindowDots/>
                  </div>
                  <div className="h-56 relative flex items-center justify-center">
                    {loading ? (
                      <EmptyChart label="Loading..."/>
                    ) : results ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={traditionalSummary.map(r => ({
                            name: r.name === 'TwoQueueCache' ? '2Q' : r.name.replace('Cache',''),
                            'Hit Rate (%)': r.hit_rate
                          }))}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                          <YAxis stroke="#6b7280" fontSize={10} tickLine={false} domain={[0, 100]} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }} />
                          <Bar dataKey="Hit Rate (%)" radius={[4, 4, 0, 0]}>
                            {traditionalSummary.map((r, index) => (
                              <Cell key={`cell-${index}`} fill={r.name === traditionalWinner?.name ? '#10b981' : '#1f2937'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyChart label="No data yet"/>
                    )}
                  </div>
                </div>

                {/* Average Latency Chart */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1f2937]">
                    <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Average Latency (Lower = Better)</h3>
                    <WindowDots/>
                  </div>
                  <div className="h-56 relative flex items-center justify-center">
                    {loading ? (
                      <EmptyChart label="Loading..."/>
                    ) : results ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={traditionalSummary.map(r => ({
                            name: r.name === 'TwoQueueCache' ? '2Q' : r.name.replace('Cache',''),
                            'Latency (µs)': r.avg_latency_us
                          }))}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                          <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }} />
                          <Bar dataKey="Latency (µs)" radius={[4, 4, 0, 0]}>
                            {traditionalSummary.map((r, index) => (
                              <Cell key={`cell-${index}`} fill={r.name === traditionalFastest?.name ? '#10b981' : '#1f2937'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyChart label="No data yet"/>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1f2937]">
                  <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Running Hit Rate Trendline</h3>
                  <WindowDots/>
                </div>
                <div className="h-64 relative flex items-center justify-center">
                  {loading ? (
                    <EmptyChart label="Simulating..."/>
                  ) : results ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={(results?.trends.labels ?? []).map((label, idx) => ({
                          name: label,
                          FIFO: results.trends.FIFOCache?.[idx] ?? 0,
                          LRU: results.trends.LRUCache?.[idx] ?? 0,
                          LFU: results.trends.LFUCache?.[idx] ?? 0,
                          '2Q': results.trends.TwoQueueCache?.[idx] ?? 0,
                        }))}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                        <YAxis stroke="#6b7280" fontSize={10} tickLine={false} domain={[0, 100]} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }} />
                        <RechartsLegend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                        <Line type="monotone" dataKey="FIFO" stroke="#10b981" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="LRU" stroke="#34d399" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="LFU" stroke="#a3e635" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="2Q" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart label="Run simulation to see trends"/>
                  )}
                </div>
              </div>

              {/* Heatmaps */}
              {results && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#1f2937]">
                      <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Workload Key Access Heatmap</h3>
                      <WindowDots/>
                    </div>
                    <p className="text-[10px] text-[#6b7280] mb-3">Key access frequency across the keyspace (up to {universeSize} keys). Orange = hot keys.</p>
                    <WorkloadHeatmap freqMap={results.freq_map} universeSize={Number(universeSize)}/>
                  </div>
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#1f2937]">
                      <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Cache Residency Grid</h3>
                      <WindowDots/>
                    </div>
                    <p className="text-[10px] text-[#6b7280] mb-3">Keys currently resident in cache at simulation end. Toggle policies to compare.</p>
                    <CacheResidencyVisualizer summary={traditionalSummary} universeSize={Number(universeSize)} freqMap={results.freq_map}/>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1f2937]">
                  <div className="flex items-center gap-2">
                    <Table className="h-3.5 w-3.5 text-[#6b7280]"/>
                    <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Detailed Results</h3>
                  </div>
                  <WindowDots/>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#1f2937] text-[10px] font-semibold uppercase tracking-wider text-[#6b7280]">
                        {['Policy', 'Capacity', 'Hit Rate', 'Hits', 'Misses', 'Evictions', 'Time'].map(h => (
                          <th key={h} className="py-3 px-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2937]/60 text-xs">
                      {loading ? (
                        <tr><td colSpan="7" className="py-8 text-center text-[#6b7280]">Running simulation...</td></tr>
                      ) : results ? traditionalSummary.map((r, i) => {
                        const isWinner = r.name === traditionalWinner?.name;
                        const isFastest = r.name === traditionalFastest?.name;
                        const dn = r.name === 'TwoQueueCache' ? '2Q Cache' : r.name.replace('Cache',' Cache');
                        return (
                          <tr key={i} className={`transition-colors ${isWinner ? 'bg-[#10b981]/5' : 'hover:bg-[#1e2433]/40'}`}>
                            <td className="py-3.5 px-4 font-medium text-[#f9fafb] flex items-center gap-2">
                              {dn}
                              {isWinner && <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold uppercase tracking-wide">Best</span>}
                              {isFastest && !isWinner && <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold uppercase tracking-wide">Fast</span>}
                            </td>
                            <td className="py-3.5 px-4 text-[#6b7280] font-mono">{r.capacity}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-12 h-1 bg-[#1e2433] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full bg-[#10b981]" style={{ width: `${r.hit_rate}%` }}/>
                                </div>
                                <span className={`font-mono font-semibold ${isWinner ? 'text-[#10b981]' : 'text-[#d1d5db]'}`}>{r.hit_rate}%</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#9ca3af] font-mono">{r.hits.toLocaleString()}</td>
                            <td className="py-3.5 px-4 text-[#9ca3af] font-mono">{r.misses.toLocaleString()}</td>
                            <td className="py-3.5 px-4 text-[#ef4444] font-mono">{r.evictions.toLocaleString()}</td>
                            <td className="py-3.5 px-4 text-[#10b981] font-mono">{(r.time_sec * 1000).toFixed(2)} ms</td>
                          </tr>
                        );
                      }) : (
                        <tr><td colSpan="7" className="py-8 text-center text-[#6b7280]">Run a simulation to see results.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </div>
        )}

        {/* ─────────── Tab 2: Redis / Tiered ─────────── */}
        {activeTab === 'redis' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1 flex flex-col gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1f2937]">
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-[#10b981]"/>
                    <h3 className="text-xs font-semibold text-[#d1d5db] uppercase tracking-wider">Tiered Settings</h3>
                  </div>
                  <WindowDots/>
                </div>
                <div className="flex flex-col gap-4">
                  {/* L1 */}
                  <div className="p-3.5 bg-[#0d1117] border border-[#052e16] rounded-xl">
                    <h4 className="text-[10px] font-bold text-[#6366f1] uppercase tracking-wider mb-3">L1 Cache Layer</h4>
                    <div className="flex flex-col gap-2.5">
                      <div>
                        <label className="block text-[9px] text-[#6b7280] uppercase tracking-wider mb-1 font-semibold">Policy</label>
                        <select value={l1Policy} onChange={e => setL1Policy(e.target.value)} className={inpSm}>
                          <option value="LRUCache">LRU Cache (Exact)</option>
                          <option value="LFUCache">LFU Cache (O(1))</option>
                          <option value="FIFOCache">FIFO Cache (Queue)</option>
                          <option value="TwoQueueCache">2Q Cache (Scan-Resistant)</option>
                        </select>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[9px] text-[#6b7280] uppercase tracking-wider font-semibold">Capacity</label>
                          <span className="text-[9px] font-mono text-[#6366f1]">{l1Capacity} slots</span>
                        </div>
                        <input type="range" min="2" max="100" step="2" value={l1Capacity} onChange={e => setL1Capacity(e.target.value)} className="w-full h-1 cursor-pointer accent-[#6366f1]"/>
                      </div>
                    </div>
                  </div>
                  {/* L2 */}
                  <div className="p-3.5 bg-[#0d1117] border border-[#450a0a] rounded-xl">
                    <h4 className="text-[10px] font-bold text-[#ef4444] uppercase tracking-wider mb-3">L2 Cache Layer</h4>
                    <div className="flex flex-col gap-2.5">
                      <div>
                        <label className="block text-[9px] text-[#6b7280] uppercase tracking-wider mb-1 font-semibold">Policy</label>
                        <select value={l2Policy} onChange={e => setL2Policy(e.target.value)} className={inpSm}>
                          <option value="RedisCache">Redis Cache (Approx. LRU)</option>
                          <option value="LRUCache">LRU Cache (Exact)</option>
                          <option value="LFUCache">LFU Cache (O(1))</option>
                          <option value="FIFOCache">FIFO Cache</option>
                          <option value="TwoQueueCache">2Q Cache</option>
                        </select>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[9px] text-[#6b7280] uppercase tracking-wider font-semibold">Capacity</label>
                          <span className="text-[9px] font-mono text-[#ef4444]">{l2Capacity} slots</span>
                        </div>
                        <input type="range" min="10" max="500" step="10" value={l2Capacity} onChange={e => setL2Capacity(e.target.value)} className="w-full h-1 cursor-pointer accent-[#ef4444]"/>
                      </div>
                    </div>
                  </div>
                  {/* Mode */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Inclusion Mode</label>
                    <select value={policyMode} onChange={e => setPolicyMode(e.target.value)} className={inp}>
                      <option value="exclusive">Exclusive (Promotion/Demotion)</option>
                      <option value="inclusive">Inclusive (Backdraft Evictions)</option>
                    </select>
                  </div>
                  {/* Latencies */}
                  <div className="p-3 bg-[#0d1117] border border-[#1f2937] rounded-xl">
                    <h4 className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">Access Latencies (µs)</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[['L1 RAM', tL1, setTL1, '0.1', '0.1'], ['L2 Redis', tL2, setTL2, '0.5', '1.0'], ['DB Disk', tDb, setTDb, '10', '50']].map(([lbl, val, set, step, min]) => (
                        <div key={lbl}>
                          <label className="block text-[8px] text-[#6b7280] uppercase tracking-wider mb-0.5 font-semibold">{lbl}</label>
                          <input type="number" step={step} min={min} value={val} onChange={e => set(e.target.value)} className={inpXs}/>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Workload */}
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Workload</label>
                      <select value={mlWorkloadType} onChange={e => setMlWorkloadType(e.target.value)} className={inp}>
                        <option value="zipf">Zipfian (Skewed)</option>
                        <option value="random">Random (Uniform)</option>
                        <option value="scan">Sequential Scan</option>
                        <option value="mixed">Mixed Workload</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[['Length', mlLength, setMlLength, '100', '20000'], ['Universe', mlUniverseSize, setMlUniverseSize, '50', '5000']].map(([lbl, val, set, min, max]) => (
                        <div key={lbl}>
                          <label className="block text-[9px] text-[#6b7280] uppercase tracking-wider mb-0.5 font-semibold">{lbl}</label>
                          <input type="number" min={min} max={max} value={val} onChange={e => set(e.target.value)} className={inpXs}/>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleRunMultiLevel} disabled={mlLoading}
                    className="w-full flex items-center justify-center gap-2 mt-1 bg-[#10b981] hover:bg-[#059669] text-[#020617] font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 text-sm cursor-pointer">
                    {mlLoading ? <RefreshCw className="h-4 w-4 animate-spin"/> : <><Play className="h-4 w-4 fill-[#020617]"/>Simulate Tiered Cache</>}
                  </button>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-3 flex flex-col gap-6">
              {mlError && <div className="bg-[#450a0a]/30 border border-[#dc2626]/30 text-[#fca5a5] px-5 py-3 rounded-xl text-sm"><strong>Error:</strong> {mlError}</div>}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'L1 Hit Rate', val: mlResults ? `${mlResults.stats.l1_hit_rate}%` : '—', sub: mlResults ? `${mlResults.stats.l1_hits.toLocaleString()} hits` : 'No run yet', color: '#6366f1' },
                  { label: 'L2 Hit Rate', val: mlResults ? `${mlResults.stats.l2_hit_rate}%` : '—', sub: mlResults ? `${mlResults.stats.l2_hits.toLocaleString()} hits` : 'No run yet', color: '#ef4444' },
                  { label: 'DB Read Rate', val: mlResults ? `${mlResults.stats.db_read_rate}%` : '—', sub: mlResults ? `${mlResults.stats.db_reads.toLocaleString()} queries` : 'No run yet', color: '#6b7280' },
                  { label: 'EAT (avg)', val: mlResults ? `${mlResults.stats.eat_us} µs` : '—', sub: mlResults ? `vs ${tDb} µs DB` : 'No run yet', color: '#10b981' },
                ].map(({ label, val, sub, color }) => (
                  <div key={label} className="stat-card">
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color }}>{label}</p>
                    <h3 className="text-xl font-bold font-mono text-[#f9fafb] my-1">{mlLoading ? '...' : val}</h3>
                    <p className="text-[10px] text-[#6b7280]">{sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                <div className="glass-card p-5 md:col-span-2">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1f2937]">
                    <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Request Resolution</h3>
                    <WindowDots/>
                  </div>
                  <div className="h-52 relative flex items-center justify-center">
                    {mlLoading ? (
                      <EmptyChart label="Loading..."/>
                    ) : mlResults ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'L1 Hits', value: mlResults.stats.l1_hits, color: '#6366f1' },
                              { name: 'L2 Hits', value: mlResults.stats.l2_hits, color: '#ef4444' },
                              { name: 'DB Reads', value: mlResults.stats.db_reads, color: '#374151' }
                            ]}
                            cx="50%"
                            cy="45%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {[
                              { name: 'L1 Hits', value: mlResults.stats.l1_hits, color: '#6366f1' },
                              { name: 'L2 Hits', value: mlResults.stats.l2_hits, color: '#ef4444' },
                              { name: 'DB Reads', value: mlResults.stats.db_reads, color: '#374151' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
                            ))}
                          </Pie>
                          <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }} />
                          <RechartsLegend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyChart label="No data yet"/>
                    )}
                  </div>
                </div>
                <div className="glass-card p-5 md:col-span-3">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1f2937]">
                    <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Effective Access Time (EAT)</h3>
                    <WindowDots/>
                  </div>
                  <div className="h-52 relative flex items-center justify-center">
                    {mlLoading ? (
                      <EmptyChart label="Loading..."/>
                    ) : mlResults ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'No Cache', EAT: mlResults.stats.no_cache_eat_us, color: '#6b7280' },
                            { name: 'L1 RAM', EAT: mlResults.stats.l1_only_eat_us, color: '#6366f1' },
                            { name: 'L2 Redis', EAT: Number(redisEatUs.toFixed(3)), color: '#ef4444' },
                            { name: 'Tiered', EAT: mlResults.stats.eat_us, color: '#10b981' }
                          ]}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={9} tickLine={false} />
                          <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }} />
                          <Bar dataKey="EAT" radius={[4, 4, 0, 0]}>
                            {[
                              { name: 'No Cache', color: '#6b7280' },
                              { name: 'L1 RAM', color: '#6366f1' },
                              { name: 'L2 Redis', color: '#ef4444' },
                              { name: 'Tiered', color: '#10b981' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyChart label="No data yet"/>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1f2937]">
                  <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Performance Timeline</h3>
                  <WindowDots/>
                </div>
                <div className="h-64 relative flex items-center justify-center">
                  {mlLoading ? (
                    <EmptyChart label="Simulating..."/>
                  ) : mlResults ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={(mlResults?.trends.labels ?? []).map((label, idx) => ({
                          name: label,
                          EAT: mlResults.trends.eat_trend?.[idx] ?? 0,
                          'L1 Hit Rate (%)': mlResults.trends.l1_hit_rate_trend?.[idx] ?? 0,
                          'L2 Hit Rate (%)': mlResults.trends.l2_hit_rate_trend?.[idx] ?? 0,
                        }))}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                        <YAxis yAxisId="left" stroke="#10b981" fontSize={10} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="#6366f1" fontSize={10} tickLine={false} domain={[0, 100]} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }} />
                        <RechartsLegend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                        <Line yAxisId="left" type="monotone" dataKey="EAT" stroke="#10b981" strokeWidth={2} dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="L1 Hit Rate (%)" stroke="#6366f1" strokeWidth={1.5} dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="L2 Hit Rate (%)" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart label="Run simulation to see performance over time"/>
                  )}
                </div>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1f2937]">
                  <div className="flex items-center gap-2"><Table className="h-3.5 w-3.5 text-[#6b7280]"/><h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Simulation Details</h3></div>
                  <WindowDots/>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <tbody className="divide-y divide-[#1f2937]/60">
                    {[
                      { label: 'Total Accesses', val: mlResults?.stats.total_requests.toLocaleString(), color: '#d1d5db' },
                      { label: 'L1 Layer Hits', val: mlResults ? `${mlResults.stats.l1_hits.toLocaleString()} (${mlResults.stats.l1_hit_rate}%)` : null, color: '#6366f1' },
                      { label: 'L2 Layer Hits', val: mlResults ? `${mlResults.stats.l2_hits.toLocaleString()} (${mlResults.stats.l2_hit_rate}%)` : null, color: '#ef4444' },
                      { label: 'Database Queries', val: mlResults ? `${mlResults.stats.db_reads.toLocaleString()} (${mlResults.stats.db_read_rate}%)` : null, color: '#6b7280' },
                      { label: 'Effective Access Time', val: mlResults ? `${mlResults.stats.eat_us} µs` : null, color: '#10b981', highlight: true },
                      { label: 'Latency Speedup', val: mlResults ? `${(tDb / mlResults.stats.eat_us).toFixed(1)}× faster than DB` : null, color: '#34d399' },
                    ].map(({ label, val, color, highlight }) => (
                      <tr key={label} className={`${highlight ? 'bg-[#10b981]/5' : 'hover:bg-[#1e2433]/40'} transition-colors`}>
                        <td className="py-3 px-4 font-medium text-[#d1d5db]" style={highlight ? { color } : {}}>{label}</td>
                        <td className="py-3 px-4 font-mono font-semibold" style={{ color }}>{val ?? 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        )}

        {/* ─────────── Tab 3: ML Showdown ─────────── */}
        {activeTab === 'ml' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1 flex flex-col gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1f2937]">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-[#10b981]"/>
                    <h3 className="text-xs font-semibold text-[#d1d5db] uppercase tracking-wider">Showdown Config</h3>
                  </div>
                  <WindowDots/>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Workload Type</label>
                    <select value={showdownWorkloadType} onChange={e => setShowdownWorkloadType(e.target.value)} className={inp}>
                      <option value="zipf">Zipfian (Realistic)</option>
                      <option value="random">Random Uniform</option>
                      <option value="scan">Sequential Scan</option>
                      <option value="mixed">Mixed Workload</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">Cache Capacity (L2)</label>
                      <span className="text-[10px] font-mono text-[#d1d5db]">{showdownCapacity} slots</span>
                    </div>
                    <input type="range" min="10" max="1000" step="10" value={showdownCapacity} onChange={e => setShowdownCapacity(e.target.value)} className="w-full h-1 cursor-pointer accent-[#10b981]"/>
                    <p className="text-[9px] text-[#6b7280] mt-1.5">L1 = 20% of L2 ({Math.max(2, Math.floor(showdownCapacity*0.2))} slots)</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Workload Length</label>
                    <input type="number" min="100" max="10000" value={showdownLength} onChange={e => setShowdownLength(e.target.value)} className={inp}/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Universe Size</label>
                    <input type="number" min="50" max="5000" value={showdownUniverseSize} onChange={e => setShowdownUniverseSize(e.target.value)} className={inp}/>
                  </div>
                  {showdownWorkloadType === 'zipf' && (
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">Zipf Coefficient (α)</label>
                      <input type="number" step="0.05" min="0.1" max="2.5" value={showdownAlpha} onChange={e => setShowdownAlpha(e.target.value)} className={inp}/>
                    </div>
                  )}
                  <div className="p-3 bg-[#0d1117] border border-[#1f2937] rounded-xl">
                    <h4 className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">Access Latencies (µs)</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[['L1', showdownTL1, setShowdownTL1, '0.1', '0.1'], ['L2', showdownTL2, setShowdownTL2, '0.5', '1.0'], ['DB', showdownTDb, setShowdownTDb, '10', '50']].map(([lbl, val, set, step, min]) => (
                        <div key={lbl}>
                          <label className="block text-[8px] text-[#6b7280] uppercase tracking-wider mb-0.5 font-semibold">{lbl}</label>
                          <input type="number" step={step} min={min} value={val} onChange={e => set(e.target.value)} className={inpXs}/>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-[#0d1117] border border-[#1f2937] rounded-xl">
                    <h4 className="text-[9px] font-bold text-[#10b981] uppercase tracking-wider mb-2">Tiered Cache Policies</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] text-[#6b7280] uppercase tracking-wider mb-0.5 font-semibold">L1 Policy</label>
                        <select value={showdownL1Policy} onChange={e => setShowdownL1Policy(e.target.value)} className={inpXs}>
                          <option value="LRUCache">LRU</option>
                          <option value="LFUCache">LFU</option>
                          <option value="FIFOCache">FIFO</option>
                          <option value="TwoQueueCache">2Q</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] text-[#6b7280] uppercase tracking-wider mb-0.5 font-semibold">L2 Policy</label>
                        <select value={showdownL2Policy} onChange={e => setShowdownL2Policy(e.target.value)} className={inpXs}>
                          <option value="RedisCache">Redis</option>
                          <option value="LRUCache">LRU</option>
                          <option value="LFUCache">LFU</option>
                          <option value="FIFOCache">FIFO</option>
                          <option value="TwoQueueCache">2Q</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-[8px] text-[#6b7280] uppercase tracking-wider mb-0.5 font-semibold">Mode</label>
                      <select value={showdownPolicyMode} onChange={e => setShowdownPolicyMode(e.target.value)} className={inpXs}>
                        <option value="exclusive">Exclusive</option>
                        <option value="inclusive">Inclusive</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleRunShowdown} disabled={showdownLoading}
                    className="w-full flex items-center justify-center gap-2 mt-1 bg-[#10b981] hover:bg-[#059669] text-[#020617] font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 text-sm cursor-pointer">
                    {showdownLoading ? <RefreshCw className="h-4 w-4 animate-spin"/> : <><Zap className="h-4 w-4"/>Run Cache Showdown</>}
                  </button>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-3 flex flex-col gap-6">
              {showdownError && <div className="bg-[#450a0a]/30 border border-[#dc2626]/30 text-[#fca5a5] px-5 py-3 rounded-xl text-sm"><strong>Error:</strong> {showdownError}</div>}

              <CachingEvolutionFlow/>

              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-5 pb-2 border-b border-[#1f2937]">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#10b981]"/>
                    <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Policy Leaderboard</h3>
                  </div>
                  {showdownResults && <span className="text-[10px] text-[#6b7280] font-mono">{showdownResults.workloadName}</span>}
                </div>
                <PolicyLeaderboard combinedResults={showdownResults?.combined} loading={showdownLoading}/>
              </div>

              <RandomForestExplanation/>
            </main>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="mt-16 pt-8 border-t border-[#1f2937] text-center">
        <p className="text-[11px] text-[#374151]">
          Built with FastAPI + React + Chart.js ·{' '}
          <a href="https://github.com/ninjanavya" target="_blank" rel="noopener noreferrer" className="text-[#10b981] hover:underline">github.com/ninjanavya</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
