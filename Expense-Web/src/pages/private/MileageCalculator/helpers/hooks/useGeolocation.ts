import { useEffect, useState } from "react";

import { notifyError } from "@/lib/utils";
import type { Coordinates } from "@/types/mappls";

export const useGeolocation = (): Coordinates | null => {
  const [location, setLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          notifyError("Geolocation access denied:", error.message);
        },
      );
    } else {
      notifyError(
        "Geolocation support:",
        "Geolocation is not supported by this browser",
      );
    }
  }, []);

  return location;
};
