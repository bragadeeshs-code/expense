interface NavbarItem {
  label: string;
  icon: string;
  href: string;
  activeIcon: string;
  access?: RoleEnum[];
}

interface AppDropdownMenuItem {
  handleClick: () => void;
  icon?: React.ReactElement;
  menuItemTitle: string;
  menuTitleClass?: string;
  shouldShowMenuItem?: boolean;
  className?: string;
}

type FileUploadStatus = "pending" | "uploading" | "uploaded" | "error";

interface NotificationItem {
  id: string;
  type: "action" | "info";
  title: string;
  description: string;
  timestamp: string;
  avatar?: {
    name: string;
  };
  actions?: {
    primary: string;
    secondary: string;
  };
  icon?: React.ReactNode;
}

type NotificationList = NotificationItem[];

interface TabItem<T> {
  value: T;
  label: string;
  access?: RoleEnum[];
}

type MonthFormat = "short" | "long";

interface UploadFileItem {
  id: string;
  file: File;
  progress: number;
  isError: boolean;
  isUploading: boolean;
}

interface RoleDetails extends Role {
  description: string;
}

type RolesResponse = RoleDetails[];

interface AlertItem {
  imgSrc: string;
  message: string;
  type: "warning" | "normal";
}
