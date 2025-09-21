"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  type: string;
}

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
  // const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBudgets();
    // fetchCategories();
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

  // const fetchCategories = async () => {
  //   try {
  //     setIsLoadingCategories(true);
  //     const response = await fetch("/api/category");

  //     if (response.ok) {
  //       const data = await response.json();
  //       // Filter to only show expense categories
  //       const expenseCategories = data.filter(
  //         (cat: Category) => cat.type === "expense",
  //       );
  //       setCategories(expenseCategories);
  //     } else {
  //       toast.error("Failed to load categories");
  //     }
  //   } catch (error) {
  //     toast.error("Error loading categories");
  //     console.error(error);
  //   } finally {
  //     setIsLoadingCategories(false);
  //   }
  // };

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
        startDate,
        endDate,
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
    setStartDate(new Date(budget.startDate).toISOString().split("T")[0]);
    setEndDate(new Date(budget.endDate).toISOString().split("T")[0]);
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
    setCategoryId("");
    setAmount("");
    setPeriod("monthly");
    setStartDate("");
    setEndDate("");
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

  // const getCategoryName = (categoryId: string) => {
  //   // const category = categories.find((cat) => cat.id === categoryId);
  //   return category ? category.name : "Unknown Category";
  // };

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
                {isLoadingCategories ? (
                  <p>Loading categories...</p>
                ) : (
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {/* {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))} */}
                  </select>
                )}
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
                <select
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
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
                        {/* {budget.category
                          ? budget.category.name
                          : getCategoryName(budget.categoryId)} */}
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
