import React from "react";

// 1. Add the 'variant' property to the props interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline"; // Can be 'default' or 'outline'
}

export const Button = ({
  children,
  className,
  variant = "default", // Set 'default' as the default variant
  ...props
}: ButtonProps) => {
  // Base classes that apply to all variants
  const baseClasses =
    "w-full px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";

  // Classes that change based on the variant
  const variantClasses = {
    default: "text-white bg-blue-600 hover:bg-blue-700",
    outline:
      "text-blue-700 bg-transparent border border-blue-600 hover:bg-blue-50",
  };

  return (
    // 2. Combine the base, variant, and any additional classes
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
