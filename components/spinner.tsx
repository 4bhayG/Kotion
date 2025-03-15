import { cva, VariantProps } from "class-variance-authority";
import React from "react";

// Define spinner variants using cva
const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Define SpinnerProps type correctly
type SpinnerProps = VariantProps<typeof spinnerVariants> & {
  className?: string;
};

// Spinner Component
const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  return <div className={`${spinnerVariants({ size })} ${className ?? ""}`} />;
};

export default Spinner;
