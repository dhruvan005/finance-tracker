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
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/me");

        if (response.ok) {
          const userData = await response.json();
          console.log("user Data - ", userData);
          setUser(userData);
        } else {
          console.error("Failed to fetch user data:", await response.text());
          router.push("/signin");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [setUser, router, user]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 pr-5">
        <div className="w-8 h-8 bg-gray-500 rounded-full animate-pulse"></div>
      </div>
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
        <Button variant="ghost" className="h-auto p-1 hover:bg-transparent">
          <Avatar className="w-7 h-7">
            {(() => {
              const raw = (user as any)?.image;

              // Normalize to a string if possible
              let imageStr: string | undefined;
              if (typeof raw === "string") {
                imageStr = raw;
              } else if (raw && typeof raw === "object") {
                if (typeof raw.url === "string") imageStr = raw.url;
                else if (typeof raw.image === "string") imageStr = raw.image;
              }

              if (imageStr && typeof imageStr !== "string") {
                console.warn("Unexpected image type:", typeof imageStr, imageStr);
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
                  className="rounded-full object-cover"
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
