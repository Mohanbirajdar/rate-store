"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Mail, Star, Search, Filter, X, Store, ArrowUpDown } from "lucide-react";
import Link from "next/link";

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: string;
  _count?: {
    ratings: number;
  };
  averageRating?: number;
}

export default function UserStoresPage() {
  const { user, loading: authLoading } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const searchSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/api/stores");
        if (!response.ok) throw new Error("Failed to fetch stores");
        const data = await response.json();
        setStores(data.stores || []);
        setFilteredStores(data.stores || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stores");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchStores();
    }
  }, [authLoading]);

  // Filter and sort stores
  useEffect(() => {
    let filtered = stores;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((store) =>
        store.name.toLowerCase().includes(searchLower) ||
        store.email.toLowerCase().includes(searchLower) ||
        store.address.toLowerCase().includes(searchLower)
      );
    }

    // Rating filter
    if (filterRating !== null) {
      filtered = filtered.filter((store) =>
        store.averageRating && store.averageRating >= filterRating
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rating-high":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "rating-low":
          return (a.averageRating || 0) - (b.averageRating || 0);
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredStores(sorted);
  }, [searchTerm, filterRating, sortBy, stores]);

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRating(null);
    setSortBy("newest");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center animate-in fade-in duration-500">
          <div className="relative inline-block">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-indigo-600 opacity-20"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse font-medium">Discovering amazing stores...</p>
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
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-in zoom-in duration-500">
              <Store className="h-12 w-12 sm:h-16 sm:w-16" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: '100ms'}}>
              Discover Amazing Stores
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: '200ms'}}>
              Browse, search, and rate local stores in your area. Your reviews help others make better choices!
            </p>
            
            {/* Quick Stats */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: '300ms'}}>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-2xl sm:text-3xl font-bold">{stores.length}</div>
                <div className="text-xs sm:text-sm text-indigo-100">Total Stores</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-2xl sm:text-3xl font-bold">{filteredStores.length}</div>
                <div className="text-xs sm:text-sm text-indigo-100">Showing Now</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 sm:h-16 text-white dark:text-slate-950" preserveAspectRatio="none" viewBox="0 0 1440 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 22L60 24.3C120 26.7 240 31.3 360 28.8C480 26.3 600 16.7 720 13.5C840 10.3 960 13.7 1080 18.8C1200 24 1320 31 1380 34.7L1440 38.3V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error && (
          <div className="mb-6 p-4 border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-xl animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                <X className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Search & Filter Section */}
        <div ref={searchSectionRef} className="mb-6 sm:mb-8 space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
          {/* Search Bar - Prominent */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              type="text"
              placeholder="Search stores by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-12 h-14 text-base border-2 border-gray-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-slate-900 dark:text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110 animate-in zoom-in duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filter Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Rating Filter */}
            <div className="flex-1 w-full sm:w-auto">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
                <Filter className="h-3.5 w-3.5" />
                Rating Filter
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((rating, index) => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 text-sm font-medium animate-in fade-in zoom-in ${
                      filterRating === rating
                        ? "bg-indigo-600 text-white shadow-lg scale-105 ring-2 ring-indigo-300 dark:ring-indigo-800"
                        : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-700 hover:scale-105 hover:shadow-md"
                    }`}
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                    <Star className={`h-3.5 w-3.5 transition-all ${filterRating === rating ? "fill-white" : "fill-yellow-400"}`} />
                    <span>{rating}+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="w-full sm:w-auto">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-52 px-4 py-2 rounded-full border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm font-medium focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 cursor-pointer transition-all duration-300 hover:shadow-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="rating-high">Top Rated</option>
                <option value="rating-low">Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filters & Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Showing <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{filteredStores.length}</span> of <span className="font-semibold">{stores.length}</span> stores
              </p>
              {(searchTerm || filterRating !== null) && (
                <div className="flex flex-wrap items-center gap-2">
                  {searchTerm && (
                    <Badge className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 animate-in zoom-in duration-200">
                      "{searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}"
                    </Badge>
                  )}
                  {filterRating !== null && (
                    <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 animate-in zoom-in duration-200" style={{animationDelay: '50ms'}}>
                      {filterRating}+ ⭐
                    </Badge>
                  )}
                </div>
              )}
            </div>
            {(searchTerm || filterRating !== null) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:scale-105 animate-in zoom-in duration-200"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-16 px-4 animate-in fade-in zoom-in duration-500">
            <div className="text-7xl mb-6 animate-bounce">
              {searchTerm || filterRating !== null ? "🔍" : "🏪"}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 animate-in slide-in-from-bottom duration-500">
              {searchTerm || filterRating !== null ? "No stores found" : "No stores available"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto animate-in slide-in-from-bottom duration-500" style={{animationDelay: '100ms'}}>
              {searchTerm || filterRating !== null 
                ? "Try adjusting your search or filter criteria to find what you're looking for." 
                : "Check back later for new stores in your area!"}
            </p>
            {(searchTerm || filterRating !== null) && (
              <Button onClick={clearFilters} className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl animate-in zoom-in duration-300" style={{animationDelay: '200ms'}}>
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredStores.map((store, index) => (
              <Card 
                key={store.id} 
                className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl dark:hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 animate-in fade-in slide-in-from-bottom"
                style={{animationDelay: `${index * 50}ms`, animationDuration: '500ms'}}
              >
                {/* Animated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
                
                {/* Decorative Icon */}
                <div className="absolute top-2 right-2 text-4xl sm:text-5xl opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300 pointer-events-none">
                  <Store className="h-16 w-16 text-gray-400" />
                </div>
                
                <CardHeader className="relative z-10 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Store className="h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="truncate">{store.name}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate">{store.email}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50 text-xs group-hover:scale-110 transition-transform duration-300">
                      <Star className="h-3 w-3 mr-1 fill-yellow-500 group-hover:rotate-12 transition-transform" />
                      {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 relative z-10 pt-0">
                  <div className="flex items-start gap-2 group/address">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400 mt-0.5 group-hover/address:scale-110 group-hover/address:text-green-500 transition-all" />
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{store.address}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400" />
                      <span className="whitespace-nowrap">{store._count?.ratings || 0} reviews</span>
                    </span>
                    <span className="text-xs truncate ml-2">
                      {new Date(store.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                    <Link href={`/user/stores/${store.id}`}>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        <span className="group-hover:hidden">View & Rate</span>
                        <span className="hidden group-hover:inline">Explore Store →</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
