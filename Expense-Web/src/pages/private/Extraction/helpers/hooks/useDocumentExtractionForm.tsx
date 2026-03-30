import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { extractionFormSchema } from "../zod-schema/extractionSchema";
import { DEFAULT_SELECT_FIELD_VALUE } from "../constants/extraction";

const useDocumentExtractionForm = () => {
  const form = useForm<z.infer<typeof extractionFormSchema>>({
    resolver: zodResolver(extractionFormSchema),
    mode: "all",
    defaultValues: {
      customer_id: "",
      project: null,
      trip: null,
      so_number: "",
      category: DEFAULT_SELECT_FIELD_VALUE,
      mode: DEFAULT_SELECT_FIELD_VALUE,
      notes: "",
      train_class: null,
      flight_class: null,
      accommodation_type: null,
    },
  });
  return form;
};

export default useDocumentExtractionForm;
