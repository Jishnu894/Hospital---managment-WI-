import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Patient, Report } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

/* ---------- TYPES ---------- */

type User = {
  id?: string;
  username?: string;
  role?: string;
};

interface AppContextType {
  // Auth state
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;

  // Privacy mode
  privacyMode: boolean;
  togglePrivacyMode: () => void;

  // Patient management
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;

  // Report management
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'dateAdded'>) => void;
  deleteReport: (id: string) => void;
  getPatientReports: (patientId: string) => Report[];

  // Temporary file storage
  fileStorage: Map<string, string>;
  storeFile: (reportId: string, fileData: string) => void;
  getFile: (reportId: string) => string | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/* ---------- HELPERS ---------- */

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/* ---------- PROVIDER ---------- */

export function AppProvider({ children }: { children: ReactNode }) {
  // Auth
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage(
    'rhrd_loggedIn',
    false
  );
  const [user, setUser] = useLocalStorage<User | null>(
    'rhrd_user',
    null
  );

  // Privacy mode
  const [privacyMode, setPrivacyMode] = useLocalStorage(
    'rhrd_privacyMode',
    false
  );

  // Data
  const [patients, setPatients] = useLocalStorage<Patient[]>(
    'rhrd_patients',
    []
  );
  const [reports, setReports] = useLocalStorage<Report[]>(
    'rhrd_reports',
    []
  );

  // Temporary file storage
  const [fileStorage] = useState<Map<string, string>>(new Map());

  /* ---------- AUTH ---------- */

  const login = useCallback(
    (userData: User) => {
      setUser(userData);
      setIsLoggedIn(true);
      toast.success('Login successful!');
    },
    [setIsLoggedIn, setUser]
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Logged out successfully');
  }, [setIsLoggedIn, setUser]);

  /* ---------- PRIVACY ---------- */

  const togglePrivacyMode = useCallback(() => {
    setPrivacyMode((prev) => !prev);
    toast.success(
      privacyMode ? 'Privacy mode disabled' : 'Privacy mode enabled'
    );
  }, [privacyMode, setPrivacyMode]);

  /* ---------- PATIENTS ---------- */

  const addPatient = useCallback(
    (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
      const newPatient: Patient = {
        ...patientData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setPatients((prev) => [...prev, newPatient]);
      toast.success('Patient added successfully');
    },
    [setPatients]
  );

  const deletePatient = useCallback(
    (id: string) => {
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setReports((prev) => prev.filter((r) => r.patientId !== id));
      toast.success('Patient deleted successfully');
    },
    [setPatients, setReports]
  );

  const getPatient = useCallback(
    (id: string) => patients.find((p) => p.id === id),
    [patients]
  );

  /* ---------- REPORTS ---------- */

  const addReport = useCallback(
    (reportData: Omit<Report, 'id' | 'dateAdded'>) => {
      const newReport: Report = {
        ...reportData,
        id: generateId(),
        dateAdded: new Date().toISOString(),
      };
      setReports((prev) => [...prev, newReport]);
      toast.success('Report uploaded successfully');
    },
    [setReports]
  );

  const deleteReport = useCallback(
    (id: string) => {
      setReports((prev) => prev.filter((r) => r.id !== id));
      fileStorage.delete(id);
      toast.success('Report deleted successfully');
    },
    [setReports, fileStorage]
  );

  const getPatientReports = useCallback(
    (patientId: string) =>
      reports.filter((r) => r.patientId === patientId),
    [reports]
  );

  /* ---------- FILE STORAGE ---------- */

  const storeFile = useCallback(
    (reportId: string, fileData: string) => {
      fileStorage.set(reportId, fileData);
    },
    [fileStorage]
  );

  const getFile = useCallback(
    (reportId: string) => fileStorage.get(reportId),
    [fileStorage]
  );

  const value: AppContextType = {
    isLoggedIn,
    user,
    login,
    logout,
    privacyMode,
    togglePrivacyMode,
    patients,
    addPatient,
    deletePatient,
    getPatient,
    reports,
    addReport,
    deleteReport,
    getPatientReports,
    fileStorage,
    storeFile,
    getFile,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/* ---------- HOOK ---------- */

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}