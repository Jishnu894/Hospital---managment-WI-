import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Patient, Report } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface AppContextType {
  // Auth state
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
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
  
  // Temporary file storage (in memory only)
  fileStorage: Map<string, string>;
  storeFile: (reportId: string, fileData: string) => void;
  getFile: (reportId: string) => string | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function AppProvider({ children }: { children: ReactNode }) {
  // Auth state persisted in localStorage
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('rhrd_loggedIn', false);
  
  // Privacy mode persisted
  const [privacyMode, setPrivacyMode] = useLocalStorage('rhrd_privacyMode', false);
  
  // Patient and report data persisted
  const [patients, setPatients] = useLocalStorage<Patient[]>('rhrd_patients', []);
  const [reports, setReports] = useLocalStorage<Report[]>('rhrd_reports', []);
  
  // Temporary file storage (lost on refresh)
  const [fileStorage] = useState<Map<string, string>>(new Map());

  // Login function (fake authentication)
  const login = useCallback((username: string, password: string): boolean => {
    // Simple validation - accept any non-empty credentials
    if (username.trim() && password.trim()) {
      setIsLoggedIn(true);
      toast.success('Login successful!');
      return true;
    }
    toast.error('Please enter both username and password');
    return false;
  }, [setIsLoggedIn]);

  // Logout function
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
  }, [setIsLoggedIn]);

  // Toggle privacy mode
  const togglePrivacyMode = useCallback(() => {
    setPrivacyMode(prev => !prev);
    toast.success(privacyMode ? 'Privacy mode disabled' : 'Privacy mode enabled');
  }, [privacyMode, setPrivacyMode]);

  // Add a new patient
  const addPatient = useCallback((patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setPatients(prev => [...prev, newPatient]);
    toast.success('Patient added successfully');
  }, [setPatients]);

  // Delete a patient and their reports
  const deletePatient = useCallback((id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setReports(prev => prev.filter(r => r.patientId !== id));
    toast.success('Patient deleted successfully');
  }, [setPatients, setReports]);

  // Get a single patient by ID
  const getPatient = useCallback((id: string) => {
    return patients.find(p => p.id === id);
  }, [patients]);

  // Add a new report
  const addReport = useCallback((reportData: Omit<Report, 'id' | 'dateAdded'>) => {
    const newReport: Report = {
      ...reportData,
      id: generateId(),
      dateAdded: new Date().toISOString(),
    };
    setReports(prev => [...prev, newReport]);
    toast.success('Report uploaded successfully');
    return newReport.id;
  }, [setReports]);

  // Delete a report
  const deleteReport = useCallback((id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    fileStorage.delete(id);
    toast.success('Report deleted successfully');
  }, [setReports, fileStorage]);

  // Get all reports for a patient
  const getPatientReports = useCallback((patientId: string) => {
    return reports.filter(r => r.patientId === patientId);
  }, [reports]);

  // Store file data in memory
  const storeFile = useCallback((reportId: string, fileData: string) => {
    fileStorage.set(reportId, fileData);
  }, [fileStorage]);

  // Get file data from memory
  const getFile = useCallback((reportId: string) => {
    return fileStorage.get(reportId);
  }, [fileStorage]);

  const value: AppContextType = {
    isLoggedIn,
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
