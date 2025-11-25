import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";

interface DashboardStatsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsProgress: number;
  totalSavingsCurrent: number;
  totalSavingsGoal: number;
}

export function DashboardStats({
  totalIncome,
  totalExpenses,
  netBalance,
  savingsProgress,
  totalSavingsCurrent,
  totalSavingsGoal,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="border border-border/50 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Total Income
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">All time total</p>
        </CardContent>
      </Card>

      <Card className="border border-border/50 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Total Expenses
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center">
            <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            ${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">All time total</p>
        </CardContent>
      </Card>

      <Card className="border border-border/50 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Net Balance
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netBalance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}`}>
            ${Math.abs(netBalance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Income - Expenses</p>
        </CardContent>
      </Card>

      <Card className="border border-border/50 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Savings Progress
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {savingsProgress}%
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            ${totalSavingsCurrent.toLocaleString()} of ${totalSavingsGoal.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
