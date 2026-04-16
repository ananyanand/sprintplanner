import React, { useState } from "react";


type AlertProps = {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  description?: string;
  closable?: boolean;
  children?: React.ReactNode; // ✅ ADD THIS
};

export default function Alert({
  type = "info",
  title,
  description,
  closable = false,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const styles = {
    info: {
      bg: "bg-primary/5",
      border: "border-primary/20",
      accent: "bg-primary",
      text: "text-primary",
    },
    success: {
      bg: "bg-accent/5",
      border: "border-accent/20",
      accent: "bg-accent",
      text: "text-accent",
    },
    warning: {
      bg: "bg-secondary/5",
      border: "border-secondary/20",
      accent: "bg-secondary",
      text: "text-secondary",
    },
    error: {
      bg: "bg-primary/10",
      border: "border-primary/30",
      accent: "bg-primary",
      text: "text-primary",
    },
  };

  const s = styles[type];

  return (
    <div
      className={`
        relative
        flex gap-3
        p-4
        rounded-xl
        border
        ${s.bg} ${s.border}
      `}
    >
      {/* Accent bar */}
      <div className={`w-1.5 rounded-full ${s.accent}`} />

      {/* Content */}
      <div className="flex-1">
        {title && (
          <p className={`text-sm font-medium ${s.text}`}>
            {title}
          </p>
        )}

        {description && (
          <p className="text-sm text-secondary mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Close */}
      {closable && (
        <button
          onClick={() => setVisible(false)}
          className="text-secondary hover:text-primary transition"
        >
          ✕
        </button>
      )}
    </div>
  );
}