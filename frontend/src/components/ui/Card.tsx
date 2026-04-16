import React from "react";

type PanelCardProps = {
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function PanelCard({
  title,
  subtitle,
  rightAction,
  children,
  className = "",
}: PanelCardProps) {
  return (
    <div
      className={`
        bg-background
        border border-primary/10
        rounded-2xl
        shadow-[0_2px_10px_rgba(76,58,81,0.04)]
        ${className}
      `}
    >
      {/* Header */}
      {(title || rightAction) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary/10">
          
          <div>
            {title && (
              <h3 className="text-primary font-medium text-sm">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="text-xs text-secondary mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {rightAction && <div>{rightAction}</div>}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}