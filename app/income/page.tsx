"use client";

import { useEffect, useState } from "react";
import IncomeManager from "@/components/Income/IncomeManager";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function IncomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await fetch("/api/me");
  //       if (response.ok) {
  //         const userData = await response.json();
  //         setUser(userData);
  //       } else {
  //         // Redirect to sign in if user is not authenticated
  //         router.push("/signin");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user", error);
  //       router.push("/signin");
  //     }
  //   };

  //   fetchUser();
  // }, [router]);

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Income Management</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push("/budget")}>
            Budget
          </Button>
          <Button variant="outline" onClick={() => router.push("/savings")}>
            Savings Goals
          </Button>
        </div>
      </div>

      <IncomeManager />
    </div>
  );
}
