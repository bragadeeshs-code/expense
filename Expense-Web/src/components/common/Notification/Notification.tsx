import { Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { useNotifications } from "./context/NotificationContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MarkAllReadButton from "./components/MarkAllReadButton";
import NotificationList from "./components/NotificationList";

const Notification = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { hasNew, clearNew } = useNotifications();

  const onToggle = (open: boolean) => {
    setIsOpen(open);
    if (open) clearNew();
  };

  const goToDetails = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  return (
    <Popover open={isOpen} onOpenChange={onToggle}>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]" />
      )}

      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-none">
          <Bell className="text-slate-charcoal h-6 w-6" />
          {hasNew && (
            <span className="bg-indigo-violet absolute top-1.5 right-2.5 h-2 w-2 rounded-full border-2 border-white" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="shadow-gray-soft z-1000 flex max-h-[min(80vh,35rem)] w-[20rem] flex-col overflow-hidden rounded-2xl p-0 md:w-[500px]"
      >
        <div className="border-porcelain flex items-center justify-between gap-4 border-b px-5 py-4">
          <h2 className="text-xl font-bold whitespace-nowrap text-black">
            Notification
          </h2>
          <MarkAllReadButton />
        </div>
        {/* Main List Area */}
        <div className="scrollbar-thin flex-1 overflow-y-auto">
          <NotificationList
            perPage={5}
            truncateItems={true}
            onViewMoreClick={goToDetails}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
