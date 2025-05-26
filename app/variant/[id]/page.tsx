import Image from "next/image";
import { notFound } from "next/navigation";

interface ProductOption {
  id: string;
  name: string;
  code: string;
}

interface File {
  id: string;
  path: string;
  mimeType: string;
  fileName: string;
}

interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number | null;
  files: Array<{
    id: string;
    file: File;
    priority: number;
  }>;
  productOptions: ProductOption[];
}

interface VariantPageProps {
  params: Promise<{ id: string }>;
}

async function getVariant(id: string): Promise<Variant | null> {
  try {
    const response = await fetch(
      `https://api.artosapp.com/store/product-variants/${id}`,
      {
        headers: {
          "x-store-id": "d96f13bb-acca-4aa1-b5d5-996cd58d7bd5",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export default async function VariantPage({ params }: VariantPageProps) {
  const { id } = await params;
  const variant = await getVariant(id);
  

  if (!variant) {
    notFound();
  }

  const mainImage = variant.files[0]?.file.path;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative h-[500px] bg-white rounded-xl shadow-md p-4">
            {mainImage && (
              <Image
                src={mainImage}
                alt={variant.name}
                fill
                className="object-contain"
              />
            )}
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-3xl font-bold mb-4 text-black">
              {variant.name}
            </h1>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-black">Price</span>
                <span className="text-2xl font-bold text-black">
                  ${Number(variant.price).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-black">SKU</span>
                <span className="font-medium text-black">{variant.sku}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-black">Stock</span>
                <span className="font-medium text-black">
                  {variant.stock === null ? "Out of stock" : variant.stock}
                </span>
              </div>

              {/* Product Options */}
              {variant.productOptions.length > 0 && (
                <div className="pt-4">
                  <h2 className="text-lg font-semibold mb-2 text-black">
                    Options
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {variant.productOptions.map((opt) => (
                      <span
                        key={opt.id}
                        className="bg-gray-100 text-black font-medium px-3 py-1 rounded-full text-sm"
                      >
                        {opt.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6">
                <button className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
