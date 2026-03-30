import { configureStore } from "@reduxjs/toolkit";

import navbarReducer from "./features/navbar/navbarSlice";
import onboardingReducer from "@/pages/private/Onboarding/state-management/features/onboardingSlice";
import onboardingProjectsListControllerReducer from "@/pages/private/Onboarding/state-management/features/onboardingProjectsListControllerSlice";
import companyGradesListReducer from "./features/companyGradesListSlice";
import projectListControllerReducer from "@/pages/private/Projects/state-management/projectsListControllerSlice";
import employeeListControllerReducer from "./features/employeeListControllerSlice";
import teamsExpensesSummaryListReducer from "./features/teamsExpensesSummaryListSlice";

import employeeListReducer from "@/pages/private/Onboarding/state-management/features/employeeListSlice";
import teamMemberListReducer from "@/pages/private/TeamWorkspace/state-management/features/teamMemberListSlice";
import extractedDocumentReducer from "@/pages/private/Extraction/state-management/features/extractedDocumentSlice";
import companyAssetsListControllerReducer from "@/pages/private/Onboarding/state-management/features/companyAssetsListslice";
import companyCostCentersListControllerReducer from "@/state-management/features/companyCostCentersListSlice";
import onboardingCostCentersListControllerReducer from "@/pages/private/Onboarding/state-management/features/onboardingCostCentersListSlice";
import uploadedDocumentListControllerReducer from "@/pages/private/Extraction/state-management/features/uploadedDocumentListSlice";
import reimbursementListControllerReducer from "@/state-management/features/reimbursementListControllerSlice";
import teamsExpenseListControllerReducer from "@/pages/private/TeamWorkspace/state-management/features/teamsExpensesListControllerSlice";
import myExpenseReportListReducer from "@/pages/private/Reports/state-management/features/myExpenseReportListSlice";
import gradesListControllerReducer from "@/pages/private/Onboarding/state-management/features/gradesListSlice";
import userDashboardReimbursementListControllerSlice from "@/pages/private/UserDashboard/state-management/features/userDashboardReimbursementListControllerSlice";
import onboardingDepartmentsListControllerReducer from "@/pages/private/Onboarding/state-management/features/onboardingDepartmentsListSlice";
import companyDepartmentsListControllerReducer from "@/state-management/features/companyDepartmentsListSlice";
import tripsControllerReducer from "@/pages/private/Trip/helpers/state-management/features/tripsControllerSlice";
import mileageMyTravelListSlice from "./features/mileageMyTravelListSlice";
import mileageTeamTravelListSlice from "./features/mileageTeamTravelListSlice";
import teamTripsControllerReducer from "@/pages/private/Trip/helpers/state-management/features/teamTripsControllerSlice";
import advancesControllerReducer from "@/pages/private/Advances/helpers/state-management/features/advancesControllerSlice";
import issuedAdvancesControllerReducer from "@/pages/private/Advances/helpers/state-management/features/issuedAdvancesControllerSlice";
import financeExpensesListControllerReducer from "@/pages/private/FinanceDashboard/state-management/feature/financeExpensesListSlice";

export const store = configureStore({
  reducer: {
    navbar: navbarReducer,
    onboarding: onboardingReducer,
    onboardingProjectListController: onboardingProjectsListControllerReducer,
    employeeList: employeeListReducer,
    teamMemberList: teamMemberListReducer,
    extractedDocument: extractedDocumentReducer,
    companyGradesList: companyGradesListReducer,
    myExpenseReportList: myExpenseReportListReducer,
    gradesListController: gradesListControllerReducer,
    projectsListController: projectListControllerReducer,
    employeeListController: employeeListControllerReducer,
    teamExpenseSummaryList: teamsExpensesSummaryListReducer,
    teamsExpenseListController: teamsExpenseListControllerReducer,
    companyAssetsListController: companyAssetsListControllerReducer,
    reimbursementListController: reimbursementListControllerReducer,
    uploadedDocumentListController: uploadedDocumentListControllerReducer,
    companyCostCentersListController: companyCostCentersListControllerReducer,
    onboardingCostCentersListController:
      onboardingCostCentersListControllerReducer,
    userDashboardReimbursementListControllerSlice:
      userDashboardReimbursementListControllerSlice,
    mileageMyTravelList: mileageMyTravelListSlice,
    mileageTeamTravelList: mileageTeamTravelListSlice,
    onboardingDepartmentsListController:
      onboardingDepartmentsListControllerReducer,
    companyDepartmentsListController: companyDepartmentsListControllerReducer,
    tripsController: tripsControllerReducer,
    teamTripsController: teamTripsControllerReducer,
    advancesController: advancesControllerReducer,
    issuedAdvancesController: issuedAdvancesControllerReducer,
    financeExpensesListController: financeExpensesListControllerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
