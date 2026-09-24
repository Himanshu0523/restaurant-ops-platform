"use client";

import { useState, useEffect } from "react";
import { getFeaturedRestaurants } from "../api/home-api";

export function useHomeRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFeaturedRestaurants()
      .then((data) => {
        setRestaurants(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { restaurants, isLoading, error };
}
