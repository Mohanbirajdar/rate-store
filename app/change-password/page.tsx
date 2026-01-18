"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, Shield, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center animate-in fade-in duration-500">
          <div className="relative inline-block">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-indigo-600 opacity-20"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8 || password.length > 16) {
      errors.push("Password must be 8-16 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear validation error for this field
    setValidationErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors[0];
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || "Failed to change password");
        return;
      }

      setSuccess("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Password change error:", err);
    } finally {
      setIsLoading(false);
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
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 hover:gap-3 group mb-6 animate-in fade-in slide-in-from-left duration-500"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </button>
          
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-in zoom-in duration-500">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: '100ms'}}>
              Change Password
            </h1>
            <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: '200ms'}}>
              Keep your account secure by updating your password regularly
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8 sm:h-12 text-white dark:text-slate-950" preserveAspectRatio="none" viewBox="0 0 1440 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 22L60 24.3C120 26.7 240 31.3 360 28.8C480 26.3 600 16.7 720 13.5C840 10.3 960 13.7 1080 18.8C1200 24 1320 31 1380 34.7L1440 38.3V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-gray-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom duration-500">
          {error && (
            <div className="mb-6 p-4 border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-xl animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg flex-shrink-0 mt-0.5">
                  <Lock className="h-4 w-4 text-red-600 dark:text-red-400" />
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '50ms'}}>
              <Label htmlFor="currentPassword" className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white font-medium">
                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Lock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                Current Password
              </Label>
              <div className="relative group">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`border-2 dark:bg-slate-800 dark:text-white transition-all duration-300 h-11 ${
                    validationErrors.currentPassword
                      ? "border-red-500 dark:border-red-500 focus:border-red-600"
                      : "border-gray-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500"
                  }`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {validationErrors.currentPassword && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {validationErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="newPassword" className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white">
                <Lock className="h-4 w-4" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white ${
                    validationErrors.newPassword ? "border-red-500 dark:border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {validationErrors.newPassword && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {validationErrors.newPassword}
                </p>
              )}
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-md">
                <p className="text-xs text-blue-800 dark:text-blue-300 font-medium mb-2">
                  Password requirements:
                </p>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>
                    • 8-16 characters in length
                  </li>
                  <li>
                    • At least one uppercase letter (A-Z)
                  </li>
                  <li>
                    • At least one special character (!@#$%^&*...)
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white">
                <Lock className="h-4 w-4" />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white ${
                    validationErrors.confirmPassword ? "border-red-500 dark:border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '200ms'}}>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-11 sm:h-12 border-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
