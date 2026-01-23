// Patient data model
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phoneOrId: string;
  village: string;
  createdAt: string;
}

// Report data model
export interface Report {
  id: string;
  patientId: string;
  fileName: string;
  reportType: 'Blood Test' | 'X-ray' | 'Prescription' | 'Other';
  dateAdded: string;
  fileData?: string; // Base64 encoded file data (temporary, lost on refresh)
}

// App state
export interface AppState {
  isLoggedIn: boolean;
  privacyMode: boolean;
  patients: Patient[];
  reports: Report[];
}
