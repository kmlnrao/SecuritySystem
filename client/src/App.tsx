import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import DashboardPage from "@/pages/dashboard-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";

// Import all page components
import AppointmentHistoryPage from "@/pages/appointment-history-page";
import ScheduleAppointmentPage from "@/pages/schedule-appointment-page";
import ViewAppointmentsPage from "@/pages/view-appointments-page";
import PatientDetailsPage from "@/pages/patient-details-page";
import PatientListPage from "@/pages/patient-list-page";
import PatientRegistrationPage from "@/pages/patient-registration-page";
import MedicalHistoryPage from "@/pages/medical-history-page";
import PrescriptionsPage from "@/pages/prescriptions-page";
import TestResultsPage from "@/pages/test-results-page";
import LabTestsPage from "@/pages/lab-tests-page";
import LabReportsPage from "@/pages/lab-reports-page";
import DispenseMedicinePage from "@/pages/dispense-medicine-page";
import MedicineInventoryPage from "@/pages/medicine-inventory-page";
import SystemSettingsPage from "@/pages/system-settings-page";
import TestDocumentPage from "@/pages/test-document-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
