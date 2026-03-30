import React, { useEffect, useContext, createContext, useState } from "react";

import { ENDPOINTS } from "@/helpers/constants/api-endpoints";

import { SSE_EVENTS } from "@/helpers/constants/sse-events";

interface NotificationContextType {
  hasNew: boolean;
  clearNew: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasNew, setHasNew] = useState<boolean>(false);

  useEffect(() => {
    const sse = new EventSource(
      `${import.meta.env.VITE_API_URL}/${ENDPOINTS.NOTIFICATIONS.STREAM}`,
      { withCredentials: true },
    );

    const handleNotification = () => {
      setHasNew(true);
    };

    sse.addEventListener(SSE_EVENTS.MESSAGE, handleNotification);
    sse.onerror = () => sse.close();

    return () => {
      sse.removeEventListener(SSE_EVENTS.MESSAGE, handleNotification);
      sse.close();
    };
  }, []);

  const clearNew = () => {
    if (hasNew) setHasNew(false);
  };

  return (
    <NotificationContext.Provider value={{ hasNew, clearNew }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  return context;
};
