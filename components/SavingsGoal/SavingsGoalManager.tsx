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
  const [targetDate, setTargetDate] = useState("");
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
        targetDate,
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
    setTargetDate(new Date(goal.targetDate).toISOString().split("T")[0]);
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
    setTargetDate("");
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
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Update Savings Goal" : "Create New Savings Goal"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="New Car, Vacation, Emergency Fund, etc."
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
                <Label htmlFor="currentAmount">Current Amount (Optional)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
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
                  ? "Update Goal"
                  : "Create Goal"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Savings Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">Loading savings goals...</p>
          ) : savingsGoals.length === 0 ? (
            <p className="text-center py-4">No savings goals found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {savingsGoals.map((goal) => {
                const isCompleted = isGoalCompleted(
                  goal.currentAmount,
                  goal.targetAmount,
                );
                return (
                  <Card
                    key={goal.id}
                    className={
                      isCompleted ? "border-green-500/20 bg-green-900/50" : ""
                    }
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {goal.name}
                        {isCompleted && (
                          <span className="text-green-600 text-lg">🎉</span>
                        )}
                      </CardTitle>
                      {isCompleted && (
                        <div className="text-sm text-green-600 font-medium">
                          ✅ Goal Completed!
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {formatCurrency(goal.currentAmount)} /{" "}
                            {formatCurrency(goal.targetAmount)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-blue-500"}`}
                            style={{
                              width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-sm text-right">
                          {Math.round(
                            calculateProgress(
                              goal.currentAmount,
                              goal.targetAmount,
                            ),
                          )}
                          %
                        </div>
                      </div>

                      <div className="text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span>Target Date:</span>
                          <span>{formatDate(goal.targetDate)}</span>
                        </div>
                      </div>

                      {!isCompleted && (
                        <div className="pt-2">
                          <Label
                            htmlFor={`update-${goal.id}`}
                            className="text-sm"
                          >
                            Update Progress
                          </Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id={`update-${goal.id}`}
                              type="number"
                              step="0.01"
                              placeholder="Add amount"
                              className="text-sm"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                const input = document.getElementById(
                                  `update-${goal.id}`,
                                ) as HTMLInputElement;
                                if (input && input.value) {
                                  handleUpdateProgress(goal.id, input.value);
                                }
                              }}
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="pt-2 text-center">
                          <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                            <p className="text-green-800 text-sm font-medium">
                              🎯 Congratulations! This goal has been achieved.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(goal)}
                          disabled={isCompleted}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDelete(goal.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}
