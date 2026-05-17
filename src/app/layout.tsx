import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Slab, Alef } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";
import SessionProviderWrapper from "@/components/SessionProviderWrappery";

const alef = Alef({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-alef"
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Kora",
  description: "The best way to look well",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en">
      <body
        className={"font-helvetica antialiased"}
        suppressHydrationWarning={true}
      >
        <SessionProviderWrapper>
          <AuthProvider>
            <WishlistProvider>
              <NavBar />
              <Suspense fallback={<LoadingSpinner />}>
                <main className="pt-[70px]">
                  {children}
                </main>
              </Suspense>
              <Footer />
            </WishlistProvider>
          </AuthProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}