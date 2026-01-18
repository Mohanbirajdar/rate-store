"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";

export default function StoreRatingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  type Rating = {
    id: string;
    value: number;
    user: {
      name: string;
      email: string;
      address?: string;
    };
    createdAt: string;
  };
  type StoreData = {
    id: string;
    name: string;
    email: string;
    address: string;
    _count?: { ratings: number };
    averageRating?: number;
    ratings?: Rating[];
  };
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [filteredRatings, setFilteredRatings] = useState<Rating[]>([]);

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <span className="text-lg text-indigo-600">Loading...</span>
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
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8">
          <input
            type="text"
            placeholder="Search by name, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 h-12 text-base border-2 border-indigo-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-slate-900 dark:text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          />
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
        {filteredRatings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRatings.map((rating) => (
              <Card key={rating.id} className="border-none bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 shadow-xl rounded-2xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 group relative overflow-hidden hover:-translate-y-1">
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
