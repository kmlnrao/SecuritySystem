import { ComingSoonPage } from "@/components/coming-soon-page";
import MasterTablesPage from "@/pages/master-tables-page";

interface DynamicDocumentContentProps {
  documentName: string;
  documentPath: string;
}

const documentDescriptions: Record<string, string> = {
  'Appointment History': 'View and manage historical appointment records and patient visit history.',
  'Schedule Appointment': 'Book new appointments and manage scheduling for patients and doctors.',
  'View Appointments': 'View current and upcoming appointments with detailed information.',
  'Patient Details': 'View comprehensive patient information and medical profiles.',
  'Patient List': 'Browse and search through all registered patients in the system.',
  'Patient Registration': 'Register new patients and capture essential medical information.',
  'Medical History': 'Access and manage patient medical histories and treatment records.',
  'Prescriptions': 'Manage patient prescriptions and medication records.',
  'Test Results': 'View and manage laboratory test results and diagnostic reports.',
  'Lab Tests': 'Order and manage laboratory tests for patients.',
  'Lab Reports': 'Generate and view comprehensive laboratory reports.',
  'Dispense Medicine': 'Process medicine dispensing and track pharmaceutical inventory.',
  'Medicine Inventory': 'Manage pharmaceutical stock levels and inventory tracking.',
  'System Settings': 'Configure system-wide settings and administrative preferences.',
  'Test Documnet': 'Test document functionality and system integration features.',
  'Master Tables': 'Configure and manage dynamic master tables for hospital data management.',
};

export function DynamicDocumentContent({ documentName, documentPath }: DynamicDocumentContentProps) {
  // Route to specific components based on document path
  if (documentPath === '/masters' || documentName === 'Master Tables') {
    return <MasterTablesPage />;
  }
  
  const description = documentDescriptions[documentName] || `The ${documentName} module provides essential functionality for hospital management operations.`;
  
  return (
    <ComingSoonPage 
      title={documentName}
      description={description}
    />
  );
}