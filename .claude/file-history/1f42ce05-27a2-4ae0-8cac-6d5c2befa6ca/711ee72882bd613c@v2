"use client";

import { useMemo, useState } from "react";
import { TrackPoint, ElevationProfileProps } from "@/lib/types";

export default function ElevationProfile({ trackPoints, className = "" }: ElevationProfileProps) {
  const [hoveredPoint, setHoveredPoint] = useState<TrackPoint | null>(null);

  const { minElevation, maxElevation, totalDistance, totalElevation, summitPoint } = useMemo(() => {
    if (trackPoints.length === 0) {
      return { minElevation: 0, maxElevation: 0, totalDistance: 0, totalElevation: 0, summitPoint: null };
    }

    const elevations = trackPoints.map((p) => p.elevation);
    const minE = Math.min(...elevations);
    const maxE = Math.max(...elevations);
    const totalDist = trackPoints[trackPoints.length - 1].distance;
    const totalElev = elevations.reduce((sum, e, i) => (i === 0 ? 0 : e - elevations[i - 1]) + sum, 0);
    const summit = trackPoints.reduce((max, p) => (p.elevation > max.elevation ? p : max), trackPoints[0]);

    return { minElevation: minE, maxElevation: maxE, totalDistance: totalDist, totalElevation: Math.abs(totalElev), summitPoint: summit };
  }, [trackPoints]);

  const { pathD, xTicks, yTicks } = useMemo(() => {
    if (trackPoints.length < 2) {
      return { pathD: "", xTicks: [], yTicks: [] };
    }

    const _padding = { top: 50, right: 40, bottom: 50, left: 70 };
    const width = 800;
    const height = 300;
    const innerWidth = width - _padding.left - _padding.right;
    const innerHeight = height - _padding.top - _padding.bottom;

    const maxDist = trackPoints[trackPoints.length - 1].distance;
    const elevRange = maxElevation - minElevation || 1;
    const elevPadding = Math.max(elevRange * 0.1, 10);

    const getX = (distance: number) => _padding.left + (distance / maxDist) * innerWidth;
    const getY = (elevation: number) => _padding.top + innerHeight - ((elevation - minElevation + elevPadding) / (elevRange + elevPadding * 2)) * innerHeight;

    const pathData = trackPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(p.distance)} ${getY(p.elevation)}`).join(" ");

    const xInterval = maxDist <= 20 ? 2 : maxDist <= 50 ? 5 : maxDist <= 100 ? 10 : 20;
    const xTicks = Array.from({ length: Math.ceil(maxDist / xInterval) + 1 }, (_, i) => i * xInterval);

    const yInterval = Math.pow(10, Math.floor(Math.log10(elevRange / 5)));
    const yTicks = Array.from({ length: Math.ceil((elevRange + elevPadding * 2) / yInterval) + 1 }, (_, i) => minElevation - elevPadding + i * yInterval).filter((v) => v >= minElevation - elevPadding && v <= maxElevation + elevPadding);

    return { pathD: pathData, xTicks, yTicks };
  }, [trackPoints, minElevation, maxElevation]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left - 70;
    const width = rect.width - 110;
    const maxDist = trackPoints[trackPoints.length - 1]?.distance || 1;
    const hoveredDist = (x / width) * maxDist;

    const closest = trackPoints.reduce((closest, p) => {
      const dist = Math.abs(p.distance - hoveredDist);
      return dist < closest.dist ? { point: p, dist } : closest;
    }, { point: trackPoints[0], dist: Infinity });

    setHoveredPoint(closest.point);
  };

  const handleMouseLeave = () => setHoveredPoint(null);

  const formatDistance = (km: number) => (km >= 100 ? `${Math.round(km)} km` : km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`);
  const formatElevation = (m: number) => `${Math.round(m)} m`;

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-6 ${className}`}>
      <h2 className="text-base font-semibold text-white mb-4">Route & Elevation Profile</h2>

      {/* Header Stats */}
      <div className="flex gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Distance</span>
          <span className="text-white font-semibold">{formatDistance(totalDistance)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Total Climb</span>
          <span className="text-white font-semibold">+{formatElevation(totalElevation)}</span>
        </div>
        {summitPoint && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Summit</span>
            <span className="text-white font-semibold">{formatElevation(summitPoint.elevation)}</span>
          </div>
        )}
      </div>

      {/* Elevation SVG */}
      <div className="relative" style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        <svg viewBox="0 0 800 300" className="w-full h-auto" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <defs>
            <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Y-axis labels */}
          {yTicks.map((tick, i) => (
            <text key={i} x="65" y={50 + (200 / (yTicks.length - 1 || 1)) * i + 5} className="text-xs fill-gray-400" textAnchor="end">
              {tick}m
            </text>
          ))}

          {/* X-axis labels */}
          {xTicks.map((tick, i) => (
            <text key={i} x={70 + (680 / (xTicks.length - 1 || 1)) * i} y="285" className="text-xs fill-gray-400" textAnchor="middle">
              {formatDistance(tick)}
            </text>
          ))}

          {/* Elevation area with gradient */}
          {pathD && (
            <>
              <path
                d={`${pathD} L ${70 + 680} 250 L 70 250 Z`}
                fill="url(#elevationGradient)"
                opacity="0.4"
                filter="url(#glow)"
              />
              <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2" filter="url(#glow)" />

              {/* Start marker */}
              <circle cx="70" cy={50 + (200 / (yTicks.length - 1 || 1)) * ((trackPoints[0].elevation - (yTicks[0] || 0)) / ((yTicks[1] || 10) - (yTicks[0] || 0)))} r="4" fill="#10b981" />
              <text x="70" y="270" className="text-xs fill-green-400" textAnchor="middle">Start</text>

              {/* Finish marker */}
              <circle cx="750" cy={50 + (200 / (yTicks.length - 1 || 1)) * ((trackPoints[trackPoints.length - 1].elevation - (yTicks[0] || 0)) / ((yTicks[1] || 10) - (yTicks[0] || 0)))} r="4" fill="#ef4444" />
              <text x="750" y="270" className="text-xs fill-red-400" textAnchor="middle">Finish</text>

              {/* Summit marker */}
              {summitPoint && (
                <>
                  <polygon
                    cx={70 + (680 / (trackPoints[trackPoints.length - 1].distance || 1)) * summitPoint.distance}
                    cy={50 + (200 / (yTicks.length - 1 || 1)) * ((summitPoint.elevation - (yTicks[0] || 0)) / ((yTicks[1] || 10) - (yTicks[0] || 0)))}
                    points={`${70 + (680 / (trackPoints[trackPoints.length - 1].distance || 1)) * summitPoint.distance - 6},${50 + (200 / (yTicks.length - 1 || 1)) * ((summitPoint.elevation - (yTicks[0] || 0)) / ((yTicks[1] || 10) - (yTicks[0] || 0))) - 6} ${70 + (680 / (trackPoints[trackPoints.length - 1].distance || 1)) * summitPoint.distance + 6},${50 + (200 / (yTicks.length - 1 || 1)) * ((summitPoint.elevation - (yTicks[0] || 0)) / ((yTicks[1] || 10) - (yTicks[0] || 0))) - 6} ${70 + (680 / (trackPoints[trackPoints.length - 1].distance || 1)) * summitPoint.distance},${50 + (200 / (yTicks.length - 1 || 1)) * ((summitPoint.elevation - (yTicks[0] || 0)) / ((yTicks[1] || 10) - (yTicks[0] || 0))) + 6}`}
                    fill="#fbbf24"
                  />
                  <text x={70 + (680 / (trackPoints[trackPoints.length - 1].distance || 1)) * summitPoint.distance} y={40} className="text-xs fill-yellow-400" textAnchor="middle">
                    {formatElevation(summitPoint.elevation)}
                  </text>
                </>
              )}

              {/* Animated path reveal */}
              <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="680" strokeDashoffset="680">
                <animate attributeName="stroke-dashoffset" from="680" to="0" dur="2s" begin="0.5s" fill="freeze" />
              </path>
            </>
          )}

          {/* Hover tooltip */}
          {hoveredPoint && (
            <g>
              <line x1={70 + (680 / (trackPoints[trackPoints.length - 1].distance || 1)) * hoveredPoint.distance} y1="50" x2={70 + (680 / (trackPoints[trackPoints.length - 1].distance || 1)) * hoveredPoint.distance} y2="250" stroke="#6b7280" strokeWidth="1" strokeDasharray="4" />
              <circle cx={70 + (680 / (trackPoints[trackPoints.length - 1].distance || 1)) * hoveredPoint.distance} cy={50 + (200 / (yTicks.length - 1 || 1)) * ((hoveredPoint.elevation - (yTicks[0] || 0)) / ((yTicks[1] || 10) - (yTicks[0] || 0)))} r="5" fill="#f59e0b" />
              <rect x="580" y="20" width="180" height="50" rx="4" fill="#1f2937" stroke="#374151" />
              <text x="595" y="40" className="text-xs fill-gray-400">Distance</text>
              <text x="595" y="58" className="text-sm fill-white font-semibold">{formatDistance(hoveredPoint.distance)}</text>
              <text x="595" y="80" className="text-xs fill-gray-400">Elevation</text>
              <text x="595" y="98" className="text-sm fill-white font-semibold">{formatElevation(hoveredPoint.elevation)}</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
