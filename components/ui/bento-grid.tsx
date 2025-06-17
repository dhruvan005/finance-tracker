import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BentoGridProps = {
  className?: string;
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6;
};

type BentoCardProps = {
  className?: string;
  children: ReactNode;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2 | 3;
};

export function BentoGrid({ className, children, cols = 2 }: BentoGridProps) {
  const getColsClass = () => {
    switch (cols) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      case 6:
        return "grid-cols-1 md:grid-cols-3 lg:grid-cols-6";
      default:
        return "grid-cols-1 md:grid-cols-2";
    }
  };

  return (
    <div className={cn("grid", getColsClass(), className)}>{children}</div>
  );
}

export function BentoCard({
  className,
  children,
  colSpan = 1,
  rowSpan = 1,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden  bg-slate-800/50 border border-vintageOffWhiteSecondary/30",
        colSpan === 2 && "md:col-span-2",
        colSpan === 3 && "md:col-span-3",
        rowSpan === 2 && "md:row-span-2",
        rowSpan === 3 && "md:row-span-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BentoCardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("px-6 pt-6", className)}>{children}</div>;
}

export function BentoCardIcon({
  icon: Icon,
  className,
  color = "from-blue-400 to-blue-500",
}: {
  icon: React.ElementType;
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={cn(
        `w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`,
        className,
      )}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
  );
}

export function BentoCardBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}

export function BentoCardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3 className={cn("text-xl font-semibold text-white mb-2", className)}>
      {children}
    </h3>
  );
}

export function BentoCardStats({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("text-sm text-green-400 font-medium mb-3", className)}>
      {children}
    </div>
  );
}

export function BentoCardDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cn("text-slate-300 leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function BentoCardFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mt-6 pt-6 border-t border-slate-700/50", className)}>
      {children}
    </div>
  );
}
