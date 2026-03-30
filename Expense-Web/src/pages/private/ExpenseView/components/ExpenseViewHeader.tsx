import { startCase } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router";

import type { ExpenseDetails } from "../types/expense-view.types";
import { getHumanReadableDate } from "@/lib/utils";
import { HIDDEN_SCOPE_CATEGORIES } from "../helpers/constants/expenseView";
import {
  ASSET_PATH,
  EMPTY_PLACEHOLDER,
  EXPENSE_DETAILS_QUERY_KEY,
  ReimbursementStatusEnum,
  TEAM_EXPENSES_LIST_QUERY_KEY,
} from "@/helpers/constants/common";

import AppBadge from "../../../../components/common/AppBadge";
import StepPagination from "../../../../components/common/StepPagination";
import ApproverInfoList from "./ApproverInfoList";
import ApprovalsActions from "../../Approvals/components/ApprovalsActions";
import ApprovalSubmissionSuccessDialog from "../../Approvals/components/ApprovalSubmissionSuccessDialog";

interface ExpenseViewHeaderProps {
  expense: ExpenseDetails;
}

const ExpenseViewHeader: React.FC<ExpenseViewHeaderProps> = ({ expense }) => {
  const [approveSuccessDialogVisibility, setApproveSuccessDialogVisibility] =
    useState<boolean>();

  const queryClient = useQueryClient();

  const {
    name,
    updated_at,
    status,
    scope,
    category,
    sub_category,
    approvers,
    next_id,
    prev_id,
    user_expense_id,
  } = expense;
  const navigate = useNavigate();

  const isMyExpensesPage = useMatch("/my_expenses/*");
  const isApprovalsPage = useMatch("/approvals/*");

  useEffect(() => {
    if (approveSuccessDialogVisibility === false) {
      queryClient.invalidateQueries({
        queryKey: [EXPENSE_DETAILS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [TEAM_EXPENSES_LIST_QUERY_KEY],
      });
    }
  }, [approveSuccessDialogVisibility]);

  return (
    <div className="shadow-header-card border-athens-gray bg-lavender-veil flex flex-col gap-4 rounded-2xl border px-3 py-2.5 @sm:px-6 @sm:py-5 @6xl:flex-row @6xl:items-center @6xl:justify-between">
      <div className="space-y-1">
        <div className="flex flex-col @xs:flex-row @xs:items-center @xs:gap-6">
          <h2 className="text-midnight-black truncate text-sm leading-8 font-semibold tracking-[-1.9%] sm:text-xl @sm:text-2xl">
            {name}
          </h2>
          {status && <AppBadge type={status}>{status}</AppBadge>}
        </div>
        <div className="flex flex-col gap-2 @md:gap-0 @lg:flex-row @lg:items-center @lg:gap-2">
          <span className="text-steel-gray text-sm leading-5 tracking-[-0.6%]">
            Uploaded on <strong>{getHumanReadableDate(updated_at)}</strong>
          </span>
          <span className="hidden @lg:block">&#8729;</span>
          <div className="flex flex-col gap-2 @sm:flex-row">
            {!HIDDEN_SCOPE_CATEGORIES.includes(category) && (
              <div className="bg-mint-frost flex w-fit items-center gap-1.5 rounded-md p-1 text-xs font-medium text-black">
                <img src={`${ASSET_PATH}/icons/leaf.svg`} alt="icon" />
                <span>28 Kg CO2e · Scope {scope ?? EMPTY_PLACEHOLDER}</span>
              </div>
            )}
            {(category || sub_category) && (
              <AppBadge type="BASIC">
                {startCase(category) ?? EMPTY_PLACEHOLDER}
                {sub_category && " . " + startCase(sub_category)}
              </AppBadge>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 @lg:flex-row @lg:gap-6.5">
        {!!approvers?.length && (
          <ApproverInfoList
            items={approvers}
            className="border-slate-whisper border-r border-dashed pr-3"
          />
        )}
        {isApprovalsPage ? (
          status === ReimbursementStatusEnum.PENDING && (
            <ApprovalsActions
              userExpenseId={user_expense_id}
              setApproveSuccessDialogVisibility={
                setApproveSuccessDialogVisibility
              }
            />
          )
        ) : (
          <StepPagination
            previousButtonClassName="size-8"
            nextButtonClassName="size-8"
            isNextButtonDisabled={!next_id}
            isPreviousButtonDisabled={!prev_id}
            onNext={() =>
              isMyExpensesPage
                ? navigate(`/my_expenses/${next_id}`)
                : navigate(`/${next_id}`)
            }
            onPrevious={() =>
              isMyExpensesPage
                ? navigate(`/my_expenses/${prev_id}`)
                : navigate(`/${prev_id}`)
            }
          />
        )}
      </div>
      <ApprovalSubmissionSuccessDialog
        isOpen={!!approveSuccessDialogVisibility}
        setApproveSuccessDialogVisibility={setApproveSuccessDialogVisibility}
      />
    </div>
  );
};

export default ExpenseViewHeader;
