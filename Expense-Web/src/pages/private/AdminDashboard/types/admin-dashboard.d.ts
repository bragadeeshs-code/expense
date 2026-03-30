interface QuickActionsItem {
  href: string;
  icon: string;
  label: string;
}

type AssetType = keyof typeof companyAssetChartConfig;

type CompanyAssetCategoryEnum =
  (typeof COMPANY_ASSET_CATEGORY)[keyof typeof COMPANY_ASSET_CATEGORY];

interface CompanyAsset {
  category: CompanyAssetCategoryEnum;
  category_count: number;
}

interface AdminDashboardStats {
  total_assets: number;
  total_projects: number;
  company_assets: CompanyAsset[];
  total_employees: number;
  total_connections: number;
  pending_invitations: string[];
}

type AdminDashboardModeEnum =
  (typeof ADMIN_DASHBOARD_MODE)[keyof typeof ADMIN_DASHBOARD_MODE];
