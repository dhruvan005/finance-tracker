"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

// Hardcoded expense categories for budgeting
const EXPENSE_CATEGORIES = [
  { id: "food", name: "Food & Dining" },
  { id: "transportation", name: "Transportation" },
  { id: "utilities", name: "Utilities" },
  { id: "entertainment", name: "Entertainment" },
  { id: "healthcare", name: "Healthcare" },
  { id: "shopping", name: "Shopping" },
  { id: "housing", name: "Housing" },
  { id: "education", name: "Education" },
  { id: "personal", name: "Personal Care" },
  { id: "other", name: "Other" },
];

interface Budget {
  id: string;
  categoryId: string;
  amount: string;
  period: string;
  startDate: string;
  endDate: string;
  category?: {
    name: string;
  };
}

export default function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categoryId, setCategoryId] = useState(EXPENSE_CATEGORIES[0].id);
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/budget?detailed=true");

      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      } else {
        toast.error("Failed to load budgets");
      }
    } catch (error) {
      toast.error("Error loading budgets");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = EXPENSE_CATEGORIES.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId || !amount || !startDate || !endDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        categoryId,
        amount: parseFloat(amount),
        period,
        startDate: startDate ? startDate.toISOString() : new Date().toISOString(),
        endDate: endDate ? endDate.toISOString() : new Date().toISOString(),
      };

      const url = "/api/budget";
      const method = isEditing ? "PATCH" : "POST";
      const finalUrl = isEditing ? `${url}?id=${selectedBudget?.id}` : url;

      const response = await fetch(finalUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          isEditing
            ? "Budget updated successfully"
            : "Budget added successfully",
        );
        resetForm();
        fetchBudgets();
      } else {
        toast.error(
          isEditing ? "Failed to update budget" : "Failed to add budget",
        );
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setCategoryId(budget.categoryId);
    setAmount(budget.amount);
    setPeriod(budget.period);
    setStartDate(new Date(budget.startDate));
    setEndDate(new Date(budget.endDate));
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        const response = await fetch(`/api/budget?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Budget deleted successfully");
          fetchBudgets();
        } else {
          toast.error("Failed to delete budget");
        }
      } catch (error) {
        toast.error("An error occurred");
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setCategoryId(EXPENSE_CATEGORIES[0].id);
    setAmount("");
    setPeriod("monthly");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedBudget(null);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Update Budget" : "Create New Budget"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="period">Period</Label>
                <Select
                  value={period}
                  onValueChange={setPeriod}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <DatePicker
                  date={startDate}
                  onSelect={setStartDate}
                  placeholder="Select start date"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker
                  date={endDate}
                  onSelect={setEndDate}
                  placeholder="Select end date"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {isEditing && (
              <Button variant="outline" onClick={resetForm} type="button">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Processing..."
                : isEditing
                  ? "Update Budget"
                  : "Create Budget"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">Loading budgets...</p>
          ) : budgets.length === 0 ? (
            <p className="text-center py-4">No budgets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Category</th>
                    <th className="text-left py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">Period</th>
                    <th className="text-left py-2 px-2">Start Date</th>
                    <th className="text-left py-2 px-2">End Date</th>
                    <th className="text-right py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((budget) => (
                    <tr key={budget.id} className="border-b">
                      <td className="py-2 px-2">
                        {budget.category?.name || getCategoryName(budget.categoryId)}
                      </td>
                      <td className="py-2 px-2">
                        {formatCurrency(budget.amount)}
                      </td>
                      <td className="py-2 px-2 capitalize">{budget.period}</td>
                      <td className="py-2 px-2">
                        {formatDate(budget.startDate)}
                      </td>
                      <td className="py-2 px-2">
                        {formatDate(budget.endDate)}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(budget)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDelete(budget.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
