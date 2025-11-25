import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  targetDate: string;
}

interface SavingsGoalsListProps {
  goals: SavingsGoal[];
}

export function SavingsGoalsList({ goals }: SavingsGoalsListProps) {
  if (goals.length === 0) return null;

  return (
    <Card className="lg:col-span-2 border border-border/50">
      <CardHeader>
        <CardTitle>Savings Goals Progress</CardTitle>
        <CardDescription>Track your savings targets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100;
            const isComplete = progress >= 100;
            return (
              <div key={goal.id} className="space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">{goal.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-foreground">{Math.round(progress)}%</p>
                    <p className="text-xs text-muted-foreground">
                      ${parseFloat(goal.currentAmount).toLocaleString()} of ${parseFloat(goal.targetAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isComplete 
                        ? "bg-emerald-500 dark:bg-emerald-400" 
                        : progress >= 75 
                          ? "bg-blue-500 dark:bg-blue-400"
                          : "bg-purple-500 dark:bg-purple-400"
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
