import { quickActions } from "../helpers/constants/admin-dashboard";
import QuickActionItem from "./QuickActionItem";

const QuickActions = () => {
  return (
    <div className="bg-purple-lavender-mist border-light-lavender-purple shadow-ambient space-y-6 rounded-2xl border px-6 py-5">
      <h3 className="text-base leading-[100%] font-medium tracking-[-0.2px] text-black">
        Quick actions
      </h3>
      <div className="flex flex-col flex-wrap gap-2.5 @lg:flex-row">
        {quickActions.map((quickAction) => (
          <QuickActionItem
            label={quickAction.label}
            imgSrc={quickAction.icon}
            key={quickAction.label}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
