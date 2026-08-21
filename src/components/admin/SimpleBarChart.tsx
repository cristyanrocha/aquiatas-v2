interface BarChartDatum {
  label: string
  value: number
}

export function SimpleBarChart({ title, data }: { title: string; data: BarChartDatum[] }) {
  const max = Math.max(1, ...data.map((item) => item.value))

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-32 shrink-0 truncate text-xs text-muted-foreground" title={item.label}>
              {item.label}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
