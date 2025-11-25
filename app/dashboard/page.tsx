"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { MonthlyTrendChart } from "@/components/Dashboard/MonthlyTrendChart";
import { ExpenseBreakdownChart } from "@/components/Dashboard/ExpenseBreakdownChart";
import { BudgetComparisonChart } from "@/components/Dashboard/BudgetComparisonChart";
import { IncomeSourcesChart } from "@/components/Dashboard/IncomeSourcesChart";
import { SavingsGoalsList } from "@/components/Dashboard/SavingsGoalsList";
import { DashboardEmptyState } from "@/components/Dashboard/DashboardEmptyState";

interface Expense {
  id: string;
  amount: string;
  categoryId: string;
  date: string;
}

interface Income {
  id: string;
  amount: string;
  categoryId: string;
  date: string;
}

interface Budget {
  id: string;
  categoryId: string;
  amount: string;
  spent: string;
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  targetDate: string;
}

const EXPENSE_CATEGORIES = [
  { id: "food", name: "Food & Dining" },
  { id: "transportation", name: "Transportation" },
  { id: "utilities", name: "Utilities" },
  { id: "entertainment", name: "Entertainment" },
  { id: "healthcare", name: "Healthcare" },
  { id: "shopping", name: "Shopping" },
  { id: "education", name: "Education" },
  { id: "housing", name: "Housing" },
  { id: "insurance", name: "Insurance" },
  { id: "other", name: "Other" },
];

const INCOME_CATEGORIES = [
  { id: "salary", name: "Salary" },
  { id: "freelance", name: "Freelance" },
  { id: "investment", name: "Investment" },
  { id: "business", name: "Business" },
  { id: "other", name: "Other" },
];

export default function Page() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [expensesRes, incomesRes, budgetsRes, goalsRes] = await Promise.all([
        fetch("/api/expense"),
        fetch("/api/income"),
        fetch("/api/budget"),
        fetch("/api/savings-goal"),
      ]);

      if (expensesRes.ok) setExpenses(await expensesRes.json());
      if (incomesRes.ok) setIncomes(await incomesRes.json());
      if (budgetsRes.ok) setBudgets(await budgetsRes.json());
      if (goalsRes.ok) setSavingsGoals(await goalsRes.json());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  const netBalance = totalIncome - totalExpenses;
  const totalSavingsGoal = savingsGoals.reduce((sum, goal) => sum + parseFloat(goal.targetAmount), 0);
  const totalSavingsCurrent = savingsGoals.reduce((sum, goal) => sum + parseFloat(goal.currentAmount), 0);
  const savingsProgress = totalSavingsGoal > 0 ? Math.round((totalSavingsCurrent / totalSavingsGoal) * 100) : 0;

  // Expense by category for pie chart
  const expenseByCategory = EXPENSE_CATEGORIES.map((cat) => {
    const total = expenses
      .filter((exp) => exp.categoryId === cat.id)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    return { name: cat.name, value: total };
  }).filter((item) => item.value > 0);

  // Income by category for pie chart
  const incomeByCategory = INCOME_CATEGORIES.map((cat) => {
    const total = incomes
      .filter((inc) => inc.categoryId === cat.id)
      .reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
    return { name: cat.name, value: total };
  }).filter((item) => item.value > 0);

  // Monthly trend (last 6 months)
  const getMonthlyTrend = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString("default", { month: "short" });
      
      const monthExpenses = expenses
        .filter((exp) => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === date.getMonth() && expDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      
      const monthIncome = incomes
        .filter((inc) => {
          const incDate = new Date(inc.date);
          return incDate.getMonth() === date.getMonth() && incDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
      
      months.push({
        month: monthName,
        expenses: monthExpenses,
        income: monthIncome,
      });
    }
    return months;
  };

  const monthlyTrend = getMonthlyTrend();

  // Budget vs Spent
  const budgetComparison = budgets.map((budget) => {
    const category = EXPENSE_CATEGORIES.find((cat) => cat.id === budget.categoryId);
    return {
      category: category?.name || "Unknown",
      budget: parseFloat(budget.amount),
      spent: parseFloat(budget.spent),
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 md:p-8 max-w-7xl">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-base">Loading your financial overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 md:p-8 max-w-7xl">
        <DashboardHeader />

        <DashboardStats
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netBalance={netBalance}
          savingsProgress={savingsProgress}
          totalSavingsCurrent={totalSavingsCurrent}
          totalSavingsGoal={totalSavingsGoal}
        />

        {/* Bento Grid Layout */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MonthlyTrendChart data={monthlyTrend} />
          <ExpenseBreakdownChart data={expenseByCategory} />
          
          <SavingsGoalsList goals={savingsGoals} />
          <IncomeSourcesChart data={incomeByCategory} />
          
          <BudgetComparisonChart data={budgetComparison} />
        </div>

        {expenses.length === 0 && incomes.length === 0 && (
          <DashboardEmptyState />
        )}
      </div>
    </div>
  );
}
