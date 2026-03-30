import { useEffect, useRef } from "react";

import type { MapplsMap, MapplsMapOptions } from "@/types/mappls";

export const useHiddenMap = () => {
  const mapRef = useRef<MapplsMap | null>(null);

  useEffect(() => {
    // Wait for Mappls SDK to load
    const initMap = () => {
      if (window.mappls && !mapRef.current) {
        // Create hidden div if it doesn't exist
        let hiddenDiv = document.getElementById("hidden-calc-map");
        if (!hiddenDiv) {
          hiddenDiv = document.createElement("div");
          hiddenDiv.id = "hidden-calc-map";
          hiddenDiv.style.width = "500px";
          hiddenDiv.style.height = "100vh";
          hiddenDiv.style.position = "absolute";
          hiddenDiv.style.left = "-9999px";
          hiddenDiv.style.top = "-9999px";
          document.body.appendChild(hiddenDiv);
        }

        // Initialize map with India center coordinates
        const options: MapplsMapOptions = {
          center: [28.6139, 77.209], // New Delhi
          zoom: 4,
        };

        mapRef.current = new window.mappls.Map("hidden-calc-map", options);
      }
    };

    // Poll for SDK availability
    const interval = setInterval(() => {
      if (window.mappls) {
        initMap();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return mapRef;
};
