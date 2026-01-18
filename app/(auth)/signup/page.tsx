"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Store, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (value.length < 20) return "Name must be at least 20 characters";
        if (value.length > 60) return "Name must not exceed 60 characters";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        break;
      case "password":
        if (value.length < 8) return "Password must be at least 8 characters";
        if (value.length > 16) return "Password must not exceed 16 characters";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Password must contain at least one special character";
        break;
      case "address":
        if (value.length > 400) return "Address must not exceed 400 characters";
        if (value.length === 0) return "Address is required";
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate all fields
    const errors: ValidationErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== "confirmPassword") {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) errors[key as keyof ValidationErrors] = error;
      }
    });

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Redirect to login or dashboard
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: keyof ValidationErrors) => {
    return validationErrors[field];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-4 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-0 left-0 w-80 h-80 bg-indigo-200 dark:bg-indigo-900/30 rounded-full opacity-20 dark:opacity-10 blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 dark:bg-blue-900/30 rounded-full opacity-20 dark:opacity-10 blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-0 shadow-2xl dark:shadow-2xl/50 bg-white dark:bg-gray-800 glassmorphism-card">
          <CardHeader className="space-y-1">
            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: "backOut" }}
            >
              <motion.div
                className="bg-indigo-600 dark:bg-indigo-500 p-3 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(79, 70, 229, 0.3)",
                    "0 0 40px rgba(79, 70, 229, 0.6)",
                    "0 0 20px rgba(79, 70, 229, 0.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Store className="h-8 w-8 text-white" />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Create an Account
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Join our platform to rate and discover stores
              </CardDescription>
            </motion.div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {[
                {
                  name: "name",
                  label: "Full Name",
                  placeholder: "Enter your full name (2-60 characters)",
                  type: "text",
                },
                {
                  name: "email",
                  label: "Email",
                  placeholder: "name@example.com",
                  type: "email",
                },
                {
                  name: "address",
                  label: "Address",
                  placeholder: "Enter your address (max 400 characters)",
                  type: "textarea",
                },
                {
                  name: "password",
                  label: "Password",
                  placeholder: "Create a strong password",
                  type: "password",
                },
                {
                  name: "confirmPassword",
                  label: "Confirm Password",
                  placeholder: "Re-enter your password",
                  type: "password",
                },
              ].map((field, idx) => (
                <motion.div
                  key={field.name}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                >
                  <Label htmlFor={field.name}>
                    {field.label} <span className="text-red-500">*</span>
                  </Label>
                  {field.type === "textarea" ? (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Textarea
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={
                          formData[field.name as keyof typeof formData] || ""
                        }
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        rows={3}
                        className={`transition-all ${
                          getFieldError(field.name as keyof ValidationErrors)
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={
                          formData[field.name as keyof typeof formData] || ""
                        }
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className={`transition-all ${
                          getFieldError(field.name as keyof ValidationErrors)
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    </motion.div>
                  )}

                  {getFieldError(field.name as keyof ValidationErrors) && (
                    <motion.p
                      className="text-sm text-red-500 flex items-center gap-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError(field.name as keyof ValidationErrors)}
                    </motion.p>
                  )}

                  {!getFieldError(field.name as keyof ValidationErrors) &&
                    field.name === "name" &&
                    formData.name.length >= 20 && (
                      <motion.p
                        className="text-sm text-green-600 flex items-center gap-1"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Valid name
                      </motion.p>
                    )}

                  {field.name === "address" && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {formData.address.length}/400 characters
                      </span>
                    </div>
                  )}

                  {field.name === "password" && (
                    <p className="text-xs text-muted-foreground">
                      8-16 characters, 1 uppercase, 1 special character
                    </p>
                  )}
                </motion.div>
              ))}
            </CardContent>

            <CardFooter className="flex flex-col pt-10 space-y-4">
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>

              <motion.div
                className="text-sm text-center text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-purple-600 hover:text-purple-500 underline-offset-4 hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
