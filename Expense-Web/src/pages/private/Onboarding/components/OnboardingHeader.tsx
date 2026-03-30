import { CLIENT_LOGO } from "@/helpers/constants/common";

const OnboardingHeader = () => {
  return (
    <div className="flex items-center justify-between px-7.5 pt-3 md:pt-0">
      <img
        src="assets/icons/z-logo-transparent.svg"
        alt="z logo"
        className="w-8.5 object-contain md:hidden"
      />
      <img
        src={CLIENT_LOGO}
        alt="logo"
        className="ml-auto h-[42px] w-[98px] object-contain"
      />
    </div>
  );
};

export default OnboardingHeader;
