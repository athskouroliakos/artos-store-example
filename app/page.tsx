import ProductCard from "./ProductCard";
import Link from "next/link";
import { Suspense } from "react";

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

export interface PaginatedResponse {
  data: Product[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    current: string;
    next?: string;
    previous?: string;
  };
}

const storeId = "d96f13bb-acca-4aa1-b5d5-996cd58d7bd5"; //put your store id here to fetch products from your store

async function getProducts(page = 1, limit = 9): Promise<PaginatedResponse> {
  try {
    const response = await fetch(
      `https://api.artosapp.com/store/products?storeId=${storeId}&page=${page}&limit=${limit}`,
      {
        headers: {
          "x-store-id": storeId,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return (
      data || {
        data: [],
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: limit,
        },
        links: { current: "" },
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      data: [],
      meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limit,
      },
      links: { current: "" },
    };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const response = await getProducts(currentPage);
  const products = response.data || [];
  const { totalPages, totalItems } = response.meta;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-800 text-white p-4 mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Artos Test Interface</h1>
          <p className="text-slate-300 text-sm">
            A simple developer tool for testing product listings
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="text-sm text-gray-500">
              Total items: {totalItems}
            </div>
          </div>

          <Suspense
            fallback={
              <div className="text-center p-8">
                <p className="text-gray-600">Loading products...</p>
              </div>
            }
          >
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
          </Suspense>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t">
            <Link
              href={currentPage > 1 ? `/?page=${currentPage - 1}` : "#"}
              className={`px-4 py-2 rounded ${
                currentPage <= 1
                  ? "bg-gray-200 text-gray-400 pointer-events-none"
                  : "bg-slate-700 text-white hover:bg-slate-600"
              }`}
              aria-disabled={currentPage <= 1}
            >
              Previous
            </Link>

            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <Link
              href={
                currentPage < totalPages ? `/?page=${currentPage + 1}` : "#"
              }
              className={`px-4 py-2 rounded ${
                currentPage >= totalPages
                  ? "bg-gray-200 text-gray-400 pointer-events-none"
                  : "bg-slate-700 text-white hover:bg-slate-600"
              }`}
              aria-disabled={currentPage >= totalPages}
            >
              Next
            </Link>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm pb-8">
          Developer Testing Interface - Not for production use
        </footer>
      </div>
    </div>
  );
}
