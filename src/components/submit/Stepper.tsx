import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepDef {
  id: number;
  label: string;
}

interface StepperProps {
  steps: StepDef[];
  current: number;
  maxReached: number;
  onJump: (step: number) => void;
}

export function Stepper({ steps, current, maxReached, onJump }: StepperProps) {
  const currentStep = steps.find((s) => s.id === current);
  return (
    <div className="w-full">
      {/* Desktop */}
      <ol className="hidden md:flex items-center justify-between gap-2">
        {steps.map((step, idx) => {
          const completed = step.id < current;
          const active = step.id === current;
          const reachable = step.id <= maxReached;
          return (
            <li key={step.id} className="flex-1 flex items-center">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(step.id)}
                className={cn(
                  "flex items-center gap-2 text-left",
                  reachable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    completed && "bg-primary text-primary-foreground border-primary",
                    active && "border-primary text-primary",
                    !completed && !active && "border-border text-muted-foreground"
                  )}
                >
                  {completed ? <Check className="h-4 w-4" /> : step.id}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <span
                  className={cn(
                    "mx-3 h-px flex-1",
                    step.id < current ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Step {current} of {steps.length}
          </span>
          <span className="text-muted-foreground">{currentStep?.label}</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(current / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}