"use client";

import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/userStore";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

export default function AvatarDropdown() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);

        // First check if we have recent user data
        const lastVerified = localStorage.getItem("userLastVerified");
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        // If we have recent data, just use getSession (fast)
        if (lastVerified && now - parseInt(lastVerified) < oneHour) {
          const session = await authClient.getSession();
          if (session?.data?.user) {
            setUser(session.data.user);
            return;
          }
        }

        const response = await fetch("/api/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem("userLastVerified", now.toString());
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
        // Fallback to getSession if /api/me fails
        try {
          const session = await authClient.getSession();
          if (session?.data?.user) {
            setUser(session.data.user);
          } else {
            router.push("/");
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      initializeUser();
    }
  }, [setUser, router, user]);

  if (loading) {
    return (
      <Button variant="ghost" className="h-auto hover:bg-transparent" disabled>
        <div className="w-7 h-7 bg-gray-500 rounded-full animate-pulse"></div>
        <ChevronDownIcon size={10} className="opacity-60" aria-hidden="true" />
      </Button>
    );
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Sign out using AuthClient
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setUser(null);
            localStorage.removeItem("userLastVerified"); // Clear cache on logout
            router.push("/");
            toast.message("Logged Out Successfully");
          },
          onError: (ctx) => {
            console.error("Logout error:", ctx.error);
          },
        },
      });
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto hover:bg-transparent cursor-pointer">
          <Avatar className="w-7 h-7">
            {(() => {
              const raw = (user as any)?.image;

              let imageStr: string | undefined;
              if (typeof raw === "string") {
                imageStr = raw;
              } else if (raw && typeof raw === "object") {
                if (typeof raw.url === "string") imageStr = raw.url;
                else if (typeof raw.image === "string") imageStr = raw.image;
              }

              if (imageStr && typeof imageStr !== "string") {
                console.warn(
                  "Unexpected image type:",
                  typeof imageStr,
                  imageStr,
                );
              }

              const valid =
                typeof imageStr === "string" &&
                imageStr.length > 0 &&
                /^https?:\/\//.test(imageStr);

              if (!valid) {
                return (
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                );
              }

              return (
                <Image
                  src={imageStr!}
                  alt="Profile image"
                  width={28}
                  height={28}
                  className="rounded-full object-cover h-auto w-auto"
                  priority
                  onError={(e) => {
                    console.error("Avatar image failed:", e.currentTarget.src);
                  }}
                />
              );
            })()}
          </Avatar>
          <ChevronDownIcon
            size={10}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user?.name || "Hi User"}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user?.email || "User@gmail.com"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer"
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
