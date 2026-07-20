import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PricePoint } from "../types";

function fmtTime(t: number) {
  return new Date(t).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function fmtPrice(p: number) {
  return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const point: PricePoint = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <div className="t-price">${fmtPrice(point.price)}</div>
      <div className="t-time">{fmtTime(point.time)}</div>
    </div>
  );
}

export function PriceChart({ data }: { data: PricePoint[] }) {
  if (data.length < 2) {
    return <div className="chart-empty">Collecting live ticks…</div>;
  }

  const up = data[data.length - 1].price >= data[0].price;
  const color = up ? "var(--good-fill)" : "var(--critical)";
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pad = (max - min) * 0.1 || max * 0.001 || 1;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.1} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--gridline)" strokeDasharray="0" />
        <XAxis
          dataKey="time"
          tickFormatter={fmtTime}
          stroke="var(--baseline)"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          minTickGap={40}
          axisLine={{ stroke: "var(--baseline)" }}
          tickLine={false}
        />
        <YAxis
          domain={[min - pad, max + pad]}
          tickFormatter={(v: number) => v.toFixed(2)}
          stroke="var(--baseline)"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={64}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--baseline)", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill="url(#priceFill)"
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: "var(--surface-1)", strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
