import { AlignVerticalDistributeCenter } from "lucide-react";

import React from "react";

import { ASSET_PATH } from "@/helpers/constants/common";
import { EXPENSE_TRAVEL_ENUM } from "@/pages/private/MileageCalculator/helpers/constants/mileage";
import { useMileageDashboardMetrics } from "@/pages/private/MileageCalculator/helpers/hooks/useMileageDashboardMetrics";
import {
  formatAmount,
  formatDistance,
  formatCarbonEmission,
} from "../helpers/utils/mileageUtils";
import type {
  TeamDashboardMetrics,
  IndividualDashboardMetrics,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

import MetricCard from "@/pages/private/MileageCalculator/components/MetricCard";

interface MileageDashboardMetricsProps {
  activeTab: EXPENSE_TRAVEL_ENUM;
}

const MileageDashboardMetrics: React.FC<MileageDashboardMetricsProps> = ({
  activeTab,
}) => {
  const { data, isLoading } = useMileageDashboardMetrics(activeTab);

  if (activeTab === EXPENSE_TRAVEL_ENUM.TEAM_TRAVEL) {
    const metrics = data as TeamDashboardMetrics;
    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Team Distance Traveled"
          value={`${formatDistance(metrics?.total_distance || "0")} km`}
          icon={
            <img
              src={`${ASSET_PATH}/icons/checkmark-badge.svg`}
              width={20}
              height={20}
            />
          }
          isLoading={isLoading}
        />
        <MetricCard
          title="Carbon Emissions"
          value={formatCarbonEmission(metrics?.total_carbon_emission)}
          icon={
            <img
              src={`${ASSET_PATH}/icons/clock_dashed.svg`}
              width={20}
              height={20}
            />
          }
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Claim Amount"
          value={`₹${formatAmount(metrics?.total_claim_amount || "0")}`}
          icon={
            <img
              src={`${ASSET_PATH}/icons/clock_dashed.svg`}
              width={20}
              height={20}
            />
          }
          isLoading={isLoading}
        />
        <MetricCard
          title="Approved This Month"
          value={`₹${formatAmount(metrics?.total_approved_amount || "0")}`}
          icon={
            <img
              src={`${ASSET_PATH}/icons/clock_dashed.svg`}
              width={20}
              height={20}
            />
          }
          isLoading={isLoading}
        />
        <MetricCard
          title="Pending Approvals"
          value={
            metrics?.pending_count !== undefined
              ? metrics.pending_count.toString()
              : "0"
          }
          icon={
            <img
              src={`${ASSET_PATH}/icons/clock_dashed.svg`}
              width={20}
              height={20}
            />
          }
          isLoading={isLoading}
        />
      </div>
    );
  }

  const metrics = data as IndividualDashboardMetrics;
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total distance logged"
        value={`${formatDistance(metrics?.total_distance || "0")} km`}
        icon={<AlignVerticalDistributeCenter size={18} strokeWidth={2.5} />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Total Carbon Emission"
        value={formatCarbonEmission(metrics?.total_carbon_emission)}
        icon={
          <img
            src={`${ASSET_PATH}/icons/clock_dashed.svg`}
            width={20}
            height={20}
          />
        }
        isLoading={isLoading}
      />
      <MetricCard
        title="Total claim amount"
        value={`₹${formatAmount(metrics?.total_claim_amount || "0")}`}
        icon={
          <img
            src={`${ASSET_PATH}/icons/databases.svg`}
            width={20}
            height={20}
          />
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default MileageDashboardMetrics;
