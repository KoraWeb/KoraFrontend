"use client";

import Link from "next/link";
import { useState } from "react";
import KoraIcon from "./Icons/KoraIcon";
import ProfileIcon from "./Icons/ProfileIcon";
import HeartIcon from "./Icons/HeartIcon";
import BagIcon from "./Icons/BagIcon";
import { useAuth } from "@/app/context/AuthContext";
import LensIcon from "./Icons/LensIcon";

export default function NavBar() {
  const { logged } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Men", href: "/shop/men" },
    { label: "Women", href: "/shop/women" },
    { label: "Kids", href: "/shop/kids" },
    { label: "SNKRS", href: "/shop/sneakers" },
  ];

  return (
    <div className="w-full bg-[#CDB4DB] relative z-50">
      {/* BARRA PRINCIPAL */}
      <div className="h-[70px] grid grid-cols-2 lg:grid-cols-3 items-center px-2">

        {/* LOGO */}
        <Link href="/" className="flex w-[64px] h-[64px] items-center gap-2">
          <KoraIcon className="w-full h-full text-black" />
        </Link>

        {/* NAV LINKS — solo desktop */}
        <ul className="hidden lg:flex w-full text-[20px] text-black font-helvetica gap-4 items-center justify-center">
          {navLinks.map(link => (
            <li key={link.label} className="hover:underline">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        {/* ICONOS DERECHA */}
        <div className="flex items-center justify-end h-full gap-0">

          <Link href="/wishlist" className="flex justify-center items-center hover:bg-[#a66fc6] w-[38px] h-full">
            <HeartIcon className="w-[24px] h-[24px] text-black" />
          </Link>
          <Link href="/bag" className="flex justify-center items-center hover:bg-[#a66fc6] w-[38px] h-full">
            <BagIcon className="w-[24px] h-[24px] text-black" />
          </Link>

          {logged ? (
            <Link href="/profile" className="flex justify-center items-center hover:bg-[#a66fc6] w-[38px] h-full">
              <ProfileIcon className="w-[24px] h-[24px] text-black" />
            </Link>
          ) : (
            <div className="flex items-center gap-2 ml-2 mr-3 font-semibold text-[14px]">
              <Link href="/auth" className="text-black hover:underline">Login</Link>
              <span className="text-black">|</span>
              <Link href="/auth" className="text-black hover:underline">Register</Link>
            </div>
          )}

          {/* Hamburger — al final del todo, solo mobile/tablet */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-[44px] h-[44px] gap-1.5 hover:bg-[#a66fc6] rounded ml-1"
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL desplegable */}
      {menuOpen && (
        <div className="lg:hidden bg-[#CDB4DB] border-t border-[#b89cc4] px-6 py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-black text-lg font-semibold hover:underline py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}