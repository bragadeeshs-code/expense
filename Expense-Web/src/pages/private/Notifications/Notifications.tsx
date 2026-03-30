import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationList from "@/components/common/Notification/components/NotificationList";
import MarkAllReadButton from "@/components/common/Notification/components/MarkAllReadButton";
const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Top Header */}
      <div className="border-porcelain flex items-center justify-between border-b px-6 py-5">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8 hover:bg-slate-50"
          >
            <ArrowLeft className="text-slate-charcoal h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-black">All Notifications</h1>
        </div>

        <MarkAllReadButton textClassName="font-bold" />
      </div>

      {/* Main List Area */}
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <NotificationList className="max-w-4xl px-6 py-6" />
      </div>
    </div>
  );
};

export default Notifications;
