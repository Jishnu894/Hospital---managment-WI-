import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddPatientModal } from './AddPatientModal';
import { PatientDetailModal } from './PatientDetailModal';
import { Search, Plus, User, MapPin, Trash2, Eye, Users } from 'lucide-react';

interface PatientsSectionProps {
  onNavigateToUpload: (patientId: string) => void;
}

export function PatientsSection({ onNavigateToUpload }: PatientsSectionProps) {
  const { patients, deletePatient, privacyMode, getPatientReports } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Filter patients based on search query
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    
    const query = searchQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.village.toLowerCase().includes(query) ||
        p.phoneOrId.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  // Get initials for privacy mode
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Patients</h2>
          <p className="text-muted-foreground">Manage patient records</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, village, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Patient List */}
      {filteredPatients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">
              {patients.length === 0 ? 'No patients yet' : 'No matching patients'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {patients.length === 0
                ? 'Click "Add Patient" to create your first patient record.'
                : 'Try adjusting your search query.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => {
            const reportsCount = getPatientReports(patient.id).length;
            
            return (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${privacyMode ? 'blur-sm' : ''}`}>
                          {privacyMode ? getInitials(patient.name) : patient.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.age} yrs • {patient.gender}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{reportsCount} reports</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{patient.village}</span>
                    {patient.phoneOrId && (
                      <>
                        <span>•</span>
                        <span className={privacyMode ? 'blur-sm' : ''}>{patient.phoneOrId}</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deletePatient(patient.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      <PatientDetailModal
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onUploadReport={onNavigateToUpload}
      />
    </div>
  );
}
