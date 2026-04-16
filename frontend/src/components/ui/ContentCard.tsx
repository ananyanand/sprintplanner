import React from "react";

type ContentCardProps = {
  image?: string;
  title: string;
  description?: string;
  meta?: string;
  action?: React.ReactNode;
};

export default function ContentCard({
  image,
  title,
  description,
  meta,
  action,
}: ContentCardProps) {
  return (
    <div
      className="
        bg-background
        border border-primary/10
        rounded-2xl
        overflow-hidden
        shadow-[0_2px_10px_rgba(76,58,81,0.04)]
        transition hover:shadow-[0_4px_20px_rgba(76,58,81,0.08)]
      "
    >
      {/* Image */}
      {image && (
        <div className="h-40 w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col gap-2">
        
        {/* Title */}
        <h3 className="text-primary font-semibold text-base">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-secondary line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta */}
        {meta && (
          <span className="text-xs text-secondary/70">
            {meta}
          </span>
        )}

        {/* Actions */}
        {action && (
          <div className="mt-3">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}