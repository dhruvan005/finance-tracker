"use client";

import { useState } from "react";

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

const Page = () => {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(EXPENSE_CATEGORIES[0].id);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Expense Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-4">
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
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
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Adding..." : "Add Expense"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Page;
