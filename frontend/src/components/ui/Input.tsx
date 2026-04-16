import React from "react";

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: string;
  className?: string;
};

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled,
  icon,
  type = "text",
  className = "",
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>

      {/* Label */}
      {label && (
        <label className="text-sm text-secondary">
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div
        className={`
          flex items-center gap-2
          px-4 py-2.5
          rounded-xl
          border
          transition-all duration-200
          bg-background
          
          ${error 
            ? "border-accent/50" 
            : "border-primary/20 hover:border-primary/30"}

          ${disabled ? "opacity-50 cursor-not-allowed" : "focus-within:border-primary"}
        `}
      >
        {/* Icon */}
        {icon && <span className="text-secondary">{icon}</span>}

        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="
            w-full
            bg-transparent
            outline-none
            text-sm
            text-text
            placeholder:text-secondary/60
          "
        />
      </div>

      {/* Error */}
      {error && (
        <span className="text-xs text-accent mt-1">
          {error}
        </span>
      )}
    </div>
  );
}