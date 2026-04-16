import React from "react";

type ButtonVariant = "primary" | "outline" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
};

export default function Button({
  children,
  variant = "primary",
  disabled = false,
  onClick,
  icon,
  className = "",
  ...props // 🔥 IMPORTANT
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200";

  const styles = {
    primary: `
      bg-accent text-white
      hover:opacity-90
      active:scale-[0.97]
    `,
    outline: `
      bg-transparent text-primary
      border border-primary/30
      hover:bg-primary/5
      active:scale-[0.97]
    `,
    ghost: `
      bg-transparent text-primary
      hover:bg-primary/10
    `,
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      {...props} // 🔥 THIS FIXES EVERYTHING
      disabled={disabled} // 🔥 real HTML disable
      onClick={onClick}
      className={`
        ${base}
        ${styles[variant]}
        ${disabled ? disabledStyles : ""}
        ${className}
      `}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
}