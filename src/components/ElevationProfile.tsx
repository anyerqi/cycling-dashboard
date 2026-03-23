'use client';

import { useState, useCallback, useMemo, useId } from 'react';
import { TrackPoint } from '@/lib/types';

export type { TrackPoint };

interface ElevationProfileProps {
  trackPoints: TrackPoint[];
  routeName?: string;
  className?: string;
}

// SVG canvas dimensions
const VIEW_W = 900;
const VIEW_H = 280;
const PAD = { top: 44, right: 28, bottom: 48, left: 68 };
const CHART_W = VIEW_W - PAD.left - PAD.right;
const CHART_H = VIEW_H - PAD.top - PAD.bottom;
// Minimum vertical span to avoid divide-by-zero on flat profiles
const MIN_ELEV_SPAN = 10;

/** Catmull-Rom spline → SVG cubic bezier path string */
function catmullRomPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  const d: string[] = [`M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d.push(
      `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    );
  }
  return d.join(' ');
}

/** Binary search: index of the element in a sorted array closest to target */
function binarySearchClosest(arr: number[], target: number): number {
  if (arr.length === 0) return 0;
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  if (lo > 0 && Math.abs(arr[lo - 1] - target) <= Math.abs(arr[lo] - target)) {
    return lo - 1;
  }
  return lo;
}

export default function ElevationProfile({
  trackPoints,
  routeName = 'Route Profile',
  className = '',
}: ElevationProfileProps) {
  const uid = useId().replace(/:/g, '');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  /* ── Derived statistics (sorts input by distance defensively) ── */
  const stats = useMemo(() => {
    if (trackPoints.length < 2) return null;

    // Sort a copy so callers don't need to guarantee order
    const sorted = [...trackPoints].sort((a, b) => a.distance - b.distance);
    const maxDist = sorted[sorted.length - 1].distance;

    // Guard: a single point at distance 0 (or duplicate distances) makes the X axis degenerate
    if (maxDist <= 0) return null;

    const elevs = sorted.map((p) => p.elevation);
    const maxElev = Math.max(...elevs);
    const minElev = Math.min(...elevs);

    let totalGain = 0;
    for (let i = 1; i < sorted.length; i++) {
      const diff = sorted[i].elevation - sorted[i - 1].elevation;
      if (diff > 0) totalGain += diff;
    }

    const summitIdx = elevs.indexOf(maxElev);
    const distances = sorted.map((p) => p.distance); // pre-built for binary search

    return {
      sorted,
      distances,
      maxElev,
      minElev,
      maxDist,
      totalGain: Math.round(totalGain),
      summitIdx,
    };
  }, [trackPoints]);

  /* ── Map sorted track points → SVG coordinates ── */
  const svgPts = useMemo(() => {
    if (!stats) return [];
    const { sorted, maxElev, minElev, maxDist } = stats;
    const span = maxElev - minElev;
    const paddedMin = minElev - span * 0.08;
    const paddedMax = maxElev + span * 0.12;
    // Clamp to MIN_ELEV_SPAN so flat profiles never divide by zero
    const elevSpan = Math.max(paddedMax - paddedMin, MIN_ELEV_SPAN);
    return sorted.map((p) => ({
      x: PAD.left + (p.distance / maxDist) * CHART_W,
      y: PAD.top + CHART_H - ((p.elevation - paddedMin) / elevSpan) * CHART_H,
    }));
  }, [stats]);

  /* ── Y-axis ticks ── */
  const yTicks = useMemo(() => {
    if (!stats) return [];
    const { maxElev, minElev } = stats;
    const span = maxElev - minElev;
    const paddedMin = minElev - span * 0.08;
    const paddedMax = maxElev + span * 0.12;
    const elevSpan = Math.max(paddedMax - paddedMin, MIN_ELEV_SPAN);
    const interval = Math.ceil(span / 4 / 100) * 100 || 100;
    const start = Math.ceil(paddedMin / interval) * interval;
    const ticks: { value: number; y: number }[] = [];
    for (let v = start; v <= paddedMax + 1; v += interval) {
      ticks.push({
        value: v,
        y: PAD.top + CHART_H - ((v - paddedMin) / elevSpan) * CHART_H,
      });
    }
    return ticks;
  }, [stats]);

  /* ── X-axis ticks ── */
  const xTicks = useMemo(() => {
    if (!stats) return [];
    const { maxDist } = stats;
    const interval = maxDist > 50 ? 10 : maxDist > 25 ? 5 : 2;
    const ticks: { value: number; x: number }[] = [];
    for (let d = 0; d <= maxDist; d += interval) {
      ticks.push({ value: d, x: PAD.left + (d / maxDist) * CHART_W });
    }
    const last = ticks[ticks.length - 1];
    if (last.value < maxDist - interval * 0.3) {
      ticks.push({ value: Math.round(maxDist * 10) / 10, x: PAD.left + CHART_W });
    }
    return ticks;
  }, [stats]);

  const smoothPath = useMemo(() => catmullRomPath(svgPts), [svgPts]);

  // Require >= 2 SVG points so smoothPath is non-empty before closing the fill shape
  const fillPath = useMemo(() => {
    if (svgPts.length < 2 || !smoothPath) return '';
    const bottom = PAD.top + CHART_H;
    const last = svgPts[svgPts.length - 1];
    return `${smoothPath} L ${last.x.toFixed(1)} ${bottom} L ${PAD.left} ${bottom} Z`;
  }, [smoothPath, svgPts]);

  /* ── Hover interaction — O(log n) binary search on sorted distances ── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!stats) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = VIEW_W / rect.width;
      const chartX = (e.clientX - rect.left) * scaleX - PAD.left;
      if (chartX < 0 || chartX > CHART_W) {
        setHoverIdx(null);
        return;
      }
      const dist = (chartX / CHART_W) * stats.maxDist;
      setHoverIdx(binarySearchClosest(stats.distances, dist));
    },
    [stats]
  );

  if (!stats) {
    return (
      <div className={`bg-gray-900 rounded-xl p-6 ${className}`}>
        <p className="text-gray-500 text-sm">No track data available</p>
      </div>
    );
  }

  const hoverPt = hoverIdx !== null ? stats.sorted[hoverIdx] : null;
  const hoverSvg = hoverIdx !== null ? svgPts[hoverIdx] : null;
  const summitSvg = svgPts[stats.summitIdx];

  // IDs scoped per instance to avoid collisions when multiple charts are rendered
  const gradFillId = `elevFill-${uid}`;
  const gradStrokeId = `elevStroke-${uid}`;
  const glowId = `glow-${uid}`;
  const clipId = `reveal-${uid}`;

  return (
    <div className={`bg-[#0b0b18] rounded-xl overflow-hidden border border-white/8 ${className}`}>
      {/* ── Header bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-[#FFDB00] rounded-full" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
              Elevation Profile
            </p>
            <h3 className="text-sm font-bold text-white leading-tight">{routeName}</h3>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Distance</p>
            <p className="text-sm font-bold text-white">
              {stats.maxDist.toFixed(1)}{' '}
              <span className="text-gray-400 font-normal text-xs">km</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Climb</p>
            <p className="text-sm font-bold text-[#FFDB00]">
              +{stats.totalGain.toLocaleString()}{' '}
              <span className="text-gray-400 font-normal text-xs">m</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Summit</p>
            <p className="text-sm font-bold text-white">
              {stats.maxElev.toLocaleString()}{' '}
              <span className="text-gray-400 font-normal text-xs">m</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── SVG Chart ── */}
      <div className="px-1 pb-2 pt-1">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full"
          style={{ height: 'auto', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
          aria-label={`Elevation profile for ${routeName}`}
          role="img"
        >
          <defs>
            {/* Terrain fill gradient */}
            <linearGradient id={gradFillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFDB00" stopOpacity="0.45" />
              <stop offset="55%" stopColor="#FF7700" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0b0b18" stopOpacity="0.0" />
            </linearGradient>

            {/* Stroke gradient (left→right warm sweep) */}
            <linearGradient id={gradStrokeId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFE449" />
              <stop offset="55%" stopColor="#FFAB00" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>

            {/* Glow filter for the path */}
            <filter id={glowId} x="-5%" y="-30%" width="110%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Animated clip that reveals the chart left→right */}
            <clipPath id={clipId}>
              <rect x={PAD.left} y={0} height={VIEW_H} width={0}>
                <animate
                  attributeName="width"
                  from="0"
                  to={CHART_W}
                  dur="1.6s"
                  begin="0.1s"
                  fill="freeze"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.22 0.61 0.36 1"
                />
              </rect>
            </clipPath>
          </defs>

          {/* Dark background */}
          <rect width={VIEW_W} height={VIEW_H} fill="#0b0b18" />

          {/* Y grid lines + labels */}
          {yTicks.map(({ value, y }) => (
            <g key={value}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + CHART_W}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.38)"
                fontSize="10"
                fontFamily="'Courier New', monospace"
              >
                {value}
              </text>
            </g>
          ))}

          {/* X axis baseline */}
          <line
            x1={PAD.left}
            y1={PAD.top + CHART_H}
            x2={PAD.left + CHART_W}
            y2={PAD.top + CHART_H}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* X ticks + labels */}
          {xTicks.map(({ value, x }) => (
            <g key={value}>
              <line
                x1={x}
                y1={PAD.top + CHART_H}
                x2={x}
                y2={PAD.top + CHART_H + 5}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={PAD.top + CHART_H + 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.38)"
                fontSize="10"
                fontFamily="'Courier New', monospace"
              >
                {value}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text
            x={PAD.left + CHART_W / 2}
            y={VIEW_H - 5}
            textAnchor="middle"
            fill="rgba(255,255,255,0.22)"
            fontSize="8.5"
            fontFamily="sans-serif"
            letterSpacing="2"
          >
            DISTANCE (KM)
          </text>
          <text
            x={13}
            y={PAD.top + CHART_H / 2}
            textAnchor="middle"
            fill="rgba(255,255,255,0.22)"
            fontSize="8.5"
            fontFamily="sans-serif"
            letterSpacing="2"
            transform={`rotate(-90, 13, ${PAD.top + CHART_H / 2})`}
          >
            ELEVATION (M)
          </text>

          {/* ── Animated terrain ── */}
          <g clipPath={`url(#${clipId})`}>
            {/* Filled terrain area */}
            {fillPath && <path d={fillPath} fill={`url(#${gradFillId})`} />}

            {/* Elevation line with glow */}
            {smoothPath && (
              <path
                d={smoothPath}
                fill="none"
                stroke={`url(#${gradStrokeId})`}
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter={`url(#${glowId})`}
              />
            )}
          </g>

          {/* ── Summit marker (HC triangle) ── */}
          {summitSvg && (
            <g>
              <line
                x1={summitSvg.x}
                y1={summitSvg.y - 2}
                x2={summitSvg.x}
                y2={PAD.top + CHART_H}
                stroke="rgba(255,219,0,0.25)"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              {/* Triangle peak */}
              <polygon
                points={`${summitSvg.x},${summitSvg.y - 20} ${summitSvg.x - 8},${summitSvg.y - 5} ${summitSvg.x + 8},${summitSvg.y - 5}`}
                fill="#FFDB00"
              />
              {/* "HC" label */}
              <text
                x={summitSvg.x}
                y={summitSvg.y - 25}
                textAnchor="middle"
                fill="#FFDB00"
                fontSize="9"
                fontWeight="800"
                fontFamily="sans-serif"
                letterSpacing="0.5"
              >
                HC
              </text>
              {/* Elevation value */}
              <text
                x={summitSvg.x}
                y={summitSvg.y - 36}
                textAnchor="middle"
                fill="rgba(255,219,0,0.85)"
                fontSize="10"
                fontWeight="bold"
                fontFamily="'Courier New', monospace"
              >
                {stats.maxElev}m
              </text>
            </g>
          )}

          {/* ── Start marker ── */}
          {svgPts.length > 0 && (
            <g>
              <circle cx={svgPts[0].x} cy={svgPts[0].y} r="5" fill="#22c55e" />
              <text
                x={svgPts[0].x + 9}
                y={svgPts[0].y - 3}
                fill="#22c55e"
                fontSize="9"
                fontWeight="700"
                fontFamily="sans-serif"
                letterSpacing="0.5"
              >
                START
              </text>
            </g>
          )}

          {/* ── Finish marker ── */}
          {svgPts.length > 1 && (
            <g>
              <circle
                cx={svgPts[svgPts.length - 1].x}
                cy={svgPts[svgPts.length - 1].y}
                r="5"
                fill="#f87171"
              />
              <text
                x={svgPts[svgPts.length - 1].x - 9}
                y={svgPts[svgPts.length - 1].y - 3}
                textAnchor="end"
                fill="#f87171"
                fontSize="9"
                fontWeight="700"
                fontFamily="sans-serif"
                letterSpacing="0.5"
              >
                FINISH
              </text>
            </g>
          )}

          {/* ── Hover crosshair + tooltip ── */}
          {hoverPt && hoverSvg && (
            <g>
              {/* Vertical crosshair */}
              <line
                x1={hoverSvg.x}
                y1={PAD.top}
                x2={hoverSvg.x}
                y2={PAD.top + CHART_H}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              {/* Data point circle */}
              <circle
                cx={hoverSvg.x}
                cy={hoverSvg.y}
                r="5"
                fill="#FFDB00"
                stroke="white"
                strokeWidth="1.5"
              />
              {/* Tooltip box */}
              {(() => {
                const flip = hoverSvg.x > PAD.left + CHART_W * 0.72;
                const tx = flip ? hoverSvg.x - 94 : hoverSvg.x + 10;
                const ty = Math.max(PAD.top + 4, hoverSvg.y - 42);
                return (
                  <g>
                    <rect
                      x={tx}
                      y={ty}
                      width={84}
                      height={38}
                      rx="4"
                      fill="rgba(5,5,20,0.92)"
                      stroke="rgba(255,219,0,0.45)"
                      strokeWidth="1"
                    />
                    <text
                      x={tx + 8}
                      y={ty + 14}
                      fill="rgba(255,255,255,0.55)"
                      fontSize="9"
                      fontFamily="'Courier New', monospace"
                    >
                      {hoverPt.distance.toFixed(1)} km
                    </text>
                    <text
                      x={tx + 8}
                      y={ty + 27}
                      fill="#FFDB00"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="'Courier New', monospace"
                    >
                      {Math.round(hoverPt.elevation)} m
                    </text>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
