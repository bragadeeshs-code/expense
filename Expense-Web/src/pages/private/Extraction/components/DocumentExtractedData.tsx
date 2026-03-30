import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  ACCOMMODATION_TYPE_OPTIONS,
  FLIGHT_CLASS_ALLOWANCE_OPTIONS,
  TRAIN_CLASS_ALLOWANCE_OPTIONS,
} from "@/helpers/constants/common";
import { useAppSelector } from "@/state-management/hook";
import { categoryOptions, modeOptions } from "../data/data";

import EmptyState from "./EmptyState";
import FormSelectField from "@/components/common/FormSelectField";
import FormTextAreaField from "@/components/common/FormTextAreaField";
import TrainDocumentTemplate from "./templates/TrainDocumentTemplate";
import BusDocumentTemplate from "./templates/BusDocumentTemplate";
import MealsFoodDocumentTemplate from "./templates/MealsFoodDocumentTemplate";
import AutoBikeTaxiDocumentTemplate from "./templates/AutoBikeTaxiDocumentTemplate";
import HotelInvoiceDocumentTemplate from "./templates/HotelInvoiceDocumentTemplate";
import HotelReceiptDocumentTemplate from "./templates/HotelReceiptDocumentTemplate";
import StationaryDocumentTemplate from "./templates/StationaryDocumentTemplate";
import FlightInvoiceDocumentTemplate from "./templates/FlightInvoiceDocumentTemplate";
import FlightReceiptDocumentTemplate from "./templates/FlightReceiptDocumentTemplate";
import OthersDocumentTemplate from "./templates/OthersDocumentTemplate";
import FuelGasDocumentTemplate from "./templates/FuelGasDocumentTemplate";
import {
  CATEGORY,
  SUB_CATEGORY,
} from "../../ExpenseView/helpers/constants/expenseView";

interface DocumentExtractedDataProps {
  templateControllerRef: React.RefObject<
    (() => Record<string, unknown>) | null
  >;
  isEditableStatus: boolean;
}

const DocumentExtractedData: React.FC<DocumentExtractedDataProps> = ({
  templateControllerRef,
  isEditableStatus,
}) => {
  const [isViewMode] = useState<boolean>(true);
  const { control } = useFormContext();

  const { extractedDocument: extractedData } = useAppSelector(
    (state) => state.extractedDocument,
  );

  const isTrainClass =
    extractedData?.category === "travel" &&
    extractedData.sub_category === "train";

  const isFlightClass =
    extractedData?.category === "travel" &&
    (extractedData.sub_category === "flight_invoice" ||
      extractedData?.sub_category === "flight_receipt");

  const isAccommodationType = extractedData?.category == "hotel_accommodation";

  const renderDocumentTemplate = () => {
    if (!extractedData) return;
    switch (extractedData.category) {
      case CATEGORY.MEALS_FOOD:
        return (
          <MealsFoodDocumentTemplate
            data={extractedData.data}
            editingAllowed={!isViewMode}
            setGetTransformedData={(fn: () => Record<string, unknown>) => {
              templateControllerRef.current = fn;
            }}
          />
        );
      case CATEGORY.STATIONERY:
        return (
          <StationaryDocumentTemplate
            data={extractedData.data}
            editingAllowed={!isViewMode}
            setGetTransformedData={(fn: () => Record<string, unknown>) => {
              templateControllerRef.current = fn;
            }}
          />
        );
      case CATEGORY.FUEL_GAS:
        return (
          <FuelGasDocumentTemplate
            data={extractedData.data}
            editingAllowed={!isViewMode}
            setGetTransformedData={(fn: () => Record<string, unknown>) => {
              templateControllerRef.current = fn;
            }}
          />
        );
      case CATEGORY.TRAVEL:
        switch (extractedData.sub_category) {
          case SUB_CATEGORY.TRAIN:
            return (
              <TrainDocumentTemplate
                data={extractedData.data}
                editingAllowed={!isViewMode}
                setGetTransformedData={(fn: () => Record<string, unknown>) => {
                  templateControllerRef.current = fn;
                }}
              />
            );
          case SUB_CATEGORY.FLIGHT_INVOICE:
            return (
              <FlightInvoiceDocumentTemplate
                data={extractedData.data}
                editingAllowed={!isViewMode}
                setGetTransformedData={(fn: () => Record<string, unknown>) => {
                  templateControllerRef.current = fn;
                }}
              />
            );
          case SUB_CATEGORY.FLIGHT_RECEIPT:
            return (
              <FlightReceiptDocumentTemplate
                data={extractedData.data}
                editingAllowed={!isViewMode}
                setGetTransformedData={(fn: () => Record<string, unknown>) => {
                  templateControllerRef.current = fn;
                }}
              />
            );
          case SUB_CATEGORY.BUS:
            return (
              <BusDocumentTemplate
                data={extractedData.data}
                editingAllowed={!isViewMode}
                setGetTransformedData={(fn: () => Record<string, unknown>) => {
                  templateControllerRef.current = fn;
                }}
              />
            );
          case SUB_CATEGORY.AUTO_BIKE_TAXI:
            return (
              <AutoBikeTaxiDocumentTemplate
                data={extractedData.data}
                editingAllowed={!isViewMode}
                setGetTransformedData={(fn: () => Record<string, unknown>) => {
                  templateControllerRef.current = fn;
                }}
              />
            );
          default:
            return (
              <OthersDocumentTemplate
                data={extractedData.data}
                editingAllowed={!isViewMode}
                setGetTransformedData={(fn: () => Record<string, unknown>) => {
                  templateControllerRef.current = fn;
                }}
              />
            );
        }
      case CATEGORY.HOTEL_ACCOMMODATION:
        switch (extractedData?.sub_category) {
          case SUB_CATEGORY.INVOICE:
            return (
              <HotelInvoiceDocumentTemplate
                data={extractedData.data}
                editingAllowed={!isViewMode}
                setGetTransformedData={(fn: () => Record<string, unknown>) => {
                  templateControllerRef.current = fn;
                }}
              />
            );
          case SUB_CATEGORY.RECEIPT:
            return (
              <HotelReceiptDocumentTemplate
                data={extractedData.data}
                editingAllowed={!isViewMode}
                setGetTransformedData={(fn: () => Record<string, unknown>) => {
                  templateControllerRef.current = fn;
                }}
              />
            );
          default:
            return (
              <OthersDocumentTemplate
                data={extractedData.data}
                editingAllowed={!isViewMode}
                setGetTransformedData={(fn: () => Record<string, unknown>) => {
                  templateControllerRef.current = fn;
                }}
              />
            );
        }
      default:
        return (
          <OthersDocumentTemplate
            data={extractedData.data}
            editingAllowed={!isViewMode}
            setGetTransformedData={(fn: () => Record<string, unknown>) => {
              templateControllerRef.current = fn;
            }}
          />
        );
    }
  };

  if (!extractedData)
    return (
      <EmptyState
        type="no-extracted-document-data"
        className="h-full border-none shadow-none"
      />
    );

  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col space-y-5 overflow-y-auto px-6 py-5">
      <div className="flex items-center justify-between">
        <h4 className="text-midnight-navy text-base leading-[100%] font-semibold tracking-[0%]">
          Extracted data
        </h4>
        {/* {isEditableStatus && (
          <Button
            variant="outline"
            className="border-vivid-violet text-vivid-violet text-sm leading-5 font-medium tracking-[0%]"
            onClick={(event) => {
              event.preventDefault();
              setIsViewMode(!isViewMode);
            }}
          >
            {isViewMode ? (
              <img
                src={`${ASSET_PATH}/icons/pencil-edit-gradient.svg`}
                alt="icon"
              />
            ) : (
              <Eye />
            )}

            {isViewMode ? "Edit Bill" : "View Bill"}
          </Button>
        )} */}
      </div>

      <div className="grid grid-cols-1 gap-6.5 @lg:grid-cols-2 @2xl:grid-cols-3">
        {extractedData.category && (
          <FormSelectField
            control={control}
            name={"category"}
            label="Category"
            labelClassName="mb-1 text-xs font-semibold"
            placeholder="Select a category"
            options={categoryOptions}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => `${option.value}`}
            disabled
            hideDropdownIcon
          />
        )}

        {extractedData.sub_category && (
          <FormSelectField
            control={control}
            name={"mode"}
            label="Mode"
            labelClassName="mb-1 text-xs font-semibold"
            placeholder="Select a mode"
            options={modeOptions}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => `${option.value}`}
            disabled
            hideDropdownIcon
          />
        )}

        {isTrainClass && (
          <FormSelectField
            control={control}
            name={"train_class"}
            label="Train class"
            labelClassName="mb-1 text-xs font-semibold"
            placeholder="Select train class"
            options={TRAIN_CLASS_ALLOWANCE_OPTIONS}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => `${option.value}`}
            disabled={!isEditableStatus}
            hideDropdownIcon={!isEditableStatus}
            isRequired={isEditableStatus}
          />
        )}

        {isFlightClass && (
          <FormSelectField
            control={control}
            name={"flight_class"}
            label="Flight class"
            labelClassName="mb-1 text-xs font-semibold"
            placeholder="Select flight class"
            options={FLIGHT_CLASS_ALLOWANCE_OPTIONS}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => `${option.value}`}
            disabled={!isEditableStatus}
            hideDropdownIcon={!isEditableStatus}
            isRequired={isEditableStatus}
          />
        )}

        {isAccommodationType && (
          <FormSelectField
            control={control}
            name={"accommodation_type"}
            label="Accommodation type"
            labelClassName="mb-1 text-xs font-semibold"
            placeholder="Select accommodation type"
            options={ACCOMMODATION_TYPE_OPTIONS}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => `${option.value}`}
            disabled={!isEditableStatus}
            hideDropdownIcon={!isEditableStatus}
            isRequired={isEditableStatus}
          />
        )}
      </div>

      {renderDocumentTemplate()}

      <FormTextAreaField
        control={control}
        name="notes"
        placeholder="Notes"
        fieldClassName="gap-0"
        labelClassName="font-semibold"
        className={cn("resize-none p-3.5", isViewMode && "pointer-events-none")}
        readOnly={isViewMode}
      />
    </div>
  );
};

export default DocumentExtractedData;
