"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { playfair } from "@/lib/fonts";
import {
  UserCircle,
  ShoppingBag,
  MessageCircle,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Item } from "@/lib/types";
import ItemCard from "@/components/ItemCard";
import "@/app/styles.css";

const Home = () => {
  const router = useRouter();
  const { isAuthenticated, userId } = useAuth();
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured items on page load
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("status", "available")
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;
        setFeaturedItems(data || []);
      } catch (error) {
        console.error("Error fetching featured items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-amber-100 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1
              className={`text-4xl md:text-5xl font-bold mb-4 ${playfair.className} warmPrimaryDark`}
            >
              CollegeLX Marketplace
            </h1>
            <p className="text-lg mb-8 text-gray-700">
              Buy and sell college essentials - from textbooks and notes to
              uniforms and stationery. Connect with fellow students and find
              everything you need for your academic journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/products")}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center justify-center"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Products
              </button>
              <button
                onClick={() =>
                  router.push(isAuthenticated ? "/sell" : "/login")
                }
                className="px-6 py-3 border-2 border-amber-600 text-amber-700 rounded-lg hover:bg-amber-50 transition flex items-center justify-center"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Sell Product
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2
              className={`text-2xl md:text-3xl font-semibold ${playfair.className} warmPrimaryDark`}
            >
              Featured Items
            </h2>
            <Link
              href="/products"
              className="flex items-center text-amber-600 hover:text-amber-700 transition"
            >
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-4 h-64 animate-pulse"
                >
                  <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : featuredItems.length === 0 ? (
            <p className="text-center text-gray-500">
              No featured items available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="bg-amber-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-2xl md:text-3xl font-semibold text-center mb-12 ${playfair.className} warmPrimaryDark`}
          >
            Why Choose CollegeLX?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-amber-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Campus-Focused Marketplace
              </h3>
              <p className="text-gray-600">
                Buy and sell items specifically relevant to your college
                experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-amber-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Direct Communication
              </h3>
              <p className="text-gray-600">
                Message sellers directly to negotiate prices or ask questions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-amber-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <UserCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Verified College Users
              </h3>
              <p className="text-gray-600">
                A safe community of verified students for secure transactions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
