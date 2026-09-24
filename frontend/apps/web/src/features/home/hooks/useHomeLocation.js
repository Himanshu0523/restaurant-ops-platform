"use client";

import { useState } from "react";
import { HOME_DEFAULT_LOCATION } from "../constants/home.constants";

export function useHomeLocation() {
  const [location, setLocation] = useState(HOME_DEFAULT_LOCATION);
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation("Current Location (Indiranagar)");
          setIsDetecting(false);
        },
        () => {
          setIsDetecting(false);
        }
      );
    } else {
      setIsDetecting(false);
    }
  };

  return { location, setLocation, isDetecting, detectLocation };
}
