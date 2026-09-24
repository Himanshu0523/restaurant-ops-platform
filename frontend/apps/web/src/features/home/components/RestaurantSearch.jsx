"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HOME_SEARCH_PLACEHOLDER } from "../constants/home.constants";

export function RestaurantSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex items-center gap-2 p-2 rounded-full bg-white text-neutral-900 shadow-xl border border-neutral-100">
        <span className="pl-3 text-lg text-neutral-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={HOME_SEARCH_PLACEHOLDER}
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-neutral-900 placeholder:text-neutral-400 px-2"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-md"
        >
          Search
        </button>
      </div>
    </form>
  );
}
