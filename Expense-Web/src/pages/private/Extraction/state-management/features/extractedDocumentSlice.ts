import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { ExpenseDetails } from "@/pages/private/ExpenseView/types/expense-view.types";

interface ExtractedDocumentState {
  extractedDocument: ExpenseDetails | null;
}

const initialState: ExtractedDocumentState = {
  extractedDocument: null,
};

export const extractedDocumentSlice = createSlice({
  name: "extractedDocument",
  initialState,
  reducers: {
    addExtractedDocument(state, action: PayloadAction<ExpenseDetails | null>) {
      state.extractedDocument = action.payload;
    },
  },
});

export const { addExtractedDocument } = extractedDocumentSlice.actions;
export default extractedDocumentSlice.reducer;
