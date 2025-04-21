import * as React from "react";
import { cn } from "@/lib/utils"; // Import utility function for conditional classnames (optional)

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-3 py-2 text-sm text-muted-foreground border rounded-md shadow-sm focus:ring-2 focus:ring-accent focus:ring-opacity-50",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
