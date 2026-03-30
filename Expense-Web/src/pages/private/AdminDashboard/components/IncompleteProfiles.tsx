import AvatarGroup from "../../../../components/common/AvatarGroup";

interface IncompleteProfilesProps {
  pendingInvitations?: string[];
}

const IncompleteProfiles: React.FC<IncompleteProfilesProps> = ({
  pendingInvitations = [],
}) => {
  return (
    <div className="border-athens-gray shadow-ambient flex flex-col gap-6 rounded-2xl px-6 py-8">
      <h3 className="text-base leading-[100%] font-medium tracking-[-0.2px] text-black">
        Incomplete profiles
      </h3>
      <AvatarGroup maxAvatars={4} size="40" avatars={pendingInvitations} />
    </div>
  );
};

export default IncompleteProfiles;
