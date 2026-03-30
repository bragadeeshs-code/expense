import { MapPinOff } from "lucide-react";

const MapFallback = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50/80 p-6 text-center text-gray-500">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 shadow-sm">
        <MapPinOff className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-700">Unable to load map</p>
      <p className="mt-1 max-w-[250px] text-xs text-gray-500">
        There is an issue rendering the map right now. Kindly try again after
        some time.
      </p>
    </div>
  );
};

export default MapFallback;
