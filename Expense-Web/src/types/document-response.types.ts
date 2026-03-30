export interface ConfidenceRatedValue {
  value: null | number | string | boolean;
  confidence_score: number;
}

// Fuel Gas Response Data

export interface FuelGasResponseData {
  date: ConfidenceRatedValue;
  currency: ConfidenceRatedValue;
  vendor_name: ConfidenceRatedValue;
  vendor_details: VendorDetails;
  transaction_details: FuelTransactionDetails;
  grand_total_After_GST: ConfidenceRatedValue;
  total_gst: ConfidenceRatedValue;
}

interface FuelTransactionDetails {
  fuel_type: ConfidenceRatedValue;
}

interface VendorDetails {
  gstin: ConfidenceRatedValue;
}
