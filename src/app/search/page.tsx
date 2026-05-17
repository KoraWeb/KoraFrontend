"use client";

import { Product } from "@/api/types/product";
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/api/product/route";
import LensIcon from "@/components/Icons/LensIcon";
import CategoryIcon from "@/components/Icons/CategoryIcon";
import ProductCard from "@/components/Products/ProductCard";
import styles from "@/styles/buttons.module.css";

type Gender = "MEN" | "WOMEN" | "KIDS" | "UNISEX";

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState<"all" | Gender>("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  const [showFilters, setShowFilters] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSize, setSelectedSize] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const PRODUCTS_PER_LOAD = 20;
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_LOAD);

  const genders: Array<"all" | Gender> = [
    "all",
    "MEN",
    "WOMEN",
    "KIDS",
    "UNISEX",
  ];

  const genderLabels: Record<"all" | Gender, string> = {
    all: "Todos",
    MEN: "Hombre",
    WOMEN: "Mujer",
    KIDS: "Niños",
    UNISEX: "Unisex",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        
        setError("Error cargando productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter((category): category is string => Boolean(category))
      ),
    ];

    return ["all", ...uniqueCategories];
  }, [products]);

  const mainCategories = useMemo(() => {
    return categories.slice(0, 6);
  }, [categories]);

  const brands = useMemo(() => {
    const uniqueBrands = [
      ...new Set(
        products
          .map((product) => product.brand)
          .filter((brand): brand is string => Boolean(brand))
      ),
    ];

    return ["all", ...uniqueBrands];
  }, [products]);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = `${product.name} ${product.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesGender =
        selectedGender === "all" || product.gender === selectedGender;

      const matchesBrand =
        selectedBrand === "all" || product.brand === selectedBrand;

      const matchesPrice =
        maxPrice === "" || Number(product.price) <= Number(maxPrice);

      const matchesSize =
        selectedSize === "all" ||
        product.sizes?.some(
          (size) => size.size === selectedSize && size.stock > 0
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesGender &&
        matchesBrand &&
        matchesPrice &&
        matchesSize
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      return 0;
    });

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < filteredProducts.length;

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_LOAD);
  }, [
    search,
    selectedCategory,
    selectedGender,
    selectedBrand,
    maxPrice,
    selectedSize,
    sortBy,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-5 py-5 text-black md:px-8 md:py-8">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-5 py-5 text-black md:px-8 md:py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-5 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-[34px] font-bold text-black md:text-[42px]">
            Search
          </h1>
        </div>
      </div>

      <div
        className={`sticky z-40 mt-7 bg-[#d8c1e4] py-3 shadow-sm transition-all duration-500 ${isSticky
            ? "top-0 -mx-5 px-5 md:-mx-8 md:px-8"
            : "mx-auto max-w-[1400px] px-4"
          }`}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-center gap-3">
            <div className="hidden flex-1 gap-3 whitespace-nowrap xl:flex">
              {mainCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                 className={`rounded-full px-5 py-2 text-[14px] font-bold transition ${selectedCategory === category
                            ? "bg-white text-[#9f77b3]"
                            : "bg-white/70 text-black hover:bg-white"
                          }`}
                >
                  {category === "all" ? "Todo" : category}
                </button>
              ))}
            </div>

            <div className="flex w-full items-center xl:w-[420px]">
              <div className="flex flex-1 items-center rounded-full bg-white px-3 py-2">
                <LensIcon className="h-[14px] w-[14px]" />

                <input
                  type="text"
                  placeholder="Buscar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ml-2 w-full bg-transparent text-sm text-black placeholder-black/50 outline-none"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-white/40"
              >
                <CategoryIcon />
              </button>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${showFilters ? "mt-4 max-h-[900px]" : "max-h-0"
              }`}
          >
            <div className="rounded-xl bg-white p-4 text-black shadow-sm">
              <p className="mb-4 text-sm font-bold">Filtros</p>

              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-black/40">
                    Categoría
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition ${selectedCategory === category
                            ? "bg-[#CDB4DB] text-white"
                            : "bg-black/5 hover:bg-[#CDB4DB]/40"
                          }`}
                      >
                        {category === "all" ? "Todo" : category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-black/40">
                    Género
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {genders.map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setSelectedGender(gender)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition ${selectedGender === gender
                            ? "bg-[#CDB4DB] text-white"
                            : "bg-black/5 hover:bg-[#CDB4DB]/40"
                          }`}
                      >
                        {genderLabels[gender]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-black/40">
                    Marca
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition ${selectedBrand === brand
                            ? "bg-[#CDB4DB] text-white"
                            : "bg-black/5 hover:bg-[#CDB4DB]/40"
                          }`}
                      >
                        {brand === "all" ? "Todas" : brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-black/40">
                    Talla
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {["all", "XS", "S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition ${selectedSize === size
                            ? "bg-[#CDB4DB] text-white"
                            : "bg-black/5 hover:bg-[#CDB4DB]/40"
                          }`}
                      >
                        {size === "all" ? "Todas" : size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-black/40">
                    Precio máximo
                  </p>

                  <input
                    type="number"
                    placeholder="Ej: 120"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-full bg-black/5 px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-black/40">
                    Ordenar
                  </p>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-full bg-black/5 px-4 py-3 text-sm font-semibold outline-none"
                  >
                    <option value="default">Por defecto</option>
                    <option value="price-asc">Precio más bajo</option>
                    <option value="price-desc">Precio más alto</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedGender("all");
                    setSelectedBrand("all");
                    setSelectedSize("all");
                    setMaxPrice("");
                    setSortBy("default");
                  }}
                  className={`${styles.btnBasic} w-full rounded-full px-4 py-3 text-sm font-bold transition`}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1400px]">
        {visibleProducts.length === 0 ? (
          <div className="py-20 text-center text-black">
            <p className="text-xl font-bold">No se han encontrado productos</p>
            <p className="mt-2 text-sm text-black/50">
              Prueba a cambiar los filtros o la búsqueda.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMoreProducts && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() =>
                    setVisibleCount(
                      (currentCount) => currentCount + PRODUCTS_PER_LOAD
                    )
                  }
                  className={`${styles.btnBasic} rounded-full px-6 py-3 text-sm font-bold transition`}
                >
                  Cargar más
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}