import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        className="
          relative
          w-full max-w-md
          rounded-2xl
          bg-background
          border border-primary/10
          shadow-[0_10px_40px_rgba(76,58,81,0.15)]
          p-6
          z-10
        "
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-primary text-lg font-medium">
              {title}
            </h2>

            <button
              onClick={onClose}
              className="text-secondary hover:text-primary transition"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="text-sm text-text">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}