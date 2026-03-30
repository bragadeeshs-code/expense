import { ASSET_PATH } from "@/helpers/constants/common";

const uploadedDocuments = [
  {
    id: 1,
    imgSrc: `${ASSET_PATH}/icons/pdf.svg`,
    type: "pdf",
    fileName: "DEL-MAA ticket",
    category: "Fuel / Gas",
  },
  {
    id: 2,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 3,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 4,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 5,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 6,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 7,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 8,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 9,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 10,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },

  {
    id: 11,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 12,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 13,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 14,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 15,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 16,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 17,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 18,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 19,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
  {
    id: 20,
    imgSrc: `${ASSET_PATH}/icons/jpg.svg`,
    type: "jpg",
    fileName: "OfficeSupplies_mar2026",
    category: "Office Supplies",
  },
];

const categoryOptions = [
  {
    name: "Travel",
    value: "travel",
  },
  {
    name: "Flight receipt",
    value: "flight_receipt",
  },
  {
    name: "Flight invoice",
    value: "flight_invoice",
  },
  {
    name: "Hotel accommodation",
    value: "hotel_accommodation",
  },
  {
    name: "Meals food",
    value: "meals_food",
  },
  { name: "Stationery", value: "stationery" },
  { name: "Fuel gas", value: "fuel_gas" },
  { name: "Others", value: "others" },
];

const modeOptions = [
  {
    name: "General",
    value: "general",
    category: "travel",
  },
  {
    name: "Auto Bike Taxi",
    value: "auto_bike_taxi",
    category: "travel",
  },
  {
    name: "Bus",
    value: "bus",
    category: "travel",
  },
  {
    name: "Train",
    value: "train",
    category: "travel",
  },
  {
    name: "Flight invoice",
    value: "flight_invoice",
    category: "travel",
  },
  {
    name: "Flight receipt",
    value: "flight_receipt",
    category: "travel",
  },
  {
    name: "Invoice",
    value: "invoice",
    category: "hotel_accommodation",
  },
  {
    name: "Receipt",
    value: "receipt",
    category: "hotel_accommodation",
  },
];

const classOptions = [
  {
    id: 1,
    name: "Business",
  },
];

export { uploadedDocuments, categoryOptions, modeOptions, classOptions };
