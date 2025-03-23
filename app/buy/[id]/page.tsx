"use client"
import { playfair } from "@/app/font/fonts";
import { styles } from "@/lib/styles";
import { Item } from "@/lib/types";
import ImageContainer from "./images";

async function getItem(id: string): Promise<Item | null> {
  try {
    // Replace with your actual API endpoint - using server-side fetch
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
}

export default async function BuyPage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id);

  if (!item) {
    return <div className="p-8">Item not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageContainer item={item} />

        {/* Item details section */}
        <div className="space-y-4">
          <h1
            className={`text-3xl font-bold ${playfair.className}`}
            style={{ color: styles.warmText }}
          >
            {item.title}
          </h1>

          <p
            className="text-2xl font-semibold"
            style={{ color: styles.warmPrimary }}
          >
            ₹{(item.price || 0).toFixed(2)}
          </p>

          {item.status && (
            <div className="flex items-center">
              <span
                className={`text-sm px-3 py-1 rounded`}
                style={{
                  backgroundColor:
                    item.status === "available"
                      ? "rgba(184, 110, 84, 0.1)"
                      : item.status === "pending"
                      ? "rgba(216, 140, 101, 0.2)"
                      : "rgba(227, 220, 208, 0.5)",
                  color:
                    item.status === "available"
                      ? styles.warmPrimary
                      : item.status === "pending"
                      ? styles.warmAccentDark
                      : styles.warmText,
                }}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
          )}

          <div
            className="border-t border-b py-4 my-4"
            style={{ borderColor: styles.warmBorder }}
          >
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: styles.warmText }}
            >
              Description
            </h2>
            <p style={{ color: styles.warmText }}>{item.description}</p>
          </div>

          <button
            className="w-full py-3 px-4 rounded font-semibold text-white"
            style={{ backgroundColor: styles.warmPrimary }}
          >
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
}
