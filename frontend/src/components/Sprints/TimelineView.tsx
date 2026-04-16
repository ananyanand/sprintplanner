import Card from "../ui/Card";

type Task = {
  id: number;
  title: string;
  start: string;
  end: string;
  status: string;
};

type Props = {
  tasks: Task[];
  startDate: string;
  endDate: string;
};

const statusColors: Record<string, string> = {
  todo: "bg-gradient-to-r from-gray-400 to-gray-600",
  planning: "bg-gradient-to-r from-sky-400 to-blue-600",
  inprogress: "bg-gradient-to-r from-amber-400 to-orange-500",
  review: "bg-gradient-to-r from-violet-400 to-purple-600",
  done: "bg-gradient-to-r from-emerald-400 to-green-600",
};

export default function TimelineView({ tasks, startDate, endDate }: Props) {

  // ✅ FIX 1: Normalize sprint dates
  const normalize = (dateStr: string | undefined) => {
    if (!dateStr) return new Date();

    // ✅ Handle both YYYY-MM-DD and ISO formats
    let d: Date;
    if (dateStr.length === 10) {
      // YYYY-MM-DD format - avoid timezone issues
      const [year, month, day] = dateStr.split('-').map(Number);
      d = new Date(year, month - 1, day);
    } else {
      // ISO format
      d = new Date(dateStr);
    }

    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const start = normalize(startDate);
  const end = normalize(endDate);

  // 🔥 Generate days
  const days: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  // ✅ FIX 2: Correct position calculation
  const getPosition = (task: Task) => {
    const taskStart = normalize(task.start);
    const taskEnd = task.end ? normalize(task.end) : taskStart;

    const totalDays = Math.max(days.length, 1);

    const startOffset =
      (taskStart.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24);

    const duration =
      (taskEnd.getTime() - taskStart.getTime()) /
        (1000 * 60 * 60 * 24) +
      1;

    // ✅ Clamp values to prevent tasks from going off-screen
    const left = Math.max(0, Math.min(100, (startOffset / totalDays) * 100));
    const width = Math.max(1, Math.min(100 - left, (duration / totalDays) * 100));

    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  return (
    <Card className="overflow-hidden p-0 rounded-2xl border border-primary/10 shadow-sm">
      <div className="overflow-x-auto">

        {/* 🔥 HEADER */}
        <div className="flex min-w-[900px] border-b border-primary/10 bg-slate-50">
          <div className="w-56 shrink-0 px-4 py-3 text-xs font-semibold text-secondary">
            Tasks
          </div>

          <div className="flex flex-1">
            {days.map((d, i) => {
              const isToday =
                new Date().toDateString() === d.toDateString();

              return (
                <div
                  key={i}
                  className={`flex-1 text-center text-[11px] font-medium py-3 border-l
                    ${isToday ? "bg-accent/10 text-accent font-bold" : "text-secondary"}
                  `}
                >
                  {d.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔥 ROWS */}
        <div className="min-w-[900px]">
          {tasks.map((task) => {
            const pos = getPosition(task);

            return (
              <div
                key={task.id}
                className="flex items-center border-b border-primary/10 h-16 relative hover:bg-primary/5 transition"
              >
                {/* TASK NAME */}
                <div className="w-56 shrink-0 px-4">
                  <p className="text-sm font-semibold text-primary truncate">
                    {task.title}
                  </p>
                  <p className="text-[10px] text-secondary uppercase">
                    {task.status}
                  </p>
                </div>

                {/* TIMELINE */}
                <div className="flex-1 relative h-full">

                  {/* GRID */}
                  <div className="absolute inset-0 flex">
                    {days.map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-l border-primary/5"
                      />
                    ))}
                  </div>

                  {/* ✅ TASK BAR (FULL WIDTH FIXED) */}
                  <div
                    className={`
                      absolute top-1/2 -translate-y-1/2 h-8 rounded-full px-4 flex items-center text-xs font-semibold text-white shadow-md
                      ${statusColors[task.status]}
                    `}
                    style={{
                      left: `calc(${pos.left} + 2px)`,
                      width: `calc(${pos.width} - 4px)`
                    }}
                  >
                    <span className="truncate">
                      {task.title}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </Card>
  );
}