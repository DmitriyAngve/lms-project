"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva("h-full w-full flex-1 bg-primary transition-all", {
  variants: {
    variant: { default: "bg-sky-600", success: "bg-emerald-700" },
  },
  defaultVariants: {
    variant: "default",
  },
});

// код, определяет сразу два интерфейса.
// "export interface ProgressProps" расширяет другие типы и интерфейсы, чтобы редоставить свойства для компонента "Progress"
// "React.HTMLAttributes<HTMLDivElement>" - Это фрагмент интерфейса "ProgressProps" включает св-ва, которые могут исполь-ся для настройки HTML-элемента "div". Эти св-ва всключают в себя "className" и др.
// "VariantProps<typeof progressVariants>" - это фрагмент предполагает наличие сво-в, связанных с "variants" компонента "Progress"
// В целом "CombinedProgressProps" объединяет все свойства, необходимые для корректного исполь-я компонента "Progress", включая атрибуты HTML-элемента div, сво-ва связанные с вариантами стилей и другие св-ва, определенные в "ProgressPrimitive.Root". Все это позволяет передавать все необходимые св-ва в компонент "Progress"
export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {}
// "ProgressPrimitive.Root" - это корневой элемент компонента "Progress" и его св-ва пропсы могут включать в себя атрибуты "div".
type CombinedProgressProps = ProgressProps &
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>;

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CombinedProgressProps
>(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
