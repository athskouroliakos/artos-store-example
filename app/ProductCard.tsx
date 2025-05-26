"use client";
import Image from "next/image";
import { useState } from "react";
import { Variant } from "./page";
import { Product } from "./page";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants?.[0] || null
  );

  if (!selectedVariant) {
    return null;
  }

  // Get all images for thumbnails (from all variants)
  const allImages = product.variants.flatMap((v) =>
    v.files.map((f) => ({
      src: f.file.path,
      variantId: v.id,
      variant: v,
    }))
  );

  // Main image: from selected variant, fallback to product image
  const mainImage =
    selectedVariant.files[0]?.file.path || product.files[0]?.file.path;

  return (
    <div className="relative bg-white rounded-xl shadow-md p-4 flex flex-col items-center border">
      {/* Main Image */}
      {mainImage && (
        <div className="w-full h-64 relative mb-4">
          <Image
            src={mainImage}
            alt={product.name}
            width={300}
            height={256}
            className="object-contain h-full w-full"
          />
        </div>
      )}
      {/* Variant Thumbnails */}
      <div className="flex gap-2 mb-3">
        {allImages.map((img, idx) => (
          <button
            key={img.src + idx}
            className={`border-2 rounded-md p-0.5 bg-white ${
              selectedVariant.id === img.variantId
                ? "border-black"
                : "border-transparent"
            }`}
            onClick={() => setSelectedVariant(img.variant)}
            aria-label={`Select variant image`}
            type="button"
          >
            <Image
              src={img.src}
              alt={product.name}
              width={48}
              height={48}
              className="object-contain w-12 h-12"
            />
          </button>
        ))}
      </div>
      {/* Product Name */}
      <div className="font-bold text-lg text-gray-900 text-center mb-2">
        {selectedVariant.name || product.name}
      </div>
      {/* Variant Option Tags */}
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        {selectedVariant.productOptions.map((opt) => (
          <span
            key={opt.id}
            className="bg-gray-200 text-gray-800 font-semibold border border-gray-400 text-xs px-2 py-1 rounded"
          >
            {opt.name}
          </span>
        ))}
      </div>
      {/* Price */}
      <div className="font-bold text-xl text-black mb-4">
        ${selectedVariant.price.toFixed(2)}
      </div>
      {/* Buy Now Button */}
      <Link
        href={`/variant/${selectedVariant.id}`}
        className="w-full bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-center"
      >
        Buy Now
      </Link>
    </div>
  );
}
