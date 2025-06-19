"use client";

import { useState, useEffect } from "react";

import React from "react";
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

const Page = () => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    image?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  useEffect(() => {
    // Fetch user data from the API endpoint
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/me");

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Fall back to default user data if API fails
          console.error("Failed to fetch user data:", await response.text());
          setUser({
            name: "User",
            email: "user@example.com",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Fallback user data
        setUser({
          name: "User",
          email: "user@example.com",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const res = await fetch("/api/category?type=expense");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (data.length) setCategoryId(data[0].id);
        } else {
          console.error("Failed to fetch categories");
          toast.error("Failed to load expense categories");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load expense categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

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
          date: date || undefined,
        }),
      });
      if (res.ok) {
        toast.success("Expense created");
        setAmount("");
        setDescription("");
        setDate("");
        if (categories.length) setCategoryId(categories[0].id);
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

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form input
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsSubmittingCategory(true);
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          type: "expense",
        }),
      });

      if (res.ok) {
        toast.success("Category created");
        setCategoryName("");

        // Refresh categories list
        const categoriesRes = await fetch("/api/category?type=expense");
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data);
          if (data.length > 0) setCategoryId(data[0].id);
        }
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create category");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create category");
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={isSubmitting || isLoadingCategories}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {isLoadingCategories ? (
                    <option>Loading categories...</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {" "}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Adding..." : "Add Expense"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  disabled={isSubmittingCategory}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {" "}
          <Button
            onClick={handleCategorySubmit}
            disabled={isSubmittingCategory}
            className="w-full"
          >
            {isSubmittingCategory ? "Creating..." : "Add Category"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
