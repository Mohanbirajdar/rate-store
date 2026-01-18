"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { requireAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, User, MapPin, Loader2, Shield, Settings, CheckCircle2, Edit2, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center animate-in fade-in duration-500">
          <div className="relative inline-block">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-indigo-600 opacity-20"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!formData.name || !formData.address) {
      setError("Name and address are required");
      setIsSaving(false);
      return;
    }

    if (formData.name.length < 2 || formData.name.length > 60) {
      setError("Name must be between 2 and 60 characters");
      setIsSaving(false);
      return;
    }

    if (formData.address.length > 400) {
      setError("Address must not exceed 400 characters");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      // Refresh user data from server
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Animated Hero Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-in zoom-in duration-500">
              <User className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: '100ms'}}>
              My Profile
            </h1>
            <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: '200ms'}}>
              Manage your account information and settings
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8 sm:h-12 text-white dark:text-slate-950" preserveAspectRatio="none" viewBox="0 0 1440 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 22L60 24.3C120 26.7 240 31.3 360 28.8C480 26.3 600 16.7 720 13.5C840 10.3 960 13.7 1080 18.8C1200 24 1320 31 1380 34.7L1440 38.3V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-gray-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom duration-500 mb-6">
          {error && (
            <div className="mb-6 p-4 border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-xl animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg flex-shrink-0 mt-0.5">
                  <Settings className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-red-800 dark:text-red-300 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 rounded-xl animate-in fade-in zoom-in duration-300">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-green-800 dark:text-green-300 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Profile Info Section */}
          <div className="space-y-6">
            {/* Name */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '50ms'}}>
              <Label className="flex items-center gap-2 mb-2 font-medium text-gray-900 dark:text-white">
                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <User className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                Full Name
              </Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="disabled:bg-gray-100 dark:disabled:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white h-11 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '100ms'}}>
              <Label className="flex items-center gap-2 mb-2 font-medium text-gray-900 dark:text-white">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                Email Address
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="disabled:bg-gray-100 dark:disabled:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white h-11 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all duration-300"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Address */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '150ms'}}>
              <Label className="flex items-center gap-2 mb-2 font-medium text-gray-900 dark:text-white">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MapPin className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                Address
              </Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="disabled:bg-gray-100 dark:disabled:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white h-11 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all duration-300"
                placeholder="Enter your address"
              />
            </div>

            {/* Role Display */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '200ms'}}>
              <Label className="mb-2 block font-medium text-gray-900 dark:text-white">Account Type</Label>
              <div className="px-4 py-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                <span className="capitalize text-indigo-700 dark:text-indigo-300 font-semibold">
                  {user.role.replace("_", " ").toLowerCase()}
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '250ms'}}>
              <Label className="mb-2 block font-medium text-gray-900 dark:text-white">Account Status</Label>
              <div className="px-4 py-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300 font-semibold">
                    Active member
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '300ms'}}>
            {!isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/change-password")}
                  className="flex-1 h-11 sm:h-12 border-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      address: user.address,
                    });
                  }}
                  className="flex-1 h-11 sm:h-12 border-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-gray-200 dark:border-slate-800 shadow-lg p-6 animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '350ms'}}>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Quick Links
          </h3>
          <div className="space-y-2">
            {user.role === "NORMAL_USER" && (
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 h-11"
                onClick={() => router.push("/user/stores")}
              >
                Browse and Rate Stores
              </Button>
            )}
            {user.role === "SYSTEM_ADMIN" && (
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 h-11"
                onClick={() => router.push("/admin/dashboard")}
              >
                Admin Dashboard
              </Button>
            )}
            {user.role === "STORE_OWNER" && (
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 h-11"
                onClick={() => router.push("/store/dashboard")}
              >
                Store Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
