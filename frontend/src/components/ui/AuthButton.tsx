import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "w-full p-2 rounded disabled:opacity-50 transition-colors duration-200",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
}

const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, variant, isLoading, loadingText = 'Loading...', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="submit"
        disabled={isLoading}
        className={buttonVariants({ variant, className })}
        {...props}
      >
        {isLoading ? loadingText : children}
      </button>
    );
  }
);

AuthButton.displayName = 'AuthButton';

export { AuthButton, buttonVariants };
export type { AuthButtonProps };
