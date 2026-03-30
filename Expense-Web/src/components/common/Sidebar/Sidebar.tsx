import { useEffect } from "react";
import {
  Sidebar,
  useSidebar,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";

import MessageBubble from "./MessageBubble";
import useMediaQuery from "@/helpers/hooks/useMediaQuery";

const AppSidebar = () => {
  const { setOpen } = useSidebar();
  const isTablet = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isTablet) setOpen(false);
  }, [isTablet]);

  return (
    <Sidebar
      variant="inset"
      className="top-[60px] p-0"
      mobileClassName="border-r-0"
    >
      <SidebarHeader className="bg-lavender-veil border-b-2 border-b-white px-4 py-5 text-base font-semibold md:px-5">
        Z - Transact Agent
      </SidebarHeader>
      <SidebarContent className="bg-lavender-veil text-ash-gray scrollbar-thin flex h-full flex-1 flex-col space-y-3 overflow-y-auto p-4 text-sm font-normal md:px-[30px]">
        <MessageBubble
          isUser={false}
          text="Hi! I'm your AI assistant for documents. I can help you upload
          documents, extract data, process invoices, match POs, and more. You
          can upload files directly in our chat or ask me anything!"
        />
        <MessageBubble isUser text="Hello" />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
