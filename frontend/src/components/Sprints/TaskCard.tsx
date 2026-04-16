import { useState, useEffect, useRef } from "react";
import { Trash2, ArrowRightLeft, Eye, Edit2 } from "lucide-react";

type TaskCardProps = {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  storyPoints: number;
  assignee: string[];
  onDelete: (id: number) => void;
  onMove: (id: number, status: string) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  columns?: string[];
};

const priorityColors: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Low: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" },
  Medium: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-400",
  },
  High: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-400" },
};

export default function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  storyPoints,
  assignee,
  onDelete,
  onMove,
  onView,
  onEdit,
  columns = ["todo", "planning", "inprogress", "review", "done"],
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const priorityColor = priorityColors[priority] || priorityColors.Medium;

  const initials = assignee[0]
    ? assignee[0]
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  // ✅ CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMoveMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="bg-white border border-primary/10 rounded-lg p-4 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 relative overflow-visible group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-primary line-clamp-2 mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-secondary line-clamp-1">
              {description}
            </p>
          )}
        </div>

        {/* View & Edit */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onView(id)}
            className="p-2 hover:bg-blue-50 rounded-md text-blue-600"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={() => onEdit(id)}
            className="p-2 hover:bg-amber-50 rounded-md text-amber-600"
          >
            <Edit2 size={16} />
          </button>
        </div>
      </div>

      {/* Assignee */}
      {assignee[0] && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
            {initials}
          </div>
          <div>
            <p className="text-xs font-medium text-primary">{assignee[0]}</p>
            <p className="text-xs text-secondary">Assigned</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex gap-2 justify-between items-center pt-3 border-t border-primary/10">
        {/* Priority */}
        <div className="flex gap-2">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded ${priorityColor.bg} ${priorityColor.text}`}
          >
            {priority[0]}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-secondary/10 text-primary">
            {storyPoints}⭐
          </span>
        </div>

        {/* Actions */}
        {isHovered && (
          <div className="flex gap-1">
            {/* ✅ MOVE FIXED */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoveMenu((prev) => !prev);
                }}
                className="p-1.5 hover:bg-primary/10 rounded-md text-primary"
              >
                <ArrowRightLeft size={14} />
              </button>

              {showMoveMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-32 bg-white border border-primary/10 rounded-lg shadow-lg z-[999]">
                  {columns
                    .filter((col) => col !== status) // 🔥 hide current
                    .map((col) => (
                      <button
                        key={col}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMove(id, col);
                          setShowMoveMenu(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-xs font-medium capitalize hover:bg-primary/5 text-secondary"
                      >
                        {col}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* DELETE */}
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 hover:bg-red-50 rounded-md text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}