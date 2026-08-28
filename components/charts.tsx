"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "@/lib/money";

const INCOME = "#047857";
const EXPENSE = "#be123c";

function MoneyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-popover px-3 py-2 text-xs shadow-md ring-1 ring-foreground/10">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((item) => (
        <p key={item.name} style={{ color: item.color }}>
          {item.name}: {formatMoney(item.value)}
        </p>
      ))}
    </div>
  );
}

export function DailyChart({
  data,
}: {
  data: Array<{ day: number; income: number; expense: number }>;
}) {
  const hasValues = data.some((row) => row.income || row.expense);
  if (!hasValues) {
    return <EmptyChart message="No daily activity in this month yet." />;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={11}
            width={64}
            tickFormatter={(value) =>
              new Intl.NumberFormat("en-IN", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(Number(value))
            }
          />
          <Tooltip content={<MoneyTooltip />} />
          <Legend />
          <Bar dataKey="income" name="Earned" fill={INCOME} radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Spent" fill={EXPENSE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
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

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={52}
            outerRadius={88}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<MoneyTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChart({
  data,
}: {
  data: Array<{ label: string; income: number; expense: number }>;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={11}
            width={64}
            tickFormatter={(value) =>
              new Intl.NumberFormat("en-IN", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(Number(value))
            }
          />
          <Tooltip content={<MoneyTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="income" name="Earned" stroke={INCOME} strokeWidth={2} dot />
          <Line type="monotone" dataKey="expense" name="Spent" stroke={EXPENSE} strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg bg-muted/40 px-4 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
