import { RoleEnum } from "@/helpers/constants/common";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";
import { hasAccess } from "@/lib/utils";
import ExpenseView from "@/pages/private/ExpenseView/ExpenseView";
import FinanceExpenseView from "@/pages/private/FinanceDashboard/components/FinanceExpenseView";

const ExpenseViewWrapper = () => {
  const { data: user } = useCurrentuser();
  if (!user) return null;

  if (hasAccess(user, [RoleEnum.FINANCER])) {
    return <FinanceExpenseView />;
  }
  return <ExpenseView />;
};
export default ExpenseViewWrapper;
