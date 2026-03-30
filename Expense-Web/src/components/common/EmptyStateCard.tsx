import { ASSET_PATH } from "@/helpers/constants/common";

interface EmptyStateCardProps {
  message: string;
  children: React.ReactNode;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  message,
  children,
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center sm:min-h-0">
      <img
        src={`${ASSET_PATH}/icons/empty_folder_image.svg`}
        alt="no_folder_icon"
        className="h-32 w-32 sm:h-52 sm:w-52"
      />
      <p className="text-graphite-gray max-w-72 text-center text-sm leading-[140%] font-normal tracking-[0%] italic sm:max-w-96">
        {message}
      </p>
      {children}
    </div>
  );
};

export default EmptyStateCard;
