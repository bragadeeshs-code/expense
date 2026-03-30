import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";

import { store } from "./state-management/store";
import { Toaster } from "./components/ui/sonner";
import { RoleEnum } from "./helpers/constants/common";
import { RoleGuard } from "./guards/RoleGuard";
import { queryClient } from "./lib/queryClient";

import Reports from "./pages/private/Reports/Reports";
import Company from "./pages/private/Company/Company";
import Projects from "./pages/private/Projects/Projects";
import AppLayout from "./layout/AppLayout";
import AuthGuard from "./guards/AuthGuard";
import Approvals from "./pages/private/Approvals/Approvals";
import Dashboard from "./pages/private/Dashboard/Dashboard";
import Onboarding from "./pages/private/Onboarding/Onboarding";
import Extraction from "./pages/private/Extraction/Extraction";
import ExpenseView from "./pages/private/ExpenseView/ExpenseView";
import Notifications from "./pages/private/Notifications/Notifications";
import TeamWorkspace from "./pages/private/TeamWorkspace/TeamWorkspace";
import UserManagement from "./pages/private/UserManagement/UserManagement";
import MileageCalculator from "./pages/private/MileageCalculator/MileageCalculator";
import MileageTripDetails from "./pages/private/MileageCalculator/MileageTripDetails";
import Trip from "./pages/private/Trip/Trip";
import Advances from "./pages/private/Advances/Advances";
import ExpenseViewWrapper from "./components/common/ExpenseViewWrapper";

function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={import.meta.env.VITE_BASE_URL}>
          <Routes>
            <Route element={<AuthGuard />}>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route
                  path="notifications"
                  element={
                    <RoleGuard>
                      <Notifications />
                    </RoleGuard>
                  }
                />
                <Route path=":id" element={<ExpenseViewWrapper />} />
                <Route
                  path="my_expenses"
                  element={
                    <RoleGuard access={[RoleEnum.USER, RoleEnum.MANAGER]}>
                      <Extraction />
                    </RoleGuard>
                  }
                >
                  <Route path=":id" element={<ExpenseView />} />
                </Route>
                <Route
                  path="trip"
                  element={
                    <RoleGuard access={[RoleEnum.USER, RoleEnum.MANAGER]}>
                      <Trip />
                    </RoleGuard>
                  }
                />
                <Route
                  path="advances"
                  element={
                    <RoleGuard access={[RoleEnum.FINANCER]}>
                      <Advances />
                    </RoleGuard>
                  }
                />
                <Route
                  path="user_management"
                  element={
                    <RoleGuard access={[RoleEnum.ADMIN]}>
                      <UserManagement />
                    </RoleGuard>
                  }
                />
                <Route
                  path="team_workspace"
                  element={
                    <RoleGuard access={[RoleEnum.MANAGER]}>
                      <TeamWorkspace />
                    </RoleGuard>
                  }
                />
                <Route
                  path="approvals"
                  element={
                    <RoleGuard access={[RoleEnum.MANAGER]}>
                      <Approvals />
                    </RoleGuard>
                  }
                >
                  <Route path=":id" element={<ExpenseView />} />
                </Route>
                <Route
                  path="reports"
                  element={
                    <RoleGuard access={[RoleEnum.MANAGER, RoleEnum.USER]}>
                      <Reports />
                    </RoleGuard>
                  }
                >
                  <Route path=":id" element={<ExpenseView />} />
                </Route>
                <Route
                  path="company"
                  element={
                    <RoleGuard access={[RoleEnum.ADMIN]}>
                      <Company />
                    </RoleGuard>
                  }
                />
                <Route
                  path="projects"
                  element={
                    <RoleGuard access={[RoleEnum.ADMIN]}>
                      <Projects />
                    </RoleGuard>
                  }
                />
                <Route path="mileage" element={<MileageCalculator />} />

                <Route path="mileage/:id" element={<MileageTripDetails />} />
              </Route>

              <Route
                path="onboarding"
                element={
                  <RoleGuard access={[RoleEnum.ADMIN]}>
                    <Onboarding />
                  </RoleGuard>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
