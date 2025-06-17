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
import MasterTablesPage from "@/pages/master-tables-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      
      {/* Appointment Routes */}
      <ProtectedRoute path="/appointments/history" component={AppointmentHistoryPage} />
      <ProtectedRoute path="/appointments/schedule" component={ScheduleAppointmentPage} />
      <ProtectedRoute path="/appointments/view" component={ViewAppointmentsPage} />
      
      {/* Patient Routes */}
      <ProtectedRoute path="/patients/details" component={PatientDetailsPage} />
      <ProtectedRoute path="/patients/list" component={PatientListPage} />
      <ProtectedRoute path="/patients/register" component={PatientRegistrationPage} />
      
      {/* Medical Records Routes */}
      <ProtectedRoute path="/records/history" component={MedicalHistoryPage} />
      <ProtectedRoute path="/records/prescriptions" component={PrescriptionsPage} />
      <ProtectedRoute path="/records/tests" component={TestResultsPage} />
      
      {/* Laboratory Routes */}
      <ProtectedRoute path="/lab/tests" component={LabTestsPage} />
      <ProtectedRoute path="/lab/reports" component={LabReportsPage} />
      
      {/* Pharmacy Routes */}
      <ProtectedRoute path="/pharmacy/dispense" component={DispenseMedicinePage} />
      <ProtectedRoute path="/pharmacy/inventory" component={MedicineInventoryPage} />
      
      {/* Administration Routes */}
      <ProtectedRoute path="/admin/settings" component={SystemSettingsPage} />
      <ProtectedRoute path="/admin/TestDoc" component={TestDocumentPage} />
      
      {/* Master Tables Routes */}
      <ProtectedRoute path="/masters" component={MasterTablesPage} />
      <ProtectedRoute path="/masters/tables" component={MasterTablesPage} />
      
      {/* Auth Route */}
      <Route path="/auth" component={AuthPage} />
      
      {/* 404 Route */}
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
