import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

import { useHiddenMap } from "@/pages/private/MileageCalculator/helpers/hooks/useHiddenMap";
import { notifyError, notifySuccess } from "@/lib/utils";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { getCurrentUserProjects } from "@/services/project.service";
import { getMileageRates, addTravelExpense } from "@/services/mileage.service";
import { MILEAGE_EXPENSES_LIST_QUERY_KEY } from "@/helpers/constants/common";
import {
  findShortestRoute,
  formatCoordinatesForAPI,
} from "@/utils/mapplsUtils";
import {
  mileageExpenseSchema,
  type MileageExpenseFormValues,
} from "@/pages/private/MileageCalculator/zod-schema/mileageSchema";

import type {
  LocationDetails,
  MapplsDirectionOptions,
  MapplsDirectionInstance,
} from "@/types/mappls";

import MapModal from "@/components/mileage/MapModal";
import FuelPumpActive from "/assets/icons/fuel_pump_active.svg";
import ConfigureSheet from "@/components/common/ConfigureSheet";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import type {
  MapLocationPoint,
  MileageProjectsResponse,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import { MILEAGE_FORM_DEFAULTS } from "@/pages/private/MileageCalculator/helpers/constants/mileage";
import {
  calculateTravelAmount,
  formatMileagePayload,
  getMapProfile,
} from "@/pages/private/MileageCalculator/helpers/utils/mileageUtils";
import MileageExpenseForm from "@/pages/private/MileageCalculator/components/MileageExpenseForm";

type MileageExpenseSheetProps = {
  children: React.ReactNode;
};

const MileageExpenseSheet: React.FC<MileageExpenseSheetProps> = ({
  children,
}: MileageExpenseSheetProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    search,
    debouncedSearch,
    updateSearch: handleSearch,
  } = useDebouncedSearch();

  const { data: projects, isFetching: isProjectsFetching } =
    useQuery<MileageProjectsResponse>({
      queryFn: () => getCurrentUserProjects(search),
      queryKey: ["my-projects", debouncedSearch],
      refetchOnWindowFocus: false,
      enabled: isOpen,
      retry: false,
    });

  const { data: mileageRates } = useQuery({
    queryFn: getMileageRates,
    queryKey: ["mileage-rates"],
    enabled: isOpen,
  });

  const form = useForm<MileageExpenseFormValues>({
    resolver: zodResolver(mileageExpenseSchema),
    defaultValues: MILEAGE_FORM_DEFAULTS,
    mode: "onTouched",
  });

  const { control, handleSubmit, watch, setValue, reset, formState } = form;

  const fromLocation = watch("from_location");
  const toLocation = watch("to_location");
  const vehicle = watch("vehicle");
  const distance = watch("distance");

  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [activeLocationField, setActiveLocationField] =
    useState<MapLocationPoint>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const calcMapRef = useHiddenMap();
  const directionRef = useRef<MapplsDirectionInstance | null>(null);

  useEffect(() => {
    const parseRate = (rate?: string) => {
      if (!rate) return 0;
      const parsed = parseFloat(rate);
      return isNaN(parsed) ? 0 : parsed;
    };

    const rates = {
      CAR: parseRate(mileageRates?.car_mileage_rate),
      BIKE: parseRate(mileageRates?.bike_mileage_rate),
    };

    const amount = calculateTravelAmount(distance, vehicle?.value, rates);
    setValue("amount", amount, { shouldValidate: true });
  }, [vehicle?.value, distance, setValue, mileageRates]);

  const openMapModal = (field: MapLocationPoint) => {
    setActiveLocationField(field);
    setIsMapModalOpen(true);
  };

  const handleLocationSelect = (location: LocationDetails) => {
    if (activeLocationField === "from") {
      setValue("from_location", location, { shouldValidate: true });
    } else {
      setValue("to_location", location, { shouldValidate: true });
    }
    setIsMapModalOpen(false);
    setActiveLocationField(null);
  };

  useEffect(() => {
    const calculateDistance = () => {
      if (!fromLocation || !toLocation) return;
      if (!window.mappls?.direction || !calcMapRef.current) return;

      setIsCalculating(true);
      setValue("distance", 0, { shouldValidate: false });

      if (directionRef.current?.remove) {
        try {
          directionRef.current.remove();
        } catch {
          // Failure to remove is non-critical and can occur if the map state has changed
        }
        directionRef.current = null;
      }

      const options: MapplsDirectionOptions = {
        map: calcMapRef.current,
        start: formatCoordinatesForAPI(fromLocation),
        end: formatCoordinatesForAPI(toLocation),
        rtype: 1,
        profile: getMapProfile(vehicle?.value),
        resource: "route_adv",
        callback: (response: MapplsDirectionInstance) => {
          setIsCalculating(false);
          directionRef.current = response;

          if (response.fail) {
            setValue("distance", 0, {
              shouldValidate: true,
            });
            setValue("duration_seconds", 0);
            form.setError("distance", { message: "No route found" });
          } else {
            const result = findShortestRoute(response);
            if (result) {
              setValue("distance", result.distanceMeters, {
                shouldValidate: true,
              });
              setValue("duration_seconds", result.durationSeconds);
            } else {
              setValue("distance", 0, {
                shouldValidate: true,
              });
              setValue("duration_seconds", 0);
              form.setError("distance", {
                message: "No route found, Choose again...",
              });
            }
          }
        },
      };

      window.mappls.direction(options);
    };

    calculateDistance();
  }, [fromLocation, toLocation, vehicle?.value, calcMapRef, setValue, form]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        reset(MILEAGE_FORM_DEFAULTS);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: MileageExpenseFormValues) => {
    try {
      const payload = formatMileagePayload(data);
      const response = await addTravelExpense(payload);
      notifySuccess("Expense Added", response.message);
      queryClient.invalidateQueries({
        queryKey: [MILEAGE_EXPENSES_LIST_QUERY_KEY],
      });
      setIsOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      notifyError(
        `Failed to add travel expense`,
        `The expense could not be added. Please try again`,
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <ConfigureSheet
        image={FuelPumpActive}
        title="Add Mileage Expense"
        submitText="Save Expense"
        description="Add and manage mileage expenses for travel reimbursements."
        loadingText="Saving expense..."
        isSubmitting={formState.isSubmitting}
        saveButtonState={!formState.isDirty || isCalculating}
        onSave={handleSubmit(onSubmit)}
      >
        <MileageExpenseForm
          search={search}
          control={control}
          projects={projects?.data}
          isCalculating={isCalculating}
          isLoadingProjects={isProjectsFetching}
          mileageRates={mileageRates}
          onOpenMap={openMapModal}
          onSearchChange={handleSearch}
        />
      </ConfigureSheet>

      {isMapModalOpen && (
        <MapModal
          onClose={() => setIsMapModalOpen(false)}
          onChoose={handleLocationSelect}
        />
      )}
    </Sheet>
  );
};

export default MileageExpenseSheet;
