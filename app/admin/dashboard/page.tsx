"use client";
// Form validation enabled

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Users,
  Store,
  Star,
  TrendingUp,
  UserPlus,
  Building2,
  Mail,
  Lock,
  MapPin,
  User,
  Shield,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  averageRating: number;
}

interface AddUserForm {
  name: string;
  email: string;
  password: string;
  address: string;
  role: "NORMAL_USER" | "STORE_OWNER" | "SYSTEM_ADMIN";
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPassword?: string;
  ownerAddress?: string;
  storeName?: string;
  storeEmail?: string;
  storeAddress?: string;
}

interface AddStoreForm {
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerAddress: string;
  storeName: string;
  storeEmail: string;
  storeAddress: string;
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showAddStoreDialog, setShowAddStoreDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userError, setUserError] = useState("");
  const [storeError, setStoreError] = useState("");
  const [userSuccess, setUserSuccess] = useState("");
  const [storeSuccess, setStoreSuccess] = useState("");
  const [userValidationErrors, setUserValidationErrors] = useState<ValidationErrors>({});
  const [storeValidationErrors, setStoreValidationErrors] = useState<ValidationErrors>({});
  const [addUserForm, setAddUserForm] = useState<AddUserForm>({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "NORMAL_USER",
  });
  const [addStoreForm, setAddStoreForm] = useState<AddStoreForm>({
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
    ownerAddress: "",
    storeName: "",
    storeEmail: "",
    storeAddress: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchStats();
    }
  }, [authLoading]);

  const validateUserField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (value.length < 2) return "Name must be at least 2 characters";
        if (value.length > 60) return "Name must not exceed 60 characters";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        break;
      case "password":
        if (value.length < 6) return "Password must be at least 6 characters";
        if (value.length > 16) return "Password must not exceed 16 characters";
        break;
      case "address":
        if (value.length > 400) return "Address must not exceed 400 characters";
        if (value.length === 0) return "Address is required";
        break;
    }
    return undefined;
  };

  const validateStoreField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "ownerName":
      case "storeName":
        if (value.length < 2) return "Name must be at least 2 characters";
        if (value.length > 60) return "Name must not exceed 60 characters";
        break;
      case "ownerEmail":
      case "storeEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        break;
      case "ownerPassword":
        if (value.length < 6) return "Password must be at least 6 characters";
        if (value.length > 16) return "Password must not exceed 16 characters";
        break;
      case "ownerAddress":
      case "storeAddress":
        if (value.length > 400) return "Address must not exceed 400 characters";
        if (value.length === 0) return "Address is required";
        break;
    }
    return undefined;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError("");
    setUserSuccess("");
    
    // Validate all fields
    const errors: ValidationErrors = {};
    Object.keys(addUserForm).forEach(key => {
      if (key !== "role") {
        const error = validateUserField(key, addUserForm[key as keyof AddUserForm] as string);
        if (error) errors[key as keyof ValidationErrors] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setUserValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addUserForm),
      });

      const data = await response.json();

      if (response.ok) {
        setUserSuccess("User added successfully!");
        setTimeout(() => {
          setShowAddUserDialog(false);
          setUserSuccess("");
          setAddUserForm({
            name: "",
            email: "",
            password: "",
            address: "",
            role: "NORMAL_USER",
          });
          setUserValidationErrors({});
        }, 2000);
        
        // Refresh stats
        const statsResponse = await fetch("/api/admin/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }
      } else {
        setUserError(data.error || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setUserError("An error occurred while adding the user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoreError("");
    setStoreSuccess("");
    
    // Validate all fields
    const errors: ValidationErrors = {};
    Object.keys(addStoreForm).forEach(key => {
      const error = validateStoreField(key, addStoreForm[key as keyof AddStoreForm]);
      if (error) errors[key as keyof ValidationErrors] = error;
    });

    if (Object.keys(errors).length > 0) {
      setStoreValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addStoreForm),
      });

      const data = await response.json();

      if (response.ok) {
        setStoreSuccess("Store and owner added successfully!");
        setTimeout(() => {
          setShowAddStoreDialog(false);
          setStoreSuccess("");
          setAddStoreForm({
            ownerName: "",
            ownerEmail: "",
            ownerPassword: "",
            ownerAddress: "",
            storeName: "",
            storeEmail: "",
            storeAddress: "",
          });
          setStoreValidationErrors({});
        }, 2000);
        
        // Refresh stats
        const statsResponse = await fetch("/api/admin/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }
      } else {
        setStoreError(data.error || "Failed to add store");
      }
    } catch (error) {
      console.error("Error adding store:", error);
      setStoreError("An error occurred while adding the store");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-700 dark:via-purple-700 dark:to-blue-700">
        <div className="absolute inset-0 bg-black/5"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-12 w-12 text-white animate-in zoom-in duration-500" />
              <h1 className="text-4xl sm:text-5xl font-bold text-white animate-in slide-in-from-bottom duration-500">
                System Administrator
              </h1>
            </div>
            <p className="text-xl text-indigo-100 dark:text-indigo-200 max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500 [animation-delay:200ms]">
              Manage users, stores, and monitor platform statistics
            </p>
            
            {/* Quick Stats Badges */}
            <div className="flex flex-wrap gap-4 justify-center pt-6 animate-in slide-in-from-bottom duration-500 [animation-delay:400ms]">
              <Badge variant="secondary" className="px-4 py-2 text-base bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                <Users className="h-4 w-4 mr-2" />
                {stats?.totalUsers || 0} Users
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-base bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                <Store className="h-4 w-4 mr-2" />
                {stats?.totalStores || 0} Stores
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-base bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                <Star className="h-4 w-4 mr-2" />
                {stats?.totalRatings || 0} Ratings
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-base bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                <TrendingUp className="h-4 w-4 mr-2" />
                {stats?.averageRating.toFixed(1) || "0.0"} Avg
              </Badge>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-8 sm:h-12 text-indigo-50 dark:text-slate-950"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Detailed Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom duration-500 [animation-delay:100ms]">
          <Card className="border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-xl hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border-0">
                  Total
                </Badge>
              </div>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Registered Users
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all hover:shadow-xl hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Store className="h-10 w-10 text-green-600 dark:text-green-400" />
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">
                  Active
                </Badge>
              </div>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
                {stats?.totalStores || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Total Stores
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600 transition-all hover:shadow-xl hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Star className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-0">
                  Reviews
                </Badge>
              </div>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
                {stats?.totalRatings || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Total Ratings
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-xl hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-0">
                  Average
                </Badge>
              </div>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                {stats?.averageRating && stats.averageRating > 0 ? stats.averageRating.toFixed(1) + " ⭐" : "N/A"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Platform Rating
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* End Main Content */}

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-2 border-indigo-200 dark:border-indigo-800">
          <DialogHeader className="space-y-3 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Add New User
                </DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Create a new account with custom role
                </p>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-6 mt-6">
            {/* Error Alert */}
            {userError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{userError}</AlertDescription>
              </Alert>
            )}
            
            {/* Success Alert */}
            {userSuccess && (
              <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{userSuccess}</AlertDescription>
              </Alert>
            )}

            {/* Personal Information Section */}
            <div className="space-y-5 p-5 bg-white/60 dark:bg-slate-800/40 rounded-xl border-2 border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Personal Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Full Name *
                </Label>
                <Input
                  id="userName"
                  placeholder="e.g., John Doe"
                  value={addUserForm.name}
                  onChange={(e) => {
                    setAddUserForm({ ...addUserForm, name: e.target.value });
                    const error = validateUserField("name", e.target.value);
                    setUserValidationErrors(prev => ({ ...prev, name: error }));
                    setUserError("");
                  }}
                  required
                  className={`h-11 border-2 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all bg-white dark:bg-slate-900 ${userValidationErrors.name ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {userValidationErrors.name && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {userValidationErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address *
                </Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="e.g., john.doe@example.com"
                  value={addUserForm.email}
                  onChange={(e) => {
                    setAddUserForm({ ...addUserForm, email: e.target.value });
                    const error = validateUserField("email", e.target.value);
                    setUserValidationErrors(prev => ({ ...prev, email: error }));
                    setUserError("");
                  }}
                  required
                  className={`h-11 border-2 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all bg-white dark:bg-slate-900 ${userValidationErrors.email ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {userValidationErrors.email && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {userValidationErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-5 p-5 bg-white/60 dark:bg-slate-800/40 rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Security & Access</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password *
                </Label>
                <Input
                  id="userPassword"
                  type="password"
                  placeholder="••••••••"
                  value={addUserForm.password}
                  onChange={(e) => {
                    setAddUserForm({ ...addUserForm, password: e.target.value });
                    const error = validateUserField("password", e.target.value);
                    setUserValidationErrors(prev => ({ ...prev, password: error }));
                    setUserError("");
                  }}
                  required
                  minLength={6}
                  className={`h-11 border-2 focus:border-purple-500 dark:focus:border-purple-400 transition-all bg-white dark:bg-slate-900 ${userValidationErrors.password ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {userValidationErrors.password ? (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {userValidationErrors.password}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <span className="text-purple-600 dark:text-purple-400">ℹ️</span>
                    Must be at least 6 characters long
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="userRole" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  User Role *
                </Label>
                <Select
                  value={addUserForm.role}
                  onValueChange={(value: "NORMAL_USER" | "STORE_OWNER" | "SYSTEM_ADMIN") =>
                    setAddUserForm({ ...addUserForm, role: value })
                  }
                  disabled={submitting}
                >
                  <SelectTrigger className="h-11 border-2 bg-white dark:bg-slate-900">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900">
                    <SelectItem value="NORMAL_USER" className="cursor-pointer">
                      <div className="flex items-center gap-3 py-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">Normal User</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Can browse and rate stores</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="STORE_OWNER" className="cursor-pointer">
                      <div className="flex items-center gap-3 py-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                          <ShoppingBag className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">Store Owner</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Can manage their own store</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="SYSTEM_ADMIN" className="cursor-pointer">
                      <div className="flex items-center gap-3 py-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                          <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">System Admin</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Full platform access</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span className="text-purple-600 dark:text-purple-400">💡</span>
                  Choose the appropriate role based on user permissions
                </p>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-5 p-5 bg-white/60 dark:bg-slate-800/40 rounded-xl border-2 border-green-200/50 dark:border-green-800/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Location Details</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userAddress" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Address *
                </Label>
                <Input
                  id="userAddress"
                  placeholder="e.g., 123 Main St, City, State 12345"
                  value={addUserForm.address}
                  onChange={(e) => {
                    setAddUserForm({ ...addUserForm, address: e.target.value });
                    const error = validateUserField("address", e.target.value);
                    setUserValidationErrors(prev => ({ ...prev, address: error }));
                    setUserError("");
                  }}
                  required
                  className={`h-11 border-2 focus:border-green-500 dark:focus:border-green-400 transition-all bg-white dark:bg-slate-900 ${userValidationErrors.address ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {userValidationErrors.address && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {userValidationErrors.address}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddUserDialog(false)}
                className="flex-1 h-12 border-2 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Add User
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Store Dialog */}
      <Dialog open={showAddStoreDialog} onOpenChange={setShowAddStoreDialog}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
              <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              Add New Store
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Register a new store and create its owner account automatically
            </p>
          </DialogHeader>
          <form onSubmit={handleAddStore} className="space-y-6 mt-4">
            {/* Error Alert */}
            {storeError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{storeError}</AlertDescription>
              </Alert>
            )}
            
            {/* Success Alert */}
            {storeSuccess && (
              <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{storeSuccess}</AlertDescription>
              </Alert>
            )}

            {/* Owner Information */}
            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <User className="h-5 w-5" />
                Owner Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-base font-semibold">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    placeholder="e.g., Jane Smith"
                    value={addStoreForm.ownerName}
                    onChange={(e) => {
                      setAddStoreForm({ ...addStoreForm, ownerName: e.target.value });
                      const error = validateStoreField("ownerName", e.target.value);
                      setStoreValidationErrors((prev) => ({ ...prev, ownerName: error }));
                      setStoreError("");
                    }}
                    required
                    className={`h-11 border-2 ${storeValidationErrors.ownerName ? "border-red-500" : ""}`}
                    disabled={submitting}
                  />
                  {storeValidationErrors.ownerName && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {storeValidationErrors.ownerName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerEmail" className="text-base font-semibold">Owner Email *</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    placeholder="owner@example.com"
                    value={addStoreForm.ownerEmail}
                    onChange={(e) => {
                      setAddStoreForm({ ...addStoreForm, ownerEmail: e.target.value });
                      const error = validateStoreField("ownerEmail", e.target.value);
                      setStoreValidationErrors((prev) => ({ ...prev, ownerEmail: error }));
                      setStoreError("");
                    }}
                    required
                    className={`h-11 border-2 ${storeValidationErrors.ownerEmail ? "border-red-500" : ""}`}
                    disabled={submitting}
                  />
                  {storeValidationErrors.ownerEmail && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {storeValidationErrors.ownerEmail}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPassword" className="text-base font-semibold">Owner Password *</Label>
                <Input
                  id="ownerPassword"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={addStoreForm.ownerPassword}
                  onChange={(e) => {
                    setAddStoreForm({ ...addStoreForm, ownerPassword: e.target.value });
                    const error = validateStoreField("ownerPassword", e.target.value);
                    setStoreValidationErrors((prev) => ({ ...prev, ownerPassword: error }));
                    setStoreError("");
                  }}
                  required
                  minLength={6}
                  className={`h-11 border-2 ${storeValidationErrors.ownerPassword ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {storeValidationErrors.ownerPassword ? (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {storeValidationErrors.ownerPassword}
                  </p>
                ) : (
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Owner will use this to login and manage their store
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerAddress" className="text-base font-semibold">Owner Address *</Label>
                <Input
                  id="ownerAddress"
                  placeholder="Owner's residential address"
                  value={addStoreForm.ownerAddress}
                  onChange={(e) => {
                    setAddStoreForm({ ...addStoreForm, ownerAddress: e.target.value });
                    const error = validateStoreField("ownerAddress", e.target.value);
                    setStoreValidationErrors((prev) => ({ ...prev, ownerAddress: error }));
                    setStoreError("");
                  }}
                  required
                  className={`h-11 border-2 ${storeValidationErrors.ownerAddress ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {storeValidationErrors.ownerAddress && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {storeValidationErrors.ownerAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Store Information */}
            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-base font-semibold">Store Name *</Label>
                  <Input
                    id="storeName"
                    placeholder="e.g., The Coffee Shop"
                    value={addStoreForm.storeName}
                    onChange={(e) => {
                      setAddStoreForm({ ...addStoreForm, storeName: e.target.value });
                      const error = validateStoreField("storeName", e.target.value);
                      setStoreValidationErrors((prev) => ({ ...prev, storeName: error }));
                      setStoreError("");
                    }}
                    required
                    className={`h-11 border-2 ${storeValidationErrors.storeName ? "border-red-500" : ""}`}
                    disabled={submitting}
                  />
                  {storeValidationErrors.storeName && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {storeValidationErrors.storeName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeEmail" className="text-base font-semibold">Store Email *</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    placeholder="store@example.com"
                    value={addStoreForm.storeEmail}
                    onChange={(e) => {
                      setAddStoreForm({ ...addStoreForm, storeEmail: e.target.value });
                      const error = validateStoreField("storeEmail", e.target.value);
                      setStoreValidationErrors((prev) => ({ ...prev, storeEmail: error }));
                      setStoreError("");
                    }}
                    required
                    className={`h-11 border-2 ${storeValidationErrors.storeEmail ? "border-red-500" : ""}`}
                    disabled={submitting}
                  />
                  {storeValidationErrors.storeEmail && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {storeValidationErrors.storeEmail}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeAddress" className="text-base font-semibold">Store Address *</Label>
                <Input
                  id="storeAddress"
                  placeholder="Store's physical location"
                  value={addStoreForm.storeAddress}
                  onChange={(e) => {
                    setAddStoreForm({ ...addStoreForm, storeAddress: e.target.value });
                    const error = validateStoreField("storeAddress", e.target.value);
                    setStoreValidationErrors((prev) => ({ ...prev, storeAddress: error }));
                    setStoreError("");
                  }}
                  required
                  className={`h-11 border-2 ${storeValidationErrors.storeAddress ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {storeValidationErrors.storeAddress ? (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {storeValidationErrors.storeAddress}
                  </p>
                ) : (
                  <p className="text-xs text-green-700 dark:text-green-300">
                    This will be visible to customers
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t-2 border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddStoreDialog(false)}
                className="flex-1 h-12 border-2"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-5 w-5" />
                    Add Store
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
