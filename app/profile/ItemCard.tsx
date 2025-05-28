import React from "react";
import Image from "next/image";
import { styles } from "@/lib/styles";
import Link from "next/link";
import { Item } from "@/types";
import { Edit, Trash2, Star, Heart } from "lucide-react";

function ItemCard({ id, name, images, price, category }: Item) {
  const displayImage = images?.[0] ?? "/images/placeholder.png";
  return (
    <>
      <Link href={`/buy/${id}`} className="block h-full">
        <div
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col group"
          style={{ borderColor: styles.primary, backgroundColor: "white" }}
        >
          <div className="relative h-48 bg-gray-100">
            <Image
              src={displayImage}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "cover",
              }}
            />
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                style={{ color: styles.primary }}
                name="Edit item"
              >
                <Edit size={16} />
              </button>
              )
              <button
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                style={{ color: "#16a34a" }}
                name="Mark as sold"
              >
                <Star size={16} fill="#16a34a" />
              </button>
              )
              <button
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                style={{ color: "#ef4444" }}
                name="Delete item"
              >
                <Trash2 size={16} />
              </button>
              )
              <button
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                style={{ color: "#ef4444" }}
                name="Remove from wishlist"
              >
                <Heart size={16} fill="#ef4444" />
              </button>
              )
            </div>
            )
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-medium text-lg mb-2 line-clamp-1">{name}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold">₹{price}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {category}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default ItemCard;
