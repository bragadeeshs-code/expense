import { useRef, useState, useCallback } from "react";

import MapFallback from "./MapFallback";

import { Button } from "@/components/ui/button";
import { useGeolocation } from "../../pages/private/MileageCalculator/helpers/hooks/useGeolocation";
import {
  extractAddress,
  convertToLocationDetails,
} from "../../utils/mapplsUtils";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import type {
  MapplsMap,
  Coordinates,
  MapModalProps,
  MapplsMapEvent,
  LocationDetails,
  MapplsPlacePicker,
  MapplsLocationData,
  MapplsPlacePickerOptions,
} from "../../types/mappls";

const MapModal = ({ onClose, onChoose }: MapModalProps) => {
  const mapRef = useRef<MapplsMap | null>(null);
  const pickerRef = useRef<MapplsPlacePicker | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [mapError, setMapError] = useState<boolean>(false);
  const currentLocation = useGeolocation();

  const updateSelectedAddress = useCallback(
    (data: MapplsLocationData | null) => {
      const address = extractAddress(data);
      if (address) {
        setSelectedAddress(address);
      }
    },
    [],
  );

  const loadPicker = useCallback(
    (center: Coordinates) => {
      const mapContainer = document.getElementById("map-modal-container");
      if (!mapContainer || mapRef.current) return;

      try {
        mapRef.current = new window.mappls.Map("map-modal-container", {
          center,
          zoom: 15,
        });
      } catch {
        setMapError(true);
        return;
      }

      mapRef.current.on("load", () => {
        const options: MapplsPlacePickerOptions = {
          map: mapRef.current!,
          header: true,
          search: true,
          geolocation: true,
          closeBtn: false,
        };

        window.mappls.advancePlacePicker(
          options,
          (picker: MapplsPlacePicker) => {
            pickerRef.current = picker;

            setTimeout(() => {
              const initialData = picker.getLocation();
              updateSelectedAddress(initialData);
            }, 800);

            mapRef.current!.on("click", (e: MapplsMapEvent) => {
              const coords = e.lngLat || e.latLng;
              if (coords) {
                picker.setLocation(coords);
                setTimeout(() => {
                  const locationData = picker.getLocation();
                  updateSelectedAddress(locationData);
                }, 500);
              }
            });
          },
        );
      });
    },
    [updateSelectedAddress],
  );

  const initMap = useCallback(() => {
    if (!window.mappls) {
      setMapError(true);
      return;
    }

    const defaultCenter: Coordinates = currentLocation || {
      lat: 28.6139,
      lng: 77.209,
    };

    if (!currentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          loadPicker(pos);
        },
        () => {
          loadPicker(defaultCenter);
        },
      );
    } else {
      loadPicker(currentLocation);
    }
  }, [currentLocation, loadPicker]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleChooseLocation = () => {
    if (!pickerRef.current) {
      return;
    }

    const rawData = pickerRef.current.getLocation();
    const locationDetails = convertToLocationDetails(rawData, selectedAddress);

    if (locationDetails) {
      onChoose(locationDetails);
    } else if (currentLocation) {
      const fallback: LocationDetails = {
        ...currentLocation,
        name:
          selectedAddress ||
          `Coordinates: ${currentLocation.lat}, ${currentLocation.lng}`,
      };
      onChoose(fallback);
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent
        className="pointer-events-auto z-9999 flex h-full w-full max-w-full flex-col gap-0 overflow-hidden p-0 sm:h-[90vh] sm:w-[90vw] sm:max-w-4xl"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          setTimeout(initMap, 100);
        }}
      >
        <DialogHeader className="z-10 space-y-1 border-b border-gray-200 bg-white p-4 px-6">
          <DialogTitle className="text-deep-charcoal flex justify-between text-xl font-semibold">
            <p>Choose Location</p>
            <p className="text-cool-gray text-sm font-medium">
              Move the map to get desired location.
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 min-h-0 w-full flex-1 bg-gray-100">
          {mapError ? (
            <MapFallback />
          ) : (
            <div
              id="map-modal-container"
              className="pointer-events-auto absolute inset-0 h-full w-full"
            />
          )}
        </div>

        <DialogFooter className="z-10 flex flex-col items-stretch gap-4 border-t border-gray-200 bg-white p-4 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-cool-gray mb-1 text-xs font-medium tracking-wider uppercase">
              Selected Location
            </p>
            <p
              className="text-deep-charcoal truncate text-sm font-medium"
              title={selectedAddress}
            >
              {selectedAddress || "Select a location on the map..."}
            </p>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChooseLocation}
              disabled={!selectedAddress}
              className="h-10 w-full [background-image:var(--gradient-primary)] text-white hover:opacity-90 sm:w-auto"
            >
              Choose Location
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
