import { ASSET_PATH } from "@/helpers/constants/common";

interface TripTimelineProps {
  toAddress: string;
  fromAddress: string;
  activityTime?: string;
}

const TripTimeline = ({
  toAddress,
  fromAddress,
  activityTime,
}: TripTimelineProps) => {
  const [startTime, endTime] = activityTime?.split(" - ") || ["N/A", "N/A"];

  const timelinePoints = [
    {
      title: "Started from",
      address: fromAddress,
      time: startTime,
      icon: "home.svg",
    },
    {
      title: "Arrived at",
      address: toAddress,
      time: endTime,
      icon: "case.svg",
    },
  ];

  return (
    <div className="relative mt-8 space-y-8 pl-8">
      <div className="absolute top-0 bottom-1 left-[11px] border-l-2 border-dashed border-gray-200" />

      {timelinePoints.map((point, idx) => (
        <div key={idx} className="relative">
          <div className="bg-light-pink absolute top-0 -left-8 z-10 flex h-6 w-6 items-center justify-center rounded-lg shadow-sm">
            <img
              src={`${ASSET_PATH}/icons/${point.icon}`}
              className="h-3.5 w-3.5"
              alt={point.title}
            />
          </div>
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-gray-900">{point.title}</h4>
              <p className="text-cool-gray mt-1 max-w-[200px] text-[11px] leading-relaxed font-medium">
                {point.address}
              </p>
            </div>
            <span className="text-cool-gray shrink-0 text-[11px] font-bold">
              {point.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripTimeline;
