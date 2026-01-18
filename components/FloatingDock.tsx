"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Dock, DockIcon } from "@/components/ui/dock";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import {
  Home,
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  LogIn,
  User,
  Lock,
  Users,
  Store,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FloatingDock() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Don't show on auth pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/signup")) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-end pb-2 sm:pb-3 md:pb-8 px-2 sm:px-3 md:px-0 pointer-events-none z-50">
        <Dock className="pointer-events-auto" iconSize={28} iconMagnification={42} iconDistance={85}>
          {/* Home */}
          <Link href="/">
            <Tooltip>
              <TooltipTrigger asChild>
                <DockIcon className="bg-indigo-600 hover:bg-indigo-700">
                  <Home className="h-5 w-5 text-white" />
                </DockIcon>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </Link>

          {/* User Navigation */}
          {user?.role === "NORMAL_USER" && (
            <>
              <Link href="/user/stores">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DockIcon className="bg-blue-500 hover:bg-blue-600">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Browse Stores</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </>
          )}

          {/* Admin Navigation */}
          {user?.role === "SYSTEM_ADMIN" && (
            <>
              <Link href="/admin/dashboard">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DockIcon className="bg-purple-500 hover:bg-purple-600">
                      <LayoutDashboard className="h-5 w-5 text-white" />
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </Link>

              <Link href="/admin/users">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DockIcon className="bg-cyan-500 hover:bg-cyan-600">
                      <Users className="h-5 w-5 text-white" />
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Manage Users</p>
                  </TooltipContent>
                </Tooltip>
              </Link>

              <Link href="/admin/stores">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DockIcon className="bg-orange-500 hover:bg-orange-600">
                      <Store className="h-5 w-5 text-white" />
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Manage Stores</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </>
          )}

          {/* Store Owner Navigation */}
          {user?.role === "STORE_OWNER" && (
            <>
              <Link href="/store/dashboard">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DockIcon className="bg-green-500 hover:bg-green-600">
                      <LayoutDashboard className="h-5 w-5 text-white" />
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Store Dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </Link>

              <Link href="/store/ratings">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DockIcon className={`bg-yellow-500 hover:bg-yellow-600 ${pathname === "/store/ratings" ? "ring-4 ring-yellow-300" : ""}`}>
                      <Zap className="h-5 w-5 text-white" />
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Ratings</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </>
          )}

          {/* Separator */}
          {user && <div className="h-6 sm:h-7 md:h-10 w-px bg-gradient-to-b from-white/30 to-white/10 dark:from-white/10 dark:to-white/5 mx-0.5 sm:mx-1 md:mx-2" />}

          {/* Profile & Settings - Only if logged in */}
          {user && (
            <>
              <Link href="/profile">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DockIcon className="bg-slate-500 hover:bg-slate-600">
                      <User className="h-5 w-5 text-white" />
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Profile</p>
                  </TooltipContent>
                </Tooltip>
              </Link>

              <Link href="/change-password">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DockIcon className="bg-slate-500 hover:bg-slate-600">
                      <Lock className="h-5 w-5 text-white" />
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Change Password</p>
                  </TooltipContent>
                </Tooltip>
              </Link>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ThemeToggleButton />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Theme</p>
                </TooltipContent>
              </Tooltip>

              <button onClick={logout}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DockIcon className="bg-red-500 hover:bg-red-600">
                      <LogOut className="h-5 w-5 text-white" />
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </button>
            </>
          )}

          {/* Login - Only if not logged in */}
          {!user && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ThemeToggleButton />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Theme</p>
                </TooltipContent>
              </Tooltip>
              <Link href="/login">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DockIcon className="bg-indigo-600 hover:bg-indigo-700">
                      <LogIn className="h-5 w-5 text-white" />
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign In</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </>
          )}
        </Dock>
      </div>
    </TooltipProvider>
  );
}
