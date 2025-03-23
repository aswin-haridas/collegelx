"use client";

import { useState } from "react";
import Image from "next/image";
import { Item } from "@/lib/types";
import { styles } from "@/lib/styles";

export default function ImagesContainer({ item }: { item: Item }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative h-96 w-full overflow-hidden rounded">
        <Image
          src={
            item.image_url && item.image_url.length > activeImageIndex
              ? item.image_url[activeImageIndex]:''
          }
          alt={`${item.title} - image ${activeImageIndex + 1}`}
          fill
          className="object-cover rounded"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          onError={(e) => {
            const imgElement = e.currentTarget as HTMLImageElement;
          }}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 overflow-x-auto py-2">
        {item.image_url &&
          item.image_url.map((url, index) => (
            <div
              key={index}
              className={`relative w-20 h-20 rounded cursor-pointer ${
                activeImageIndex === index ? "ring-2 ring-offset-2" : ""
              }`}
              style={{
                boxShadow: activeImageIndex === index ? `0 0 0 2px ${styles.warmPrimary}` : 'none',
              }}
              onClick={() => setActiveImageIndex(index)}
            >
              <Image
                src={url || ""}
                alt={`${item.title} thumbnail ${index + 1}`}
                fill
                className="object-cover rounded"
                sizes="80px"
                onError={(e) => {
                    const imgElement = e.currentTarget as HTMLImageElement;
                    
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
