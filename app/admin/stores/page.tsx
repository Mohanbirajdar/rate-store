"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Search, MapPin, Star, TrendingUp, Mail, Plus, Store as StoreIcon } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
}

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating?: number;
  user?: User;
  _count?: {
    ratings: number;
  };
}

export default function AdminStoresPage() {
  const { user, loading: authLoading } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addStoreForm, setAddStoreForm] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
    ownerAddress: "",
    storeName: "",
    storeEmail: "",
    storeAddress: "",
  });
  const [addingStore, setAddingStore] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/api/admin/stores");
        if (response.ok) {
          const data = await response.json();
          setStores(data.stores);
        }
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchStores();
    }
  }, [authLoading]);

  useEffect(() => {
    const filtered = stores.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [searchTerm, stores]);

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingStore(true);
    setAddError("");
    setAddSuccess("");

    try {
      const response = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addStoreForm),
      });

      const data = await response.json();

      if (response.ok) {
        setAddSuccess("Store created successfully!");
        setStores([data.store, ...stores]);
        setAddStoreForm({
          ownerName: "",
          ownerEmail: "",
          ownerPassword: "",
          ownerAddress: "",
          storeName: "",
          storeEmail: "",
          storeAddress: "",
        });
        setTimeout(() => {
          setShowAddDialog(false);
          setAddSuccess("");
        }, 1500);
      } else {
        setAddError(data.error || "Failed to create store");
      }
    } catch (error) {
      setAddError("An error occurred. Please try again.");
    } finally {
      setAddingStore(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 dark:text-green-400" />
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 bg-teal-600 dark:bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse [animation-delay:1s]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl sm:text-5xl animate-bounce">🏬</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  Manage Stores
                </h1>
              </div>
              <p className="text-green-100 dark:text-emerald-200 text-sm sm:text-base">
                View and manage all stores in the system
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
              <p className="text-green-100 text-xs sm:text-sm font-medium">Total Stores</p>
              <p className="text-white text-xl sm:text-2xl font-bold">{stores.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/20 transition-all">
              <p className="text-green-100 text-xs sm:text-sm font-medium">Filtered</p>
              <p className="text-white text-xl sm:text-2xl font-bold">{filteredStores.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/20 transition-all">
              <p className="text-green-100 text-xs sm:text-sm font-medium">Avg Rating</p>
              <p className="text-white text-xl sm:text-2xl font-bold">
                {stores.length > 0 ? (stores.reduce((acc, s) => acc + (s.averageRating || 0), 0) / stores.length).toFixed(1) : "N/A"}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/20 transition-all">
              <p className="text-green-100 text-xs sm:text-sm font-medium">Total Reviews</p>
              <p className="text-white text-xl sm:text-2xl font-bold">
                {stores.reduce((acc, s) => acc + (s._count?.ratings || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-green-50 dark:fill-slate-950"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Search Bar with Add Button */}
        <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-green-200 dark:border-green-800 shadow-lg animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
              Search Stores
            </h3>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 hover:scale-105 transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Store
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <StoreIcon className="h-5 w-5 text-green-600" />
                    Create New Store & Owner
                  </DialogTitle>
                  <DialogDescription>
                    Add a new store with owner account. Fill in all required fields.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStore} className="space-y-4">
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
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Owner Information</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="ownerName">Owner Name *</Label>
                        <Input
                          id="ownerName"
                          value={addStoreForm.ownerName}
                          onChange={(e) => setAddStoreForm({ ...addStoreForm, ownerName: e.target.value })}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ownerEmail">Owner Email *</Label>
                        <Input
                          id="ownerEmail"
                          type="email"
                          value={addStoreForm.ownerEmail}
                          onChange={(e) => setAddStoreForm({ ...addStoreForm, ownerEmail: e.target.value })}
                          required
                          placeholder="owner@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ownerPassword">Owner Password *</Label>
                        <Input
                          id="ownerPassword"
                          type="password"
                          value={addStoreForm.ownerPassword}
                          onChange={(e) => setAddStoreForm({ ...addStoreForm, ownerPassword: e.target.value })}
                          required
                          placeholder="Min 6 characters"
                          minLength={6}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ownerAddress">Owner Address *</Label>
                        <Input
                          id="ownerAddress"
                          value={addStoreForm.ownerAddress}
                          onChange={(e) => setAddStoreForm({ ...addStoreForm, ownerAddress: e.target.value })}
                          required
                          placeholder="123 Main St, City"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Store Information</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="storeName">Store Name *</Label>
                        <Input
                          id="storeName"
                          value={addStoreForm.storeName}
                          onChange={(e) => setAddStoreForm({ ...addStoreForm, storeName: e.target.value })}
                          required
                          placeholder="My Store"
                        />
                      </div>
                      <div>
                        <Label htmlFor="storeEmail">Store Email *</Label>
                        <Input
                          id="storeEmail"
                          type="email"
                          value={addStoreForm.storeEmail}
                          onChange={(e) => setAddStoreForm({ ...addStoreForm, storeEmail: e.target.value })}
                          required
                          placeholder="store@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="storeAddress">Store Address *</Label>
                        <Input
                          id="storeAddress"
                          value={addStoreForm.storeAddress}
                          onChange={(e) => setAddStoreForm({ ...addStoreForm, storeAddress: e.target.value })}
                          required
                          placeholder="456 Store St, City"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={addingStore}
                  >
                    {addingStore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Store & Owner
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative group">
            <Search className="h-5 w-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 absolute mt-3 ml-3 transition-colors z-10" />
            <Input
              placeholder="Search by store name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-green-400 dark:focus:border-green-600 transition-all"
            />
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.length === 0 ? (
            <div className="col-span-full text-center py-16 animate-in fade-in zoom-in duration-500">
              <div className="text-6xl mb-4 animate-bounce">🏪</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No stores found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredStores.map((store, index) => (
              <div 
                key={store.id} 
                className="rounded-2xl bg-white dark:bg-slate-900 hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 dark:border-slate-800 hover:border-green-400 dark:hover:border-green-600 overflow-hidden group hover:scale-105 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${100 + index * 50}ms` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-emerald-600/0 group-hover:from-green-600/10 group-hover:to-emerald-600/20 transition-all duration-300 pointer-events-none"></div>
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {store.name}
                    </h3>
                    <div className="text-3xl group-hover:scale-110 transition-transform">🏬</div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-500" />
                    {store.email}
                  </p>

                  <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{store.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Rating</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {store.averageRating ? store.averageRating.toFixed(2) : "N/A"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Reviews</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        {store._count?.ratings || 0}
                      </p>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 hover:scale-105 transition-all">
                    View Details →
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
