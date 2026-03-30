import type z from "zod";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Link, useMatch, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";

import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { getExpenseDetail } from "@/services/reimbursements.service";
import { DuplicateBillDialog } from "../Extraction/components/DuplicateBillDialog";
import { addExtractedDocument } from "../Extraction/state-management/features/extractedDocumentSlice";
import type { extractionFormSchema } from "../Extraction/helpers/zod-schema/extractionSchema";
import {
  EXPENSE_DETAILS_QUERY_KEY,
  ReimbursementStatusEnum,
  RoleEnum,
} from "@/helpers/constants/common";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";

import EmptyState from "../Extraction/components/EmptyState";
import ExpenseViewList from "./components/ExpenseViewList";
import ExtractionFooter from "../Extraction/components/ExtractionFooter";
import ExpenseViewHeader from "./components/ExpenseViewHeader";
import useSubmitExpense from "../Extraction/helpers/hooks/useSubmitExpense";
import ReimbursementLimitDialog from "../Extraction/components/ReimbursementLimitDialog";
import useDocumentExtractionForm from "../Extraction/helpers/hooks/useDocumentExtractionForm";

import {
  pickMode,
  pickCategory,
} from "../Extraction/lib/utils/extractionUtils";
import {
  notifyError,
  pickTrainClass,
  pickFlightClass,
  pickAccommodationType,
  hasAccess,
  formatApiError,
} from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AlertInfo from "../Extraction/components/AlertInfo";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";
import type { ExpenseDetails } from "./types/expense-view.types";
import { shouldShowExtractionFooter } from "./lib/expenseViewUtils";

const ExpenseView: React.FC = () => {
  const { data: user } = useCurrentuser();

  const [limitExceedDialogOpen, setLimitExceedDialogOpen] =
    useState<boolean>(false);
  const [duplicateBillDialog, setDuplicateBillDialog] =
    useState<boolean>(false);

  const { id } = useParams();

  const isMyExpensesPage = useMatch("/my_expenses/*");
  const isApprovalsPage = useMatch("/approvals/*");
  const isReportsPage = useMatch("/reports/*");

  const dispatch = useAppDispatch();
  const extractedDocument = useAppSelector(
    (state) => state.extractedDocument.extractedDocument,
  );

  const templateControllerRef = useRef<(() => Record<string, unknown>) | null>(
    null,
  );

  const formMethods = useDocumentExtractionForm();
  const { setValue, getValues } = formMethods;

  const {
    data: expense,
    isFetching,
    error,
  } = useQuery<ExpenseDetails, AxiosError<APIErrorResponse>>({
    queryKey: [EXPENSE_DETAILS_QUERY_KEY, id],
    queryFn: () => getExpenseDetail(Number(id)),
    refetchOnWindowFocus: false,
  });

  const {
    mutate: mutateSubmit,
    error: submitError,
    isPending: isSubmitting,
  } = useSubmitExpense();

  const updateFormValues = (data: ExpenseDetails) => {
    if (!data) return;

    setValue("category", pickCategory(data.category ?? ""));
    setValue("mode", pickMode(data.sub_category ?? ""));

    setValue("train_class", pickTrainClass(data.train_class) ?? null);
    setValue("flight_class", pickFlightClass(data.flight_class) ?? null);
    setValue(
      "accommodation_type",
      pickAccommodationType(data.accommodation_type) ?? null,
    );
  };

  const onSubmit = (values: z.infer<typeof extractionFormSchema>) => {
    const data = templateControllerRef.current?.() ?? {};
    const framedData = {
      data,
      project_id: values.project?.id,
      trip_id: values.trip?.id,
      note: values.notes,
      flight_class: values.flight_class?.value,
      train_class: values.train_class?.value,
      accommodation_type: values.accommodation_type?.value,
    };

    mutateSubmit({ id: Number(id), data: framedData });
  };

  const handleExceedLimitSubmit = (
    submitType: ExceedLimitSubmitType,
    notesFromDialog: string,
  ) => {
    const {
      notes,
      project,
      trip,
      accommodation_type,
      flight_class,
      train_class,
    } = getValues();

    let fullNotes = notes;

    if (notesFromDialog) {
      fullNotes += notes ? `\n\n${notesFromDialog}` : notesFromDialog;
    }

    const formattedData = {
      data: templateControllerRef.current?.() ?? {},
      note: fullNotes,
      submit_behavior: submitType,
      project_id: project?.id,
      trip_id: trip?.id,
      train_class: train_class?.value,
      flight_class: flight_class?.value,
      accommodation_type: accommodation_type?.value,
    };

    mutateSubmit({ id: Number(id), data: formattedData });
  };

  const getExpenseParentBreadcrumb = () => {
    if (isMyExpensesPage) {
      return { label: "My Expense", path: "/my_expenses" };
    } else if (isApprovalsPage) {
      return { label: "Approvals", path: "/approvals" };
    } else if (isReportsPage) {
      return { label: "Reports", path: "/reports" };
    } else {
      return { label: "Dashboard", path: "/" };
    }
  };

  const { label: homeBreadcrumbLabel, path: homeBreadcrumbPath } =
    getExpenseParentBreadcrumb();

  useEffect(() => {
    if (!isFetching && expense && expense.data) {
      if (expense.project) {
        setValue("project", {
          id: expense.project.id,
          code: expense.project.code,
        });
      }
      if (expense.trip) {
        setValue("trip", {
          id: expense.trip.id,
          destination: expense.trip.destination,
        });
      }
      dispatch(addExtractedDocument(expense));
      updateFormValues(expense);
    }
    return () => {
      dispatch(addExtractedDocument(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expense, isFetching]);

  useEffect(() => {
    if (!error) return;
    notifyError("Expense detail fails", formatApiError(error));
  }, [error]);

  const errorCode = submitError?.response?.data?.detail?.error_code;

  useEffect(() => {
    if (errorCode) {
      if (["LIMIT_EXCEEDED", "LIMIT_EXHAUSTED"].includes(errorCode as string)) {
        setLimitExceedDialogOpen(true);
      } else if (errorCode === "DUPLICATE_EXPENSE") {
        setDuplicateBillDialog(true);
      }
    }
  }, [errorCode]);

  if (isFetching)
    return (
      <div className="flex h-full items-center justify-center gap-2">
        <Spinner />
        Fetching expense...
      </div>
    );

  if (error || !expense) return <EmptyState type={"no-document"} />;

  return (
    <section className="@container h-full">
      <Form {...formMethods}>
        <form
          id="extraction-form"
          className="flex h-full flex-col space-y-4 py-4"
          onSubmit={formMethods.handleSubmit(onSubmit)}
        >
          <div className="space-y-4 px-5">
            <Breadcrumb className="text-ash-gray text-xs leading-[100%] font-medium tracking-[-0.2px]">
              <BreadcrumbList className="gap-1 sm:gap-1">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={homeBreadcrumbPath}>{homeBreadcrumbLabel}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{expense.user_expense_id}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <ExpenseViewHeader expense={expense} />
            {expense.status == ReimbursementStatusEnum.PENDING &&
              user &&
              hasAccess(user, [RoleEnum.MANAGER]) && (
                <AlertInfo message="The amount is higher than the employee's allowance. You can review the details and either approve or reject the expense." />
              )}
          </div>
          <div className="min-h-0 flex-1">
            <ExpenseViewList templateControllerRef={templateControllerRef} />
          </div>
          {shouldShowExtractionFooter(expense) && (
            <ExtractionFooter isSubmitting={isSubmitting} />
          )}
        </form>
      </Form>

      <ReimbursementLimitDialog
        isOpen={limitExceedDialogOpen}
        onOpen={setLimitExceedDialogOpen}
        title="Your reimbursement amount exceeds your limit"
        approval_limit={submitError?.response?.data.detail?.approval_limit}
        totalAmount={submitError?.response?.data.detail?.total_amount}
        isLoading={isSubmitting}
        handleSubmit={handleExceedLimitSubmit}
        shouldShowSubmitLimitButton={errorCode !== "LIMIT_EXHAUSTED"}
        errorCode={errorCode}
      />

      <DuplicateBillDialog
        existingExpenseId={
          submitError?.response?.data.detail?.existing_expense_id
        }
        isOpen={duplicateBillDialog}
        onOpen={setDuplicateBillDialog}
        title="Duplicate Bill Detected"
        amount={extractedDocument?.total_amount ?? ""}
        billName={extractedDocument?.name ?? ""}
        date={extractedDocument?.bill_date}
      />
    </section>
  );
};

export default ExpenseView;
