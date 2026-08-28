import { useState } from "react";
import {
  Area,
  AreaChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MouseHandlerDataParam } from "recharts";
import type { PricePoint, Quote } from "../types";

function PulseDot({ cx, cy, color }: { cx?: number; cy?: number; color: string }) {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill={color} opacity={0.25} className="chart-live-pulse" />
      <circle cx={cx} cy={cy} r={3.5} fill={color} stroke="var(--surface-1)" strokeWidth={1.5} />
    </g>
  );
}

export function PriceChart({
  data,
  quote,
  onScrub,
}: {
  data: PricePoint[];
  quote?: Quote | null;
  onScrub?: (point: PricePoint | null) => void;
}) {
  const [hovering, setHovering] = useState(false);

  if (data.length < 2) {
    return <div className="chart-empty">Collecting live ticks…</div>;
  }

  const up = quote ? quote.change >= 0 : data[data.length - 1].price >= data[0].price;
  const color = up ? "var(--good-fill)" : "var(--critical)";
  const prices = data.map((d) => d.price);
  // Anchor the range to the real intraday high/low (not just whatever ticks
  // we've polled so far) so small live-tick jitter doesn't get exaggerated
  // into a dramatic swing.
  const dayLow = quote ? Math.min(quote.low, quote.prevClose) : Infinity;
  const dayHigh = quote ? Math.max(quote.high, quote.prevClose) : -Infinity;
  const min = Math.min(...prices, dayLow);
  const max = Math.max(...prices, dayHigh);
  const pad = (max - min) * 0.12 || max * 0.001 || 1;
  const firstTime = data[0].time;
  const lastTime = data[data.length - 1].time;
  const last = data[data.length - 1];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 16, right: 0, bottom: 0, left: 0 }}
        onMouseMove={(state: MouseHandlerDataParam) => {
          // activeIndex is a numeric string (Recharts' TooltipIndex type), not a number.
          const idx = state.activeIndex != null ? Number(state.activeIndex) : NaN;
          if (!Number.isNaN(idx) && data[idx]) {
            setHovering(true);
            onScrub?.(data[idx]);
          }
        }}
        onMouseLeave={() => {
          setHovering(false);
          onScrub?.(null);
        }}
      >
        <defs>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis hide dataKey="time" type="number" scale="time" domain={[firstTime, lastTime]} />
        <YAxis hide domain={[min - pad, max + pad]} />
        {quote && (
          <ReferenceLine y={quote.prevClose} stroke="var(--baseline)" strokeDasharray="3 3" strokeWidth={1} />
        )}
        <Tooltip
          content={() => null}
          cursor={{ stroke: "var(--baseline)", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="url(#priceFill)"
          dot={false}
          activeDot={{ r: 5, fill: color, stroke: "var(--surface-1)", strokeWidth: 2 }}
          isAnimationActive={false}
        />
        {!hovering && (
          <ReferenceDot
            x={last.time}
            y={last.price}
            shape={(props: { cx?: number; cy?: number }) => <PulseDot {...props} color={color} />}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
