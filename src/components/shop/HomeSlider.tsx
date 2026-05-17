"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HomeSlider() {
  const slides = [
    { src: "/carousel/carousel1.png", alt: "Imagen 1" },
    { src: "/carousel/carousel2.png", alt: "Imagen 2" },
    { src: "/carousel/carousel3.png", alt: "Imagen 3" },
  ];

  return (
    //Carrusel de fotos del home
    <div className="lg:w-full md:h-auto  h-[200vw] w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: false }}
        spaceBetween={16}
        slidesPerView={1}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        speed={2000}
        loop
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative md:w-full h-[200vw] md:h-[50vw] w-[100vw]">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
