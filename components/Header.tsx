"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Store, LogOut, LayoutDashboard, ShoppingBag, Menu, X, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show header on auth pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/signup")) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (active: boolean) => 
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
    }`;

  return (
    <header className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
            <Store className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-lg hidden sm:inline bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            RateStore
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {user?.role === "NORMAL_USER" && (
            <>
              <Link href="/user/stores" className={navLinkClass(isActive("/user/stores"))}>
                <ShoppingBag className="h-4 w-4" />
                Browse Stores
              </Link>
              <Link href="/user/stores" className={navLinkClass(false)}>
                <Search className="h-4 w-4" />
              </Link>
            </>
          )}

          {user?.role === "SYSTEM_ADMIN" && (
            <Link href="/admin/dashboard" className={navLinkClass(isActive("/admin/dashboard"))}>
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}

          {user?.role === "STORE_OWNER" && (
            <Link href="/store/dashboard" className={navLinkClass(isActive("/store/dashboard"))}>
              <LayoutDashboard className="h-4 w-4" />
              Store Dashboard
            </Link>
          )}
        </nav>

        {/* Right Side - Theme Toggle & User Menu */}
        <div className="flex items-center gap-3">
          <ThemeToggleButton />

          {loading ? (
            <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
          ) : user ? (
            <>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-bold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user.role.replace("_", " ").toLowerCase()}
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/change-password" className="cursor-pointer">
                      Change Password
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 py-3 space-y-2">
          {user?.role === "NORMAL_USER" && (
            <Link href="/user/stores" className={navLinkClass(isActive("/user/stores"))} onClick={() => setMobileMenuOpen(false)}>
              <ShoppingBag className="h-4 w-4" />
              Browse Stores
            </Link>
          )}

          {user?.role === "SYSTEM_ADMIN" && (
            <Link href="/admin/dashboard" className={navLinkClass(isActive("/admin/dashboard"))} onClick={() => setMobileMenuOpen(false)}>
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}

          {user?.role === "STORE_OWNER" && (
            <Link href="/store/dashboard" className={navLinkClass(isActive("/store/dashboard"))} onClick={() => setMobileMenuOpen(false)}>
              <LayoutDashboard className="h-4 w-4" />
              Store Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
