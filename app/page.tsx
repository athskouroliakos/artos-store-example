import ProductCard from "./ProductCard";

export interface File {
  id: string;
  path: string;
  mimeType: string;
  fileName: string;
}

export interface Variant {
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
  productOptions: Array<{
    id: string;
    name: string;
    code: string;
  }>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  variants: Variant[];
  files: Array<{
    id: string;
    file: File;
    priority: number;
  }>;
}

const storeId = "d96f13bb-acca-4aa1-b5d5-996cd58d7bd5"; //put your store id here to fetch products from your store

async function getProducts() {
  try {
    const response = await fetch(
      `https://api.artosapp.com/store/products?storeId=${storeId}`,
      {
        headers: {
          "x-store-id": storeId,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-2xl font-bold">Products</h1>

        {products.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-gray-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
