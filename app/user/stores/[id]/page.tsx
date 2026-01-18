"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Mail, Star, ArrowLeft, AlertCircle, Store, User, TrendingUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface StoreDetail {
  id: string;
  name: string;
  email: string;
  address: string;
  owner: {
    name: string;
  };
  _count: {
    ratings: number;
  };
  averageRating: number;
  userRating?: number;
}

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const storeId = params.id as string;
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchStoreDetail = async () => {
      try {
        const response = await fetch(`/api/stores/${storeId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch store details");
        }
        const data = await response.json();
        setStore(data.store);
        if (data.store.userRating) {
          setSelectedRating(data.store.userRating);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load store");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && storeId) {
      fetchStoreDetail();
    }
  }, [authLoading, storeId]);

  const handleSubmitRating = async () => {
    if (!selectedRating || !user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          value: selectedRating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);

      // Refresh store data
      const updatedResponse = await fetch(`/api/stores/${storeId}`);
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setStore(data.store);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading store details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in duration-500">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Oops! Something went wrong</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link href="/user/stores">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stores
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in duration-500">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Store Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The store you're looking for doesn't exist or has been removed.</p>
          <Link href="/user/stores">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse All Stores
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Animated Hero Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <Link 
            href="/user/stores" 
            className="inline-flex items-center gap-2 mb-4 sm:mb-6 text-white/80 hover:text-white transition-all duration-300 hover:gap-3 group text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to All Stores</span>
          </Link>
          
          <div className="flex flex-col gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex-1">
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl flex-shrink-0">
                  <Store className="h-5 w-5 sm:h-8 sm:w-8" />
                </div>
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight break-words">{store.name}</h1>
              </div>
              <p className="text-indigo-100 text-xs sm:text-sm md:text-base ml-9 sm:ml-0">Managed by {store.owner.name}</p>
            </div>
            
            {/* Quick Stats Badge */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:flex sm:flex-row">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-center border border-white/20">
                <div className="flex items-center gap-1 sm:gap-2 justify-center mb-1">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-300 text-yellow-300 flex-shrink-0" />
                  <span className="text-xl sm:text-2xl font-bold">{store.averageRating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-indigo-100 whitespace-nowrap">Average Rating</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-center border border-white/20">
                <div className="flex items-center gap-1 sm:gap-2 justify-center mb-1">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-xl sm:text-2xl font-bold">{store._count.ratings}</span>
                </div>
                <p className="text-xs text-indigo-100 whitespace-nowrap">Total Reviews</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8 sm:h-12 text-white dark:text-slate-950" preserveAspectRatio="none" viewBox="0 0 1440 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 22L60 24.3C120 26.7 240 31.3 360 28.8C480 26.3 600 16.7 720 13.5C840 10.3 960 13.7 1080 18.8C1200 24 1320 31 1380 34.7L1440 38.3V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Store Information - Left Side */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-left duration-700">
            
            {/* Store Details */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex-shrink-0">
                  <Store className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-base sm:text-lg md:text-xl">Store Information</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                {/* Email */}
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-900/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 group">
                  <div className="p-1.5 sm:p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white break-all">{store.email}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-900/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 group">
                  <div className="p-1.5 sm:p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{store.address}</p>
                  </div>
                </div>

                {/* Owner */}
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-900/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 group">
                  <div className="p-1.5 sm:p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Store Owner</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{store.owner.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rating Status */}
            {store.userRating && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h3 className="text-sm sm:text-base font-bold text-blue-900 dark:text-blue-100">You've Rated This Store!</h3>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300">Your rating:</p>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-300 dark:border-blue-700 w-fit">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                          i < store.userRating!
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                        }`}
                      />
                    ))}
                    <span className="ml-1 sm:ml-2 text-sm sm:text-base font-bold text-gray-900 dark:text-white">{store.userRating}/5</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rating Submission - Right Sidebar */}
          <div className="animate-in fade-in slide-in-from-right duration-700">
            <div className="lg:sticky lg:top-6 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-3 sm:mb-4">
                    <Star className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {store.userRating ? "Change Rating" : "Rate This Store"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {store.userRating ? "Update your rating anytime" : "Share your experience with others"}
                  </p>
                </div>

                {/* Success Alert */}
                {submitSuccess && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-lg sm:rounded-xl animate-in fade-in slide-in-from-top duration-300">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <p className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">
                        Rating submitted successfully!
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                {/* Star Rating Selection */}
                <div className="mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 text-center">
                    How would you rate this store?
                  </p>
                  <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        onMouseEnter={() => setHoveredRating(rating)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="group relative"
                      >
                        <div className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                          selectedRating === rating
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500 scale-110 shadow-lg"
                            : (hoveredRating && rating <= hoveredRating)
                            ? "bg-yellow-100 dark:bg-yellow-900/30 scale-105"
                            : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700"
                        }`}>
                          <Star
                            className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 transition-all duration-300 ${
                              selectedRating === rating
                                ? "fill-white text-white"
                                : (hoveredRating && rating <= hoveredRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
                            }`}
                          />
                        </div>
                        {/* Rating Number Tooltip */}
                        <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{rating}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Rating Display */}
                {selectedRating && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg sm:rounded-xl border border-indigo-200 dark:border-indigo-800 animate-in fade-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Your rating:</span>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                              i < selectedRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">{selectedRating}/5</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitRating}
                  disabled={!selectedRating || isSubmitting || !user}
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : store.userRating ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Change Rating
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4 sm:h-5 sm:w-5 fill-white" />
                      Submit Rating
                    </>
                  )}
                </Button>

                {!user && (
                  <p className="mt-3 sm:mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                    Please log in to submit a rating
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
