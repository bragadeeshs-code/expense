import { useState, useRef, useEffect } from "react";
import type {
  MapplsMap,
  MapplsMapOptions,
  MapplsDirectionInstance,
  MapplsDirectionOptions,
} from "@/types/mappls";
import { getMapProfile } from "@/pages/private/MileageCalculator/helpers/utils/mileageUtils";
import type { TravelExpenseListItem } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

export const useTripMap = (trip: TravelExpenseListItem | undefined) => {
  const mapRef = useRef<MapplsMap | null>(null);
  const directionRef = useRef<MapplsDirectionInstance | null>(null);
  const [mapError, setMapError] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!window.mappls) {
      setMapError(true);
      return;
    }

    const initMap = () => {
      try {
        if (!mapRef.current) {
          const options: MapplsMapOptions = {
            center: [28.6139, 77.209], // Default center
            zoom: 12,
          };
          mapRef.current = new window.mappls.Map("trip-detail-map", options);
          setMapLoaded(true);
        }
      } catch {
        setMapError(true);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (mapLoaded && trip && window.mappls?.direction) {
      if (directionRef.current?.remove) {
        try {
          directionRef.current.remove();
        } catch {
          // Non-critical
        }
      }

      const options: MapplsDirectionOptions = {
        map: mapRef.current!,
        start: `${trip.from_location.latitude},${trip.from_location.longitude}`,
        end: `${trip.to_location.latitude},${trip.to_location.longitude}`,
        rtype: 1, // Shortest
        profile: getMapProfile(trip.vehicle),
        resource: "route_adv",
        alternatives: false, // Ensure only the shortest route is shown
        fitBounds: true,
        callback: (res: MapplsDirectionInstance) => {
          directionRef.current = res;
        },
      };

      window.mappls.direction(options);
    }
  }, [mapLoaded, trip]);

  return { mapLoaded, mapError };
};
