import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { PatientsSection } from './PatientsSection';
import { ReportsSection } from './ReportsSection';
import { UploadSection } from './UploadSection';
import { SettingsSection } from './SettingsSection';

export function Dashboard() {
  const [activeSection, setActiveSection] = useState('patients');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadPatientId, setUploadPatientId] = useState<string | undefined>();

  // Navigate to upload with preselected patient
  const handleNavigateToUpload = (patientId: string) => {
    setUploadPatientId(patientId);
    setActiveSection('upload');
  };

  // Clear patient selection when leaving upload
  const handleSectionChange = (section: string) => {
    if (section !== 'upload') {
      setUploadPatientId(undefined);
    }
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-6xl mx-auto">
          {activeSection === 'patients' && (
            <PatientsSection onNavigateToUpload={handleNavigateToUpload} />
          )}
          {activeSection === 'reports' && <ReportsSection />}
          {activeSection === 'upload' && (
            <UploadSection preselectedPatientId={uploadPatientId} />
          )}
          {activeSection === 'settings' && <SettingsSection />}
        </div>
      </main>
    </div>
  );
}
