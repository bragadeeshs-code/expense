interface APIFieldError {
  field: string;
  message: string;
  type: string;
}

interface APIErrorResponse {
  detail?: string | APIFieldError[];
}

interface ExpenseSubmitErrorResponse {
  detail: {
    message?: string;
    error_code?: "LIMIT_EXCEEDED" | "DUPLICATE_EXPENSE" | "LIMIT_EXHAUSTED";
    existing_expense_id?: number;
    total_amount?: number;
    approval_limit?: number;
  };
}
