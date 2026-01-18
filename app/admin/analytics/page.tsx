"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Users, Store, Star, BarChart3, PieChart } from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  averageRating: number;
  userGrowth: number;
  storeGrowth: number;
  ratingGrowth: number;
}

export default function AdminAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Placeholder - implement actual API call
        setAnalytics(null);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchAnalytics();
    }
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-gray-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 dark:from-purple-600/20 dark:to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-4xl">📊</span> Analytics & Insights
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Comprehensive system analytics and insights</p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Users */}
          <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">0</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>No change from last month</span>
              </p>
            </CardContent>
          </Card>

          {/* Total Stores */}
          <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Store className="h-5 w-5 text-green-600 dark:text-green-400" />
                Total Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">0</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>No change from last month</span>
              </p>
            </CardContent>
          </Card>

          {/* Total Ratings */}
          <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                Total Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">0</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>No change from last month</span>
              </p>
            </CardContent>
          </Card>

          {/* Average Rating */}
          <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Avg Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">N/A</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Out of 5 stars</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">User Growth Trend</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <p>Chart placeholder - Implement with your charting library</p>
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Rating Distribution</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <p>Chart placeholder - Implement with your charting library</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Statistics */}
        <Card className="mt-6 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Platform Health</p>
                <div className="flex items-center gap-2">
                  <div className="flex-grow bg-gray-200 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">95%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Data Integrity</p>
                <div className="flex items-center gap-2">
                  <div className="flex-grow bg-gray-200 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "99%" }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">99%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">User Engagement</p>
                <div className="flex items-center gap-2">
                  <div className="flex-grow bg-gray-200 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
