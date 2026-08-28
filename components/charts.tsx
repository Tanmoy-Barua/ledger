import { formatMoney } from "@/lib/money";

const INCOME = "#047857";
const EXPENSE = "#be123c";

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg bg-muted/40 px-4 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function DailyChart({
  data,
}: {
  data: Array<{ day: number; income: number; expense: number }>;
}) {
  const max = Math.max(1, ...data.flatMap((row) => [row.income, row.expense]));
  const hasValues = data.some((row) => row.income || row.expense);
  if (!hasValues) {
    return <EmptyChart message="No daily activity in this month yet." />;
  }

  const width = 720;
  const height = 240;
  const left = 48;
  const bottom = 28;
  const top = 12;
  const plotW = width - left - 12;
  const plotH = height - top - bottom;
  const group = plotW / data.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full" role="img" aria-label="Daily earnings and expenses">
      {[0, 0.5, 1].map((tick) => {
        const y = top + plotH - tick * plotH;
        return (
          <g key={tick}>
            <line x1={left} x2={width - 12} y1={y} y2={y} stroke="#e5e5e5" />
            <text x={left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#737373">
              {compact(max * tick)}
            </text>
          </g>
        );
      })}
      {data.map((row, index) => {
        const x = left + index * group;
        const incomeH = (row.income / max) * plotH;
        const expenseH = (row.expense / max) * plotH;
        const barW = Math.max(2, group * 0.35);
        return (
          <g key={row.day}>
            <rect
              x={x + group * 0.12}
              y={top + plotH - incomeH}
              width={barW}
              height={incomeH}
              fill={INCOME}
              rx="2"
            >
              <title>{`Day ${row.day} earned ${formatMoney(row.income)}`}</title>
            </rect>
            <rect
              x={x + group * 0.52}
              y={top + plotH - expenseH}
              width={barW}
              height={expenseH}
              fill={EXPENSE}
              rx="2"
            >
              <title>{`Day ${row.day} spent ${formatMoney(row.expense)}`}</title>
            </rect>
            {row.day === 1 || row.day % 5 === 0 || row.day === data.length ? (
              <text x={x + group / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="#737373">
                {row.day}
              </text>
            ) : null}
          </g>
        );
      })}
      <LegendDot x={left} y={height - 2} color={INCOME} label="Earned" />
      <LegendDot x={left + 70} y={height - 2} color={EXPENSE} label="Spent" />
    </svg>
  );
}

export function CategoryChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  if (!data.length) {
    return <EmptyChart message="Add expenses to see a category split." />;
  }

  const total = data.reduce((sum, row) => sum + row.value, 0);
  const colors = [
    "#be123c",
    "#c2410c",
    "#a16207",
    "#047857",
    "#0369a1",
    "#6d28d9",
    "#0f766e",
    "#9f1239",
  ];
  const cx = 90;
  const cy = 110;
  const r = 72;
  const slices = data.reduce<
    Array<{ name: string; value: number; start: number; end: number; color: string }>
  >((acc, row, index) => {
    const start = acc.length ? acc[acc.length - 1].end : -Math.PI / 2;
    const end = start + (row.value / total) * Math.PI * 2;
    return [
      ...acc,
      {
        ...row,
        start,
        end,
        color: colors[index % colors.length],
      },
    ];
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-center">
      <svg viewBox="0 0 180 220" className="mx-auto h-56 w-44" role="img" aria-label="Expense categories">
        {slices.map((slice) => (
          <path key={slice.name} d={arcPath(cx, cy, r, slice.start, slice.end)} fill={slice.color}>
            <title>{`${slice.name}: ${formatMoney(slice.value)}`}</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={40} fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="#737373">
          Spent
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="#171717">
          {compact(total)}
        </text>
      </svg>
      <ul className="grid gap-2 text-sm">
        {data.map((row, index) => (
          <li key={row.name} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ background: colors[index % colors.length] }}
              />
              {row.name}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {formatMoney(row.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrendChart({
  data,
}: {
  data: Array<{ label: string; income: number; expense: number }>;
}) {
  const max = Math.max(1, ...data.flatMap((row) => [row.income, row.expense]));
  const width = 720;
  const height = 240;
  const left = 48;
  const bottom = 36;
  const top = 12;
  const plotW = width - left - 12;
  const plotH = height - top - bottom;
  const step = data.length > 1 ? plotW / (data.length - 1) : plotW;

  const incomePoints = data
    .map((row, index) => {
      const x = left + index * step;
      const y = top + plotH - (row.income / max) * plotH;
      return `${x},${y}`;
    })
    .join(" ");
  const expensePoints = data
    .map((row, index) => {
      const x = left + index * step;
      const y = top + plotH - (row.expense / max) * plotH;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full" role="img" aria-label="Six-month earnings and expenses">
      {[0, 0.5, 1].map((tick) => {
        const y = top + plotH - tick * plotH;
        return (
          <g key={tick}>
            <line x1={left} x2={width - 12} y1={y} y2={y} stroke="#e5e5e5" />
            <text x={left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#737373">
              {compact(max * tick)}
            </text>
          </g>
        );
      })}
      <polyline fill="none" stroke={INCOME} strokeWidth="2.5" points={incomePoints} />
      <polyline fill="none" stroke={EXPENSE} strokeWidth="2.5" points={expensePoints} />
      {data.map((row, index) => {
        const x = left + index * step;
        const yi = top + plotH - (row.income / max) * plotH;
        const ye = top + plotH - (row.expense / max) * plotH;
        return (
          <g key={row.label}>
            <circle cx={x} cy={yi} r="3.5" fill={INCOME}>
              <title>{`${row.label} earned ${formatMoney(row.income)}`}</title>
            </circle>
            <circle cx={x} cy={ye} r="3.5" fill={EXPENSE}>
              <title>{`${row.label} spent ${formatMoney(row.expense)}`}</title>
            </circle>
            <text x={x} y={height - 12} textAnchor="middle" fontSize="11" fill="#737373">
              {row.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function compact(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const a = polar(cx, cy, r, start);
  const b = polar(cx, cy, r, end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y} Z`;
}

function LegendDot({
  x,
  y,
  color,
  label,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
}) {
  return (
    <g>
      <rect x={x} y={y - 18} width="8" height="8" rx="1" fill={color} />
      <text x={x + 12} y={y - 11} fontSize="10" fill="#525252">
        {label}
      </text>
    </g>
  );
}
