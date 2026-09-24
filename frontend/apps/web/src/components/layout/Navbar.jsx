"use client";

import React from "react";
import Link from "next/link";
import { Container } from "./Container";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <Container className="flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-black text-orange-600">
            <span>🍴</span>
            <span>Servio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <Link href="/" className="text-neutral-900 font-semibold hover:text-orange-600 transition">
              Home
            </Link>
            <Link href="/discover" className="hover:text-orange-600 transition">
              Restaurants
            </Link>
            <Link href="/offers" className="hover:text-orange-600 transition">
              Offers
            </Link>
            <Link href="/orders" className="hover:text-orange-600 transition">
              Orders
            </Link>
          </nav>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-4 text-sm">
          <Link href="/search" className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 transition">
            🔍
          </Link>
          <Link href="/cart" className="relative p-2 rounded-full text-neutral-600 hover:bg-neutral-100 transition">
            🛒
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-600"></span>
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-full bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition"
          >
            Sign In
          </Link>
        </div>
      </Container>
    </header>
  );
}
