"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useItem } from "@/lib/hooks/useItem";
import { useSeller } from "@/lib/hooks/useSeller";
import { styles } from "@/lib/styles";
import Header from "@/components/Sidebar";
import { ItemDetails } from "@/components/ItemDetails";
import { Loader2 } from "lucide-react";

export default function ItemPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth(false);
  const router = useRouter();
  const {
    item,
    loading: itemLoading,
    error: itemError,
  } = useItem(params.id, true); // Add approved parameter
  const { seller, loading: sellerLoading } = useSeller(item?.seller_id);

  const loading = authLoading || itemLoading || sellerLoading;

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      router.push(
        `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (item && seller) {
      router.push(`/chat?listing=${item.id}&seller=${seller.userid}`);
    }
  };

  if (loading) {
    return (
      <div className="h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="flex justify-center items-center h-full ml-64">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: styles.warmPrimary }}
          />
        </div>
      </div>
    );
  }

  if (itemError || !item || !seller) {
    return (
      <div className="h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="flex justify-center items-center h-full ml-64">
          <div className="text-center">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: styles.warmText }}
            >
              Item not found
            </h2>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: styles.warmPrimary }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header activeTextColor={styles.warmPrimary} />
      <div className="max-w-4xl mx-auto p-4 ml-64">
        <ItemDetails
          item={item}
          seller={seller}
          onContactSeller={handleContactSeller}
        />
      </div>
    </div>
  );
}
