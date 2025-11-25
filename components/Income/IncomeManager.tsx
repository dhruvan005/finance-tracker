"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Income {
  id: string;
  source: string;
  amount: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export default function IncomeManager() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/income");

      if (response.ok) {
        const data = await response.json();
        setIncomes(data);
      } else {
        toast.error("Failed to load incomes");
      }
    } catch (error) {
      toast.error("Error loading incomes");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!source || !amount) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        source,
        amount: parseFloat(amount),
        date: date ? date.toISOString() : undefined,
      };

      const url = "/api/income";
      const method = isEditing ? "PUT" : "POST";
      const finalUrl = isEditing ? `${url}?id=${selectedIncome?.id}` : url;

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
            ? "Income updated successfully"
            : "Income added successfully",
        );
        resetForm();
        fetchIncomes();
      } else {
        toast.error(
          isEditing ? "Failed to update income" : "Failed to add income",
        );
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (income: Income) => {
    setSelectedIncome(income);
    setSource(income.source);
    setAmount(income.amount);
    setDate(new Date(income.date));
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this income entry?")) {
      try {
        const response = await fetch(`/api/income?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Income deleted successfully");
          fetchIncomes();
        } else {
          toast.error("Failed to delete income");
        }
      } catch (error) {
        toast.error("An error occurred");
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setSource("");
    setAmount("");
    setDate(undefined);
    setSelectedIncome(null);
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
            {isEditing ? "Update Income" : "Add New Income"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  placeholder="Salary, Freelancing, etc."
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount</Label>
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
                <Label htmlFor="date">Date</Label>
                <DatePicker
                  date={date}
                  onSelect={setDate}
                  placeholder="Select income date"
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
                  ? "Update Income"
                  : "Add Income"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">Loading income data...</p>
          ) : incomes.length === 0 ? (
            <p className="text-center py-4">No income entries found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Source</th>
                    <th className="text-left py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-right py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income) => (
                    <tr key={income.id} className="border-b">
                      <td className="py-2 px-2">{income.source}</td>
                      <td className="py-2 px-2">
                        {formatCurrency(income.amount)}
                      </td>
                      <td className="py-2 px-2">{formatDate(income.date)}</td>
                      <td className="py-2 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(income)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDelete(income.id)}
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
