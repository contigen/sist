import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ButtonGold({ className, children, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        "bg-gold text-gold-foreground hover:bg-gold/80 font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
