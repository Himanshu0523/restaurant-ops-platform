"use client";

const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600",
    secondary: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    info: "bg-blue-500 text-white hover:bg-blue-600",
    light: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    dark: "bg-gray-800 text-white hover:bg-gray-900",
};

const sizes = {
    sm: "px-2 py-1 text-xs",
    small: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    medium: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
    large: "px-4 py-2 text-base",
};

export function Button({
    variant = "primary",
    size = "md",
    className = "",
    ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50 disabled:pointer-events-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    />
  );
}