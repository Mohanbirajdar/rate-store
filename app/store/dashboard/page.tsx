"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Store, Star, Users, TrendingUp } from "lucide-react";
type StoreData = {
  id: string;
  name: string;
  email: string;
  address: string;
  _count?: {
    ratings: number;
  };
  averageRating?: number;
  ratings?: Array<{
    id: string;
    value: number;
    user: {
      name: string;
      email: string;
      address?: string;
    };
    createdAt: string;
  }>;
};

export default function StoreOwnerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [filteredRatings, setFilteredRatings] = useState<any[]>([]);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // Client-side auth protection
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login");
        return;
      }
      if (user.role !== "STORE_OWNER") {
        router.replace("/unauthorized");
        return;
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchStore = async () => {
      // Don't fetch if not authenticated as store owner
      if (!user || user.role !== "STORE_OWNER") {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch("/api/store/info");
        if (response.ok) {
          const data = await response.json();
          setStore(data.store);
        } else if (response.status === 401 || response.status === 403) {
          router.replace("/unauthorized");
          return;
        } else {
          setError("Failed to load store information");
        }
      } catch (err) {
        setError("Error loading store data");
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && user) {
      fetchStore();
    }
  }, [authLoading, user, router]);

  // Filter and sort ratings
  useEffect(() => {
    if (!store?.ratings) {
      setFilteredRatings([]);
      return;
    }
    let filtered = store.ratings;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((rating) =>
        rating.user.name.toLowerCase().includes(searchLower) ||
        rating.user.email.toLowerCase().includes(searchLower) ||
        (rating.user.address && rating.user.address.toLowerCase().includes(searchLower))
      );
    }
    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating-asc":
          return a.value - b.value;
        case "rating-desc":
          return b.value - a.value;
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "latest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    setFilteredRatings(sorted);
  }, [searchTerm, sortBy, store]);

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-500 flex flex-col">
      {/* Animated Hero Header */}
      <div className="relative text-white overflow-hidden shadow-xl rounded-b-3xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-in zoom-in duration-500 shadow-lg">
              <Store className="h-12 w-12 sm:h-16 sm:w-16" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 tracking-tight" style={{animationDelay: '100ms'}}>
              Store Owner Dashboard
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: '200ms'}}>
              Welcome, {user?.name}. View your store's performance, ratings, and customer feedback in one place!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: '300ms'}}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-5 border border-white/20 shadow-md">
                <div className="text-3xl sm:text-4xl font-extrabold">{store?._count?.ratings || 0}</div>
                <div className="text-sm sm:text-base text-indigo-100">Total Ratings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-5 border border-white/20 shadow-md">
                <div className="text-3xl sm:text-4xl font-extrabold">{store?.averageRating ? store.averageRating.toFixed(2) : 'N/A'}</div>
                <div className="text-sm sm:text-base text-indigo-100">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 sm:h-16 text-white dark:text-slate-950" preserveAspectRatio="none" viewBox="0 0 1440 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 22L60 24.3C120 26.7 240 31.3 360 28.8C480 26.3 600 16.7 720 13.5C840 10.3 960 13.7 1080 18.8C1200 24 1320 31 1380 34.7L1440 38.3V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full">
        {store && (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom duration-700">
            <Card className="border-none bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 shadow-2xl rounded-3xl">
              <CardHeader>
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl text-gray-900 dark:text-white flex items-center gap-3 font-bold">
                      <Store className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                      {store.name}
                    </CardTitle>
                    <CardDescription className="mt-2 space-y-1 text-gray-600 dark:text-gray-400 text-base">
                      <p><span className="font-semibold">Email:</span> {store.email}</p>
                      <p><span className="font-semibold">Address:</span> {store.address}</p>
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-2 rounded-xl shadow-md bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-900">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    {store.averageRating ? store.averageRating.toFixed(2) : "N/A"}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Search & Filter Section - Combined Bar */}
        <div ref={searchSectionRef} className="mb-8 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-indigo-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-12 h-12 text-base border-2 border-indigo-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-slate-900 dark:text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z' /></svg>
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all duration-300 hover:scale-110 text-xl"
                  aria-label="Clear search"
                >
                  &#10005;
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mr-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-full border-2 border-indigo-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-base font-semibold focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 cursor-pointer transition-all duration-300 hover:shadow-lg"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating-asc">Rating Ascending</option>
                <option value="rating-desc">Rating Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* All Ratings Grid */}
        {filteredRatings.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">All Users Who Rated Your Store</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-700">
              {filteredRatings.map((rating, idx) => (
                <Card key={rating.id} className="border-none bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 shadow-xl rounded-2xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 animate-in fade-in slide-in-from-bottom" style={{animationDelay: `${idx * 50}ms`, animationDuration: '500ms'}}>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                  <div className="absolute top-2 right-2 text-4xl sm:text-5xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300 pointer-events-none">
                    <Star className="h-16 w-16 text-yellow-400" />
                  </div>
                  <CardHeader className="relative z-10 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white flex items-center gap-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 font-semibold">
                          <Users className="h-5 w-5 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                          <span className="truncate">{rating.user.name}</span>
                        </CardTitle>
                        <CardDescription className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <span className="truncate"><span className="font-semibold">Email:</span> {rating.user.email}</span>
                          {rating.user.address && <span className="truncate"><span className="font-semibold">Address:</span> {rating.user.address}</span>}
                          <span className="truncate"><span className="font-semibold">Date:</span> {new Date(rating.createdAt).toLocaleDateString()}</span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0 bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-900 border-none text-base px-3 py-2 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 font-semibold">
                        <Star className="h-4 w-4 mr-2 fill-yellow-500 group-hover:rotate-12 transition-transform" />
                        {rating.value}/5
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 px-4 animate-in fade-in zoom-in duration-500">
            <div className="text-8xl mb-8 animate-bounce">🏪</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 animate-in slide-in-from-bottom duration-500">
              No ratings yet
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto animate-in slide-in-from-bottom duration-500" style={{animationDelay: '100ms'}}>
              Your store has not received any ratings yet. Encourage your customers to leave feedback!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
