type DataFieldTableData =
  | MealFoodTableContents[]
  | StationeryTableContents[]
  | TrainPassengerDetails[]
  | FlightReceiptPassengerDetails[]
  | FlightReceiptFlightSegments[]
  | FlightInvoiceTableContents[]
  | BusPassengerDetails[];

// Auto Bike Response Data

interface AutoBikeTaxiResponseData {
  start_point: ConfidenceRatedValue;
  end_point: ConfidenceRatedValue;
  kilometer_traveled: ConfidenceRatedValue;
  mode_of_vehicle: ConfidenceRatedValue;
  start_date: ConfidenceRatedValue;
  end_date: ConfidenceRatedValue;
  currency: ConfidenceRatedValue;
  tax_amount: ConfidenceRatedValue;
  grand_total_After_GST: ConfidenceRatedValue;
}

// Bus Response Data

interface BusResponseData {
  Passenger_Details: BusPassengerDetails[];
  grand_total_After_GST: ConfidenceRatedValue;
  booking_platform: ConfidenceRatedValue;
  total_gst: ConfidenceRatedValue;
  Boarding_Point_Details: BusBoardingDetails;
  Dropping_Point_Details: BusDroppingDetails;
  Ticket_Details: BusTicketDetails;
  currency: ConfidenceRatedValue;
}

interface BusBoardingDetails {
  boarding_date: ConfidenceRatedValue;
  boarding_time: ConfidenceRatedValue;
  boarding_address: ConfidenceRatedValue;
}
interface BusDroppingDetails {
  dropping_date: ConfidenceRatedValue;
  dropping_time: ConfidenceRatedValue;
  dropping_address: ConfidenceRatedValue;
}

interface BusPassengerDetails {
  name: ConfidenceRatedValue;
  seat_number: ConfidenceRatedValue;
  [key: string]: ConfidenceRatedValue;
}

interface BusTicketDetails {
  travels_name: ConfidenceRatedValue;
}

// Train Response Data

interface TrainResponseData {
  transaction_details: TrainTransactionDetails;
  grand_total_After_GST: ConfidenceRatedValue;
  vendor_name: ConfidenceRatedValue;
  total_gst: ConfidenceRatedValue;
  taxes: TrainTaxDetails;
  currency: ConfidenceRatedValue;
  passenger_details: TrainPassengerDetails[];
}

interface TrainPassengerDetails {
  passenger_name: ConfidenceRatedValue;
  project_id: ConfidenceRatedValue;
  [key: string]: ConfidenceRatedValue;
}

interface TrainTransactionDetails {
  pnr_number: ConfidenceRatedValue;
  train_name: ConfidenceRatedValue;
  train_number: ConfidenceRatedValue;
  class: ConfidenceRatedValue;
  from_station: ConfidenceRatedValue;
  to_station: ConfidenceRatedValue;
  departure_date: ConfidenceRatedValue;
}

interface TrainTaxDetails {
  cgst_amount: ConfidenceRatedValue;
  igst_amount: ConfidenceRatedValue;
  sgst_amount: ConfidenceRatedValue;
  cgst_percent: ConfidenceRatedValue;
  igst_percent: ConfidenceRatedValue;
  sgst_percent: ConfidenceRatedValue;
  tax_percent: ConfidenceRatedValue;
  tax_amount: ConfidenceRatedValue;
}

// Flight Receipt Response Data

interface FlightReceiptResponseData {
  vendor_name: ConfidenceRatedValue;
  grand_total_After_GST: ConfidenceRatedValue;
  passenger_details: FlightReceiptPassengerDetails[];
  flight_segments: FlightReceiptFlightSegments[];
  booking_details: FlightReceiptBookingDetails;
  currency: ConfidenceRatedValue;
  total_gst: ConfidenceRatedValue;
}

interface FlightReceiptBookingDetails {
  booking_ref_no: ConfidenceRatedValue;
  purpose_of_travel: ConfidenceRatedValue;
}

interface FlightReceiptFlightSegments {
  airline_name: ConfidenceRatedValue;
  airline_pnr: ConfidenceRatedValue;
  departure_date: ConfidenceRatedValue;
  from_airport: ConfidenceRatedValue;
  to_airport: ConfidenceRatedValue;
  flight_number: ConfidenceRatedValue;
  class: ConfidenceRatedValue;
  [key: string]: ConfidenceRatedValue;
}
interface FlightReceiptPassengerDetails {
  passenger_name: ConfidenceRatedValue;
  [key: string]: ConfidenceRatedValue;
}

// Flight Invoice Response Data

interface FlightInvoiceResponseData {
  vendor_name: ConfidenceRatedValue;
  grand_total_After_GST: ConfidenceRatedValue;
  passenger_name: ConfidenceRatedValue;
  purpose_of_trip: ConfidenceRatedValue;
  table_contents: FlightInvoiceTableContents[];
  currency: ConfidenceRatedValue;
  reference_number: ConfidenceRatedValue;
  sgst_percent: ConfidenceRatedValue;
  cgst_percent: ConfidenceRatedValue;
  igst_percent: ConfidenceRatedValue;
  sgst_amount: ConfidenceRatedValue;
  cgst_amount: ConfidenceRatedValue;
  igst_amount: ConfidenceRatedValue;
  total_gst: ConfidenceRatedValue;
}

interface FlightInvoiceTableContents {
  pnr_number: ConfidenceRatedValue;
  departure_date: ConfidenceRatedValue;
  arrival_date: ConfidenceRatedValue;
  sector: ConfidenceRatedValue;
  flight_number: ConfidenceRatedValue;
  class: ConfidenceRatedValue;
  [key: string]: ConfidenceRatedValue;
}

// Hotel Receipt Response Data

interface HotelReceiptResponseData {
  vendor_name: ConfidenceRatedValue;
  hotel_details: HotelReceiptDetails;
  currency: ConfidenceRatedValue;
  booking_details: HotelReceiptBookingDetails;
  transaction_details: HotelTransactionDetails;
  grand_total_After_GST: ConfidenceRatedValue;
}

interface HotelTransactionDetails {
  service_charges: ConfidenceRatedValue;
  tax_details: HotelRecieptTaxDetails;
}

interface HotelRecieptTaxDetails {
  cgst_amount: ConfidenceRatedValue;
  sgst_amount: ConfidenceRatedValue;
  igst_amount: ConfidenceRatedValue;
}

interface HotelReceiptDetails {
  gst_number: ConfidenceRatedValue;
}

interface HotelReceiptBookingDetails {
  departure_date: ConfidenceRatedValue;
  arrival_date: ConfidenceRatedValue;
  room_type: ConfidenceRatedValue;
  number_of_nights: ConfidenceRatedValue;
}

// Hotel Invoice Response Data

interface HotelInvoiceResponseData {
  tax_summary: TaxSummary;
  hotel_details: HotelDetails;
  invoice_details: HotelInvoiceDetails;
  grand_total_After_GST: ConfidenceRatedValue;
  currency: ConfidenceRatedValue;
}

interface HotelDetails {
  hotel_name: ConfidenceRatedValue;
  hotel_gstin: ConfidenceRatedValue;
}

interface TaxSummary {
  cgst_total: ConfidenceRatedValue;
  sgst_total: ConfidenceRatedValue;
  igst_total: ConfidenceRatedValue;
}

interface HotelInvoiceDetails {
  check_in_date: ConfidenceRatedValue;
  check_out_date: ConfidenceRatedValue;
  number_of_nights: ConfidenceRatedValue;
}

// Meal food response data

interface MealFoodResponseData {
  recipient_details: MealsRecipientDetails;
  vendor_name: ConfidenceRatedValue;
  grand_total_After_GST: ConfidenceRatedValue;
  tax_details: MealsTaxDetails;
  billing_details: MealsBillingDetails;
  supplier_details: SupplierDetails;
  table_contents: MealFoodTableContents[];
  currency: ConfidenceRatedValue;
}

interface SupplierDetails {
  gstin: ConfidenceRatedValue;
}

interface MealsBillingDetails {
  date_of_issue: ConfidenceRatedValue;
}

interface MealsTaxDetails {
  tax_amount: ConfidenceRatedValue;
  cgst_percent: ConfidenceRatedValue;
  sgst_percent: ConfidenceRatedValue;
  igst_percent: ConfidenceRatedValue;
  tax_percent: ConfidenceRatedValue;
  cgst_amount: ConfidenceRatedValue;
  sgst_amount: ConfidenceRatedValue;
  igst_amount: ConfidenceRatedValue;
}

interface MealFoodTableContents {
  unit: ConfidenceRatedValue;
  amount: ConfidenceRatedValue;
  quantity: ConfidenceRatedValue;
  unit_price: ConfidenceRatedValue;
  description: ConfidenceRatedValue;
}

// Stationery Response Data

interface StationeryResponseData {
  table_contents: StationaryTableContents[];
  vendor_name: ConfidenceRatedValue;
  grand_total_After_GST: ConfidenceRatedValue;
  [key: string]: ConfidenceRatedValue;
}

interface StationaryTableContents {
  description: ConfidenceRatedValue;
  quantity: ConfidenceRatedValue;
  unit_price: ConfidenceRatedValue;
  [key: string]: ConfidenceRatedValue;
}

// General Response Data

interface GeneralResponseData {
  [key: string]: ConfidenceRatedValue;
}
