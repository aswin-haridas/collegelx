"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/shared/lib/supabase";
import { styles } from "@/shared/lib/styles";
import { playfair } from "@/shared/lib/fonts";
import {
  UserCircle,
  ShoppingBag,
  MessageCircle,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/app/auth/hooks/useAuth";
import Header from "@/shared/components/Header";
import { Item } from "@/shared/lib/types";
import { useLoginCheck } from "@/shared/hooks/useLoginCheck";

const Home = () => {
  useLoginCheck();

  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("status", "available")
          .limit(4)
          .order("created_at", { ascending: false });

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

  const renderFeatureCard = (
    icon: React.ReactNode,
    title: string,
    description: string,
  ) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="bg-amber-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="bg-gradient-to-r from-amber-50 to-amber-100 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1
              className={`text-4xl md:text-5xl font-bold mb-4 ${playfair.className}`}
              style={{ color: styles.warmPrimaryDark }}
            >
              CollegeLX Marketplace
            </h1>
            <p className="text-lg mb-8 text-gray-700">
              Buy and sell college essentials - from textbooks and notes to
              uniforms and stationery.
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

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2
              className={`text-2xl md:text-3xl font-semibold ${playfair.className}`}
              style={{ color: styles.warmPrimaryDark }}
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
                <Link href={`/buy/${item.id}`} key={item.id}>
                  <div className="border border-stone-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="relative h-44 bg-gray-100">
                      {featuredItems.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3
                        className="font-medium text-lg mb-2"
                        style={{ color: styles.warmText }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-2 text-sm flex-grow line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span
                          className="font-bold"
                          style={{ color: styles.warmText }}
                        >
                          ₹{item.price.toFixed(2)}
                        </span>
                        {item.category && (
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-amber-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-2xl md:text-3xl font-semibold text-center mb-12 ${playfair.className}`}
            style={{ color: styles.warmPrimaryDark }}
          >
            Why Choose CollegeLX?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {renderFeatureCard(
              <ShoppingBag className="h-8 w-8 text-amber-600" />,
              "Campus-Focused Marketplace",
              "Buy and sell items specifically relevant to your college experience.",
            )}

            {renderFeatureCard(
              <MessageCircle className="h-8 w-8 text-amber-600" />,
              "Direct Communication",
              "Message sellers directly to negotiate prices or ask questions.",
            )}

            {renderFeatureCard(
              <UserCircle className="h-8 w-8 text-amber-600" />,
              "Verified College Users",
              "A safe community of verified students for secure transactions.",
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
