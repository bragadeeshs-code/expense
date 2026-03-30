import { useQuery } from "@tanstack/react-query";

import { getReimbursementLink } from "@/services/reimbursements.service";
import type { ReimbursementDocument } from "@/types/common.types";

export const useDocumentPreview = (document: ReimbursementDocument | null) => {
  const id = Number(document?.id);
  const isEnabled = !!document;
  return useQuery<ExpenseLinkResponse>({
    queryKey: ["document-preview", id],
    queryFn: () => getReimbursementLink(id),
    enabled: isEnabled,
    refetchOnWindowFocus: false,
  });
};
