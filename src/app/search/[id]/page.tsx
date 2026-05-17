"use client";

import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { getProductById } from "@/api/product/route";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product, ProductSize } from "@/api/types/product";
import { addBagItem } from "@/api/bag/route";
import { getProducts } from "@/api/product/route";
import RecomendedProducts from "@/components/Products/RecomendedProducts";
import AddedModal from "@/components/Modals/AddedModal";
import ProductReviews from "@/components/Reviews/ReviewSection";

const genderLabels = {
  MEN: "Hombre",
  WOMEN: "Mujer",
  KIDS: "Niños",
  UNISEX: "Unisex",
};

export default function ProductPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [continueShopping, setContinueShopping] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);

        const allProducts = await getProducts();

        const related = allProducts
          .filter((item) => item.id !== data.id)
          .filter(
            (item) =>
              item.category === data.category ||
              item.gender === data.gender ||
              item.brand === data.brand
          )
          .slice(0, 4);

        setRelatedProducts(related);
      } catch (error) {
        console.error("Error cargando producto", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (loading) return <p className="p-10">Cargando producto...</p>;
  if (!product) return <p className="p-10">Producto no encontrado</p>;

  const images = product.images?.length ? product.images : ["/placeholder.png"];
  const sizes = product.sizes ?? [];

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-black sm:px-6 md:px-10 lg:px-14">
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-5xl overflow-auto"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl leading-none text-black transition hover:scale-105"
            >
              ×
            </button>

            <Image
              src="/size-guide.png"
              alt="Guía de tallas"
              width={1280}
              height={1024}
              className="h-auto w-full"
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-[1.45fr_0.75fr] lg:items-start">
          <section className="space-y-4">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative aspect-[4/5] w-full overflow-hidden bg-[#f2f2f2]"
              >
                <Image
                  src={cloudinaryUrl(image, { width: 800, height: 1000 })}
                  alt={`${product.name} imagen ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-contain p-4"
                />
              </div>
            ))}
          </section>

          <div className="w-full lg:sticky lg:top-8 lg:pt-4">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-medium text-black/50">
              {product.brand && <span>{product.brand}</span>}

              {product.brand && product.gender && <span>·</span>}

              {product.gender && (
                <span>{genderLabels[product.gender] ?? product.gender}</span>
              )}
            </div>

            <h1 className="text-[28px] font-bold leading-[1.05] md:text-[38px]">
              {product.name}
            </h1>

            <p className="mt-2 text-[16px] font-medium text-black/80 md:text-[18px]">
              {product.description}
            </p>

            <p className="mt-5 text-[20px] font-semibold">{product.price}€</p>

            <p className="mt-1 text-sm text-black/45">IVA incluido</p>

            <div className="mt-10 flex items-center justify-between gap-4 md:mt-14">
              <p className="text-sm font-medium">Seleccionar tamaño</p>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-sm text-black/45 underline underline-offset-2 hover:text-black"
              >
                Guía de tallas
              </button>
            </div>

            {sizes.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
                {sizes.map((item) => {
                  const isSelected = selectedSize?.size === item.size;
                  const isDisabled = item.stock === 0;

                  return (
                    <button
                      key={item.sizeId}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setSelectedSize(item)}
                      className={`min-h-[46px] rounded-md border text-sm font-medium transition ${isDisabled
                          ? "cursor-not-allowed border-[#e5e5e5] bg-[#f0f0f0] text-black/30"
                          : isSelected
                            ? "border-black bg-white text-black"
                            : "border-[#d9d9d9] bg-[#f5f5f5] text-black/80 hover:border-black/50"
                        }`}
                    >
                      {item.size}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-black/50">
                No hay tallas disponibles para este producto.
              </p>
            )}

            {selectedSize && (
              <p className="mt-3 text-sm text-black/60">
                Talla seleccionada:{" "}
                <span className="font-semibold">{selectedSize.size}</span>
              </p>
            )}

            <div className="mt-6">
              <p className="mb-3 text-sm font-medium">Cantidad</p>

              <div className="flex w-[140px] items-center justify-between rounded-full border border-[#d9d9d9] bg-white px-2 py-1">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-medium transition hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:text-black/25"
                >
                  −
                </button>

                <span className="text-base font-semibold">{quantity}</span>

                <button
                  type="button"
                  disabled={selectedSize ? quantity >= selectedSize.stock : false}
                  onClick={() =>
                    setQuantity((prev) =>
                      selectedSize
                        ? Math.min(selectedSize.stock, prev + 1)
                        : prev + 1
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-medium transition hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:text-black/25"
                >
                  +
                </button>
              </div>
            </div>

            <button
              disabled={!selectedSize}
              className={`mt-8 w-full rounded-full px-6 py-4 text-sm font-semibold text-white transition active:scale-[0.98] ${selectedSize
                  ? "cursor-pointer bg-[#CDB4DB] hover:bg-[#b88bd2]"
                  : "cursor-not-allowed bg-gray-400"
                }`}
              onClick={async () => {
                if (!selectedSize || !product) return;

                await addBagItem({
                  productId: product.id,
                  sizeId: selectedSize.sizeId,
                  quantity,
                });

                setContinueShopping(true);
              }}
            >
              Añadir a la bolsa
            </button>

            <div className="mt-10 border-t border-black/10 pt-6 text-[15px] leading-7 text-black/70">
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        <AddedModal
          open={continueShopping}
          onClose={() => setContinueShopping(false)}
        />

        <ProductReviews productId={product.id} />

        <RecomendedProducts products={relatedProducts} />
      </div>
    </div>
  );
}