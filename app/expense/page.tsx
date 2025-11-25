"use client";

import { useState, useEffect } from "react";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

// Hardcoded expense categories
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

interface Expense {
  id: string;
  amount: string;
  categoryId: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(EXPENSE_CATEGORIES[0].id);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/expense");

      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        toast.error("Failed to load expenses");
      }
    } catch (error) {
      toast.error("Error loading expenses");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = EXPENSE_CATEGORIES.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        const response = await fetch(`/api/expense?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Expense deleted successfully");
          fetchExpenses();
        } else {
          toast.error("Failed to delete expense");
        }
      } catch (error) {
        toast.error("An error occurred");
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form input
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          categoryId,
          description,
          date: date ? date.toISOString() : undefined,
        }),
      });
      if (res.ok) {
        toast.success("Expense created");
        setAmount("");
        setDescription("");
        setDate(undefined);
        setCategoryId(EXPENSE_CATEGORIES[0].id);
        fetchExpenses();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create expense");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Expense Management</h1>
        <p className="text-muted-foreground">Track and manage your expenses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add New Expense</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
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
              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <Label htmlFor="date">Date</Label>
                <DatePicker
                  date={date}
                  onSelect={setDate}
                  disabled={isSubmitting}
                  placeholder="Select expense date"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-5">
            <Button type="submit" disabled={isSubmitting} className="min-w-[160px] text-lg">
              {isSubmitting ? "Adding..." : "Add Expense"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading ? (
        <Card className="mt-6">
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading expenses...</p>
          </CardContent>
        </Card>
      ) : expenses.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No expenses yet. Add your first expense above.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Expense History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Category</th>
                    <th className="text-left py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">Description</th>
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-right py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2">{getCategoryName(expense.categoryId)}</td>
                      <td className="py-3 px-2 font-semibold text-red-600">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(parseFloat(expense.amount))}
                      </td>
                      <td className="py-3 px-2">{expense.description || "-"}</td>
                      <td className="py-3 px-2">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;
