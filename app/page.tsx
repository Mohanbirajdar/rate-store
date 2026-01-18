"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Store,
  Star,
  Users,
  TrendingUp,
  Search,
  MessageSquare,
  Shield,
  Zap,
  ArrowRight,
  Check,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "@/lib/useInView";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

// Animated Section Component
function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container for children animations
function StaggerContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual Item for stagger effect
function StaggerItem({ children }: { children: React.ReactNode }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return <motion.div variants={itemVariants}>{children}</motion.div>;
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({ totalStores: 0, totalUsers: 0, totalRatings: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch real stats from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "SYSTEM_ADMIN":
        return "/admin/dashboard";
      case "STORE_OWNER":
        return "/store/dashboard";
      case "NORMAL_USER":
        return "/user/stores";
      default:
        return "/login";
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-20 pb-32 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/30 rounded-full opacity-20 dark:opacity-10 blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [-20, 20, -20],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full opacity-20 dark:opacity-10 blur-3xl"
            animate={{
              y: [0, -30, 0],
              x: [20, -20, 20],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Logo */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-2xl blur-lg opacity-75"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 p-4 rounded-2xl">
                  <Store className="h-12 w-12 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight">
                Discover & Rate
                <motion.span
                  className="block bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}
                >
                  Your Favorite Stores
                </motion.span>
              </h1>

              <motion.p
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Join thousands of users rating and discovering the best stores in
                their area. Share your experiences and help others make informed
                decisions.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {!loading && !user && (
                <Link href="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-6 text-lg"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              )}
              <Link href={user ? getDashboardUrl() : "/login"}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                    {user ? (
                      <>
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        Dashboard
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="pt-12 grid grid-cols-3 gap-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                { value: statsLoading ? "..." : stats.totalStores.toString(), label: "Stores Listed" },
                { value: statsLoading ? "..." : stats.totalUsers.toString(), label: "Active Users" },
                { value: statsLoading ? "..." : stats.totalRatings.toString(), label: "Reviews" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose RateStore?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Everything you need to discover and rate stores
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Easy Discovery",
                description:
                  "Search and discover stores by name and location with detailed information and ratings.",
                color: "indigo",
              },
              {
                icon: Star,
                title: "Rate & Review",
                description:
                  "Share your honest opinions with a 5-star rating system and help others make informed decisions.",
                color: "blue",
              },
              {
                icon: Users,
                title: "Community Driven",
                description:
                  "Join a vibrant community of reviewers and benefit from authentic experiences shared by real users.",
                color: "purple",
              },
              {
                icon: TrendingUp,
                title: "Analytics & Stats",
                description:
                  "View detailed statistics about ratings, trends, and store performance metrics.",
                color: "green",
              },
              {
                icon: Shield,
                title: "Secure & Safe",
                description:
                  "Your data is protected with industry-standard security and privacy measures.",
                color: "yellow",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Experience blazingly fast search and navigation with our optimized platform.",
                color: "red",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              const colorMap: Record<string, string> = {
                indigo: "indigo-100 dark:indigo-900/30 text-indigo-600 dark:text-indigo-400",
                blue: "blue-100 dark:blue-900/30 text-blue-600 dark:text-blue-400",
                purple: "purple-100 dark:purple-900/30 text-purple-600 dark:text-purple-400",
                green: "green-100 dark:green-900/30 text-green-600 dark:text-green-400",
                yellow: "yellow-100 dark:yellow-900/30 text-yellow-600 dark:text-yellow-400",
                red: "red-100 dark:red-900/30 text-red-600 dark:text-red-400",
              };

              return (
                <StaggerItem key={index}>
                  <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                    <Card className="p-8 hover:shadow-lg dark:hover:shadow-lg/50 transition-shadow border-0 bg-white dark:bg-gray-800 h-full cursor-pointer glassmorphism-light">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorMap[feature.color]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </Card>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Get started in just three simple steps
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: 1,
                title: "Create Account",
                description: "Sign up with your email and password. Secure and quick registration process.",
                gradient: "from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500",
              },
              {
                step: 2,
                title: "Browse Stores",
                description: "Explore stores in your area, view ratings, and read reviews from other users.",
                gradient: "from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500",
              },
              {
                step: 3,
                title: "Rate & Share",
                description: "Share your experience with a star rating and help guide the community.",
                gradient: "from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500",
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                  <div className="relative">
                    <div className="flex flex-col items-center text-center glassmorphism-card p-8">
                      <motion.div
                        className={`bg-gradient-to-r ${item.gradient} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6`}
                        whileInView={{ scale: [0.8, 1.2, 1], rotate: [0, 360, 360] }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        {item.step}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                For Everyone
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Different roles for different needs
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Regular User",
                color: "blue",
                borderColor: "border-blue-200 dark:border-blue-900/30",
                bgColor: "from-blue-50 dark:from-blue-900/10 to-white dark:to-gray-800",
                features: [
                  "Browse and discover stores",
                  "Rate and review stores",
                  "View store details",
                  "Manage your profile",
                ],
              },
              {
                icon: Store,
                title: "Store Owner",
                color: "green",
                borderColor: "border-green-200 dark:border-green-900/30",
                bgColor: "from-green-50 dark:from-green-900/10 to-white dark:to-gray-800",
                features: [
                  "View store dashboard",
                  "Track all ratings",
                  "View performance stats",
                  "Respond to reviews",
                ],
                featured: true,
              },
              {
                icon: Shield,
                title: "Administrator",
                color: "purple",
                borderColor: "border-purple-200 dark:border-purple-900/30",
                bgColor: "from-purple-50 dark:from-purple-900/10 to-white dark:to-gray-800",
                features: [
                  "Manage all users",
                  "Manage all stores",
                  "View system analytics",
                  "Maintain platform",
                ],
              },
            ].map((role, index) => {
              const Icon = role.icon;
              const colorMap: Record<string, string> = {
                blue: "bg-blue-600 dark:bg-blue-500",
                green: "bg-green-600 dark:bg-green-500",
                purple: "bg-purple-600 dark:bg-purple-500",
              };
              const textColorMap: Record<string, string> = {
                blue: "text-blue-600 dark:text-blue-400",
                green: "text-green-600 dark:text-green-400",
                purple: "text-purple-600 dark:text-purple-400",
              };

              return (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ y: role.featured ? -10 : -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`p-8 border-2 bg-gradient-to-br ${role.bgColor} ${
                        role.featured
                          ? `${role.borderColor} md:scale-105 md:shadow-xl dark:md:shadow-lg/50`
                          : role.borderColor
                      } cursor-pointer transition-all`}
                    >
                      <div className={`${colorMap[role.color]} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {role.title}
                      </h3>
                      <ul className="space-y-3">
                        {role.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <Check className={`h-5 w-5 ${textColorMap[role.color]} flex-shrink-0 mt-0.5`} />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 transition-colors duration-300">
        <AnimatedSection className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Join the Community?
          </motion.h2>
          <motion.p
            className="text-xl text-indigo-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Start rating stores and discover the best places in your area today.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                >
                  Create Free Account
                </Button>
              </motion.div>
            </Link>
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white/20 border border-white text-white hover:bg-white/30 px-8 py-6 text-lg font-semibold"
                >
                  Already have an account?
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid md:grid-cols-4 gap-8 mb-8">
            <StaggerItem>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-lg">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-white text-lg">RateStore</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">
                Discover and rate your favorite stores.
              </p>
            </StaggerItem>

            <StaggerItem>
              <h4 className="font-semibold text-white dark:text-gray-200 mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm">
                {["Features", "Pricing", "Security"].map((item, idx) => (
                  <li key={idx}>
                    <motion.a
                      href="#"
                      className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            <StaggerItem>
              <h4 className="font-semibold text-white dark:text-gray-200 mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                {["About", "Blog", "Contact"].map((item, idx) => (
                  <li key={idx}>
                    <motion.a
                      href="#"
                      className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            <StaggerItem>
              <h4 className="font-semibold text-white dark:text-gray-200 mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                {["Privacy Policy", "Terms of Service"].map((item, idx) => (
                  <li key={idx}>
                    <motion.a
                      href="#"
                      className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          </StaggerContainer>

          <motion.div
            className="border-t border-gray-800 dark:border-gray-700 pt-8 text-center text-sm text-gray-400 dark:text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-4">
              <div className="flex items-center gap-4">
                <motion.a
                  href="https://github.com/Mohanbirajdar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/mohan-birajdar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </motion.a>
                <motion.a
                  href="https://x.com/MohanBirajdar31"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sky-400 transition-colors duration-300"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </motion.a>
              </div>
            </div>
            <p className="mb-2">&copy; 2026 RateStore. All rights reserved.</p>
            <p className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-600">
              Made with <span className="text-red-500 animate-pulse">❤️</span> by{" "}
              <motion.a
                href="https://mohanbirajdar.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Mohan Birajdar
              </motion.a>
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
