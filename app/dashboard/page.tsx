"use client";

import { useState, useEffect } from "react";

import React from "react";

const Page = () => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    image?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>DashBorad</div>
    </div>
  );
};

export default Page;
