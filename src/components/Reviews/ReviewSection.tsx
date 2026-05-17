"use client";

import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "@/styles/buttons.module.css";
import "swiper/css";
import ReviewForm from "./ReviewForm";
import StarIcon from "@/components/Icons/StarIcon";

type Review = {
  id: number;
  userName: string;
  rating: number;
  comment: string;
};

const REVIEWS_PER_LOAD = 6;

function RatingStars({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="mt-2 flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={
            index < safeRating
              ? "h-4 w-4 fill-[#CDB4DB] text-[#CDB4DB]"
              : "h-4 w-4 fill-transparent text-[#CDB4DB]"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewSection({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_LOAD);
  const [loading, setLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setReviews(data);
        setVisibleCount(REVIEWS_PER_LOAD);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMoreReviews = visibleCount < reviews.length;

  const average = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <section className="mt-20 border-t border-black/10 pt-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold">Valoraciones</h2>
          <p className="mt-2 text-black/50">Opiniones de clientes que han comprado este producto.</p>
        </div>
        <div className="text-left md:text-right">
          <div className="flex items-center gap-2 md:justify-end">
            <p className="text-4xl font-bold">{average}/5</p>
            <StarIcon className="h-5 w-5 fill-[#CDB4DB] text-[#CDB4DB]" />
          </div>
        </div>
      </div>

      {loading && <p className="mt-6 text-black/50">Cargando valoraciones...</p>}

      {!loading && reviews.length === 0 && (
        <div className="mt-8 bg-[#f7f7f7] p-6">
          <p className="font-semibold">Aún no hay valoraciones</p>
          <p className="mt-2 text-sm text-black/50">Sé el primero en valorar este producto.</p>
        </div>
      )}

      {!loading && (
        <div className="relative mt-8">
          <Swiper
            spaceBetween={16}
            slidesPerView={1.15}
            grabCursor
            onReachEnd={() => setIsEnd(true)}
            onFromEdge={() => setIsEnd(false)}
            breakpoints={{
              640: { slidesPerView: 1.6, spaceBetween: 18 },
              768: { slidesPerView: 2.2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {visibleReviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto">
                <article className="flex min-h-[210px] flex-col bg-[#f7f7f7] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-bold">{review.userName}</p>
                    <p className="shrink-0 text-sm font-semibold text-[#CDB4DB]">{review.rating}/5</p>
                  </div>
                  <RatingStars rating={review.rating} />
                  <p className="mt-4 line-clamp-5 text-sm leading-6 text-black/70">{review.comment}</p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <ReviewForm productId={productId} onReviewCreated={(r) => setReviews((prev) => [r, ...prev])} />

          {hasMoreReviews && isEnd && (
            <button
              onClick={() => setVisibleCount((prev) => prev + REVIEWS_PER_LOAD)}
              className={`${styles.btnBasic} absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full px-5 py-4 shadow-lg hover:scale-105 md:flex`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                Ver más <span className="text-xl">→</span>
              </span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
