"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function SavingsGoalManager() {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSavingsGoals();
  }, []);

  const fetchSavingsGoals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/savings-goal");

      if (response.ok) {
        const data = await response.json();
        setSavingsGoals(data);
      } else {
        toast.error("Failed to load savings goals");
      }
    } catch (error) {
      toast.error("Error loading savings goals");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !targetAmount || !targetDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        targetDate: targetDate ? targetDate.toISOString() : new Date().toISOString(),
      };

      const url = "/api/savings-goal";
      const method = isEditing ? "PATCH" : "POST";
      const finalUrl = isEditing ? `${url}?id=${selectedGoal?.id}` : url;

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
            ? "Savings goal updated successfully"
            : "Savings goal added successfully",
        );
        resetForm();
        fetchSavingsGoals();
      } else {
        toast.error(
          isEditing
            ? "Failed to update savings goal"
            : "Failed to add savings goal",
        );
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setName(goal.name);
    setTargetAmount(goal.targetAmount);
    setCurrentAmount(goal.currentAmount);
    setTargetDate(new Date(goal.targetDate));
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this savings goal?")) {
      try {
        const response = await fetch(`/api/savings-goal?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Savings goal deleted successfully");
          fetchSavingsGoals();
        } else {
          toast.error("Failed to delete savings goal");
        }
      } catch (error) {
        toast.error("An error occurred");
        console.error(error);
      }
    }
  };
  const handleUpdateProgress = async (id: string, newAmount: string) => {
    try {
      const goal = savingsGoals.find((g) => g.id === id);
      if (!goal) return;

      const response = await fetch(`/api/savings-goal?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentAmount: parseFloat(newAmount),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Check if the goal was completed
        if (data.goalCompleted) {
          // Show celebration toast with the completion message
          toast.success(data.message, {
            duration: 8000,
            description:
              data.achievement || "You've reached your savings target!",
          });

          // Clear the input field
          const input = document.getElementById(
            `update-${id}`,
          ) as HTMLInputElement;
          if (input) {
            input.value = "";
          }
        } else {
          toast.success("Progress updated successfully");
        }

        fetchSavingsGoals();
      } else {
        toast.error("Failed to update progress");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  const resetForm = () => {
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate(undefined);
    setSelectedGoal(null);
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
  const calculateProgress = (current: string, target: string) => {
    const currentVal = parseFloat(current);
    const targetVal = parseFloat(target);
    if (targetVal <= 0) return 0;
    return Math.min((currentVal / targetVal) * 100, 100);
  };

  const isGoalCompleted = (current: string, target: string) => {
    const currentVal = parseFloat(current);
    const targetVal = parseFloat(target);
    return currentVal >= targetVal;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {isEditing ? "Edit Savings Goal" : "Add New Savings Goal"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="Emergency Fund, New Car, Vacation..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="targetAmount">Target Amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="currentAmount">Current Amount</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <DatePicker
                  date={targetDate}
                  onSelect={setTargetDate}
                  placeholder="Select target date"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-5">
            {isEditing && (
              <Button variant="outline" onClick={resetForm} type="button" className="min-w-[100px]">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="min-w-[160px] text-lg">
              {isSubmitting
                ? "Processing..."
                : isEditing
                  ? "Update Goal"
                  : "Create Goal"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading savings goals...</p>
          </CardContent>
        </Card>
      ) : savingsGoals.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No savings goals yet. Create your first goal above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {savingsGoals.map((goal) => {
            const isCompleted = isGoalCompleted(
              goal.currentAmount,
              goal.targetAmount,
            );
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            
            return (
              <Card
                key={goal.id}
                className={cn(
                  "hover:shadow-lg transition-shadow",
                  isCompleted && "border-green-500/30 bg-green-500/5"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    {isCompleted && <span className="text-xl">🎉</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Target: {formatDate(goal.targetDate)}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        of {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            isCompleted ? "bg-green-500" : "bg-primary"
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.round(progress)}% complete</span>
                        {isCompleted && <span className="text-green-600 font-medium">✓ Completed</span>}
                      </div>
                    </div>
                  </div>

                  {!isCompleted && (
                    <div className="space-y-2">
                      <Label htmlFor={`update-${goal.id}`} className="text-sm">
                        Add to savings
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`update-${goal.id}`}
                          type="number"
                          step="0.01"
                          placeholder="Amount"
                          className="text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById(
                              `update-${goal.id}`,
                            ) as HTMLInputElement;
                            if (input && input.value) {
                              handleUpdateProgress(goal.id, input.value);
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(goal)}
                      disabled={isCompleted}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(goal.id)}
                      className="flex-1 text-red-500 hover:text-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
