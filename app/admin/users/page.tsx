"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Search, Mail, MapPin, Calendar, Shield, Plus, User, Eye, Star } from "lucide-react";
import Link from "next/link";

interface Store {
  id: string;
  name: string;
  averageRating?: number;
  _count?: {
    ratings: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt: string;
  store?: Store | null;
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "NORMAL_USER",
  });
  const [addingUser, setAddingUser] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUsers();
    }
  }, [authLoading]);

  useEffect(() => {
    let filtered = users.filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (roleFilter !== "ALL") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingUser(true);
    setAddError("");
    setAddSuccess("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addUserForm),
      });

      const data = await response.json();

      if (response.ok) {
        setAddSuccess("User created successfully!");
        setUsers([data.user, ...users]);
        setAddUserForm({
          name: "",
          email: "",
          password: "",
          address: "",
          role: "NORMAL_USER",
        });
        setTimeout(() => {
          setShowAddDialog(false);
          setAddSuccess("");
        }, 1500);
      } else {
        setAddError(data.error || "Failed to create user");
      }
    } catch (error) {
      setAddError("An error occurred. Please try again.");
    } finally {
      setAddingUser(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 dark:from-indigo-700 dark:via-blue-700 dark:to-purple-700">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse [animation-delay:1s]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl sm:text-5xl animate-bounce">👥</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  Manage Users
                </h1>
              </div>
              <p className="text-indigo-100 dark:text-indigo-200 text-sm sm:text-base">
                View and manage all users in the system
              </p>
            </div>
            <Link href="/admin/dashboard" className="animate-in fade-in slide-in-from-right duration-700 delay-200">
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/20 transition-all">
              <p className="text-indigo-100 text-xs sm:text-sm font-medium">Total Users</p>
              <p className="text-white text-xl sm:text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/20 transition-all">
              <p className="text-indigo-100 text-xs sm:text-sm font-medium">Filtered</p>
              <p className="text-white text-xl sm:text-2xl font-bold">{filteredUsers.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/20 transition-all">
              <p className="text-indigo-100 text-xs sm:text-sm font-medium">Admins</p>
              <p className="text-white text-xl sm:text-2xl font-bold">{users.filter(u => u.role === "SYSTEM_ADMIN").length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/20 transition-all">
              <p className="text-indigo-100 text-xs sm:text-sm font-medium">Store Owners</p>
              <p className="text-white text-xl sm:text-2xl font-bold">{users.filter(u => u.role === "STORE_OWNER").length}</p>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-indigo-50 dark:fill-slate-950"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Search and Filter Bar */}
        <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Search className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Search & Filter Users
            </h3>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 hover:scale-105 transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-600" />
                    Create New User
                  </DialogTitle>
                  <DialogDescription>
                    Add a new user to the system. Fill in all required fields.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4">
                  {addError && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
                      {addError}
                    </div>
                  )}
                  {addSuccess && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-sm">
                      {addSuccess}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={addUserForm.name}
                      onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={addUserForm.email}
                      onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={addUserForm.password}
                      onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                      required
                      placeholder="Min 6 characters"
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={addUserForm.address}
                      onChange={(e) => setAddUserForm({ ...addUserForm, address: e.target.value })}
                      required
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={addUserForm.role} onValueChange={(value) => setAddUserForm({ ...addUserForm, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NORMAL_USER">Normal User</SelectItem>
                        <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
                        <SelectItem value="SYSTEM_ADMIN">System Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    disabled={addingUser}
                  >
                    {addingUser ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create User
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <Search className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 absolute mt-3 ml-3 transition-colors z-10" />
              <Input
                placeholder="Search by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-600 transition-all"
              />
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-12 border-2">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="NORMAL_USER">Normal Users</SelectItem>
                  <SelectItem value="STORE_OWNER">Store Owners</SelectItem>
                  <SelectItem value="SYSTEM_ADMIN">System Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <div className="p-4 sm:p-6 border-b-2 border-gray-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Users</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Showing: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filteredUsers.length}</span> of {users.length} users
            </p>
          </div>
          <div className="p-4 sm:p-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="text-6xl mb-4 animate-bounce">👤</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No users found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-slate-800 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20">
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">Name</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">Email</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">Address</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">Role</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">Joined</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, index) => (
                      <tr 
                        key={u.id} 
                        className="border-b border-gray-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all duration-200 animate-in fade-in slide-in-from-bottom"
                        style={{ animationDelay: `${100 + index * 50}ms` }}
                      >
                        <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{u.name}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {u.email}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="max-w-[200px] truncate">{u.address}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={
                            u.role === "SYSTEM_ADMIN" 
                              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0" 
                              : u.role === "STORE_OWNER"
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
                              : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0"
                          }>
                            {u.role === "SYSTEM_ADMIN" ? "Admin" : u.role === "STORE_OWNER" ? "Store Owner" : "Normal User"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(u.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                            onClick={() => {
                              setSelectedUser(u);
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* User Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <User className="h-6 w-6 text-indigo-600" />
                User Details
              </DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-500 dark:text-gray-400">Full Name</Label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedUser.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500 dark:text-gray-400">Role</Label>
                    <Badge className={
                      selectedUser.role === "SYSTEM_ADMIN" 
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0" 
                        : selectedUser.role === "STORE_OWNER"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0"
                    }>
                      {selectedUser.role === "SYSTEM_ADMIN" ? "Admin" : selectedUser.role === "STORE_OWNER" ? "Store Owner" : "Normal User"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-500 dark:text-gray-400">Email</Label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-gray-900 dark:text-white">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-500 dark:text-gray-400">Address</Label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <p className="text-gray-900 dark:text-white">{selectedUser.address}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-500 dark:text-gray-400">Member Since</Label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-gray-900 dark:text-white">{new Date(selectedUser.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>

                {/* Store Owner Rating */}
                {selectedUser.role === "STORE_OWNER" && selectedUser.store && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                      Store Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400 text-sm">Store Name</Label>
                        <p className="text-gray-900 dark:text-white font-semibold">{selectedUser.store.name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400 text-sm">Average Rating</Label>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {selectedUser.store.averageRating ? selectedUser.store.averageRating.toFixed(2) : "N/A"}
                          <span className="text-sm text-gray-500 ml-1">/ 5.0</span>
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400 text-sm">Total Reviews</Label>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {selectedUser.store._count?.ratings || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
