"use client";
import { styles } from "@/lib/styles";
import { Package, MessageSquare, Settings, Heart } from "lucide-react";
import Header from "@/components/shared/Header";
import Image from "next/image";

interface ProfileHeaderProps {
  user: unknown;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileHeader({
  user,
  activeTab,
  setActiveTab,
}: ProfileHeaderProps) {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex items-center p-6">
            <div className="mr-4">
              <Image
                width={96}
                height={96}
                src={
                  user?.profile_image ||
                  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-yellow-800"
              />
            </div>
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{
                  color: styles.text,
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {user?.name}
              </h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`py-3 px-4 font-medium flex items-center ${
                  activeTab === "products"
                    ? "border-b-2 border-yellow-800 text-yellow-800"
                    : "text-gray-500 hover:text-yellow-800"
                }`}
                onClick={() => setActiveTab("products")}
              >
                <Package size={18} className="mr-2" />
                My Products
              </button>
              <button
                className={`py-3 px-4 font-medium flex items-center ${
                  activeTab === "wishlist"
                    ? "border-b-2 border-yellow-800 text-yellow-800"
                    : "text-gray-500 hover:text-yellow-800"
                }`}
                onClick={() => setActiveTab("wishlist")}
              >
                <Heart size={18} className="mr-2" />
                Wishlist
              </button>
              <button
                className={`py-3 px-4 font-medium flex items-center ${
                  activeTab === "reviews"
                    ? "border-b-2 border-yellow-800 text-yellow-800"
                    : "text-gray-500 hover:text-yellow-800"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                <MessageSquare size={18} className="mr-2" />
                Reviews
              </button>
              <button
                className={`py-3 px-4 font-medium flex items-center ${
                  activeTab === "settings"
                    ? "border-b-2 border-yellow-800 text-yellow-800"
                    : "text-gray-500 hover:text-yellow-800"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings size={18} className="mr-2" />
                Account Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
