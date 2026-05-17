"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useState } from "react";
import styles from "@/styles/buttons.module.css";
import StarIcon from "@/components/Icons/StarIcon";

type Review = { id: number; userName: string; rating: number; comment: string };

export default function ReviewForm({
  productId,
  onReviewCreated,
}: {
  productId: number;
  onReviewCreated: (newReview: Review) => void;
}) {
  const token = Cookies.get("token");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="mt-10 bg-[#f7f7f7] p-6">
        <p className="font-bold">¿Quieres valorar este producto?</p>
        <p className="mt-2 text-sm text-black/50">Inicia sesión para dejar tu opinión.</p>
        <Link
          href="/auth"
          className={`${styles.btnBasic} mt-5 inline-block rounded-full px-6 py-3 text-sm`}
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );
      if (!res.ok) throw new Error();
      const newReview = await res.json();
      onReviewCreated(newReview);
      setRating(5);
      setComment("");
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 bg-[#f7f7f7] p-6">
      <h3 className="text-xl font-bold">Deja tu valoración</h3>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold">Puntuación</p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition hover:scale-110"
            >
              <StarIcon
                className={
                  star <= rating
                    ? "h-6 w-6 fill-[#CDB4DB] text-[#CDB4DB]"
                    : "h-6 w-6 fill-transparent text-black/20"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold">Comentario</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos qué te ha parecido..."
          rows={4}
          className="w-full resize-none border border-black/10 bg-white p-4 text-sm outline-none focus:border-[#CDB4DB]"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !comment.trim()}
        className="mt-5 rounded-full bg-[#CDB4DB] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#b88bd2] disabled:cursor-not-allowed disabled:bg-black/20"
      >
        {loading ? "Enviando..." : "Publicar valoración"}
      </button>
    </form>
  );
}
