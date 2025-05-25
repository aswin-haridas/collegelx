import { useState } from "react";
import Image from "next/image";
import { styles } from "@/lib/styles";
import Link from "next/link";
import { items } from "@/types/item";

export default function ItemCard({ item }: { item: items }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Get the first image URL or use the legacy imageUrl property
  const displayImage = item.images?.[0] ?? "/images/placeholder.png";

  return (
    <Link href={`/buy/${item.id}`} className="block h-full">
      <div
        className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col"
        style={{ borderColor: styles.primary_dark, backgroundColor: "white" }}
      >
        <div className="relative h-48 bg-gray-100">
          {!imageError ? (
            <Image
              src={displayImage}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "cover",
              }}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-sm">Image not available</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3
            className="font-medium text-lg mb-2"
            style={{ color: styles.primary }}
          >
            {item.name}
          </h3>
          <p className="text-gray-600 mb-2 text-sm flex-grow">
            {item.description.length > 100
              ? `${item.description.substring(0, 100)}...`
              : item.description}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold" style={{ color: styles.primary }}>
              ₹{item.price.toFixed(2)}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              {item.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

