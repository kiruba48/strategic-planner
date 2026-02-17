/**
 * TaskRadarChart — Recharts-based radar chart for 5-dimension scores.
 *
 * Accepts scores object { IC, AA, OV, RS, RV } (each 1-3),
 * lane accent color, and optional size.
 *
 * Critical: parent div must have explicit width/height for
 * ResponsiveContainer to measure correctly.
 */

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'

const DIMENSION_LABELS = ['IC', 'AA', 'OV', 'RS', 'RV']

export default function TaskRadarChart({ scores = {}, accentColor = '#6366f1', size = 120 }) {
  const data = DIMENSION_LABELS.map((key) => ({
    subject: key,
    value: scores[key] ?? 1,
    fullMark: 3,
  }))

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <PolarGrid
            gridType="polygon"
            stroke="#374151"
            strokeWidth={0.75}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: '#9ca3af',
              fontSize: 8,
              fontFamily: 'ui-monospace, monospace',
            }}
          />
          <Radar
            dataKey="value"
            fill={accentColor}
            fillOpacity={0.3}
            stroke={accentColor}
            strokeWidth={1.5}
            dot={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
