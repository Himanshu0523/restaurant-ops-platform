"use client";

import { useState, useEffect } from "react";
import { RESTAURANTS_DATA } from "../data/restaurants";

export function useNearbyRestaurants(location) {
  const [nearby, setNearby] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock location-filtered restaurants
    setNearby(RESTAURANTS_DATA);
    setIsLoading(false);
  }, [location]);

  return { nearby, isLoading };
}
