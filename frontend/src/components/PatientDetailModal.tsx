import { useApp } from '@/contexts/AppContext';
import { Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, MapPin, Phone, Calendar, FileText, Trash2, Upload } from 'lucide-react';
import { format } from 'date-fns';

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onUploadReport: (patientId: string) => void;
}

export function PatientDetailModal({ patient, isOpen, onClose, onUploadReport }: PatientDetailModalProps) {
  const { getPatientReports, deleteReport, privacyMode, getFile } = useApp();

  if (!patient) return null;

  const reports = getPatientReports(patient.id);

  // Get initials for privacy mode
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Patient Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info Card */}
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${privacyMode ? 'blur-sm' : ''}`}>
                {privacyMode ? getInitials(patient.name) : patient.name}
              </h3>
              <Badge variant="secondary">{patient.gender}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Age: {patient.age} years</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{patient.village}</span>
              </div>
              {patient.phoneOrId && (
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <Phone className="w-4 h-4" />
                  <span className={privacyMode ? 'blur-sm' : ''}>{patient.phoneOrId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reports Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Medical Reports ({reports.length})
              </h4>
              <Button
                size="sm"
                onClick={() => {
                  onClose();
                  onUploadReport(patient.id);
                }}
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
            </div>

            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6 bg-muted rounded-lg">
                No reports uploaded yet
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {reports.map((report) => {
                  const hasFile = getFile(report.id);
                  return (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-8 h-8 text-destructive flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{report.fileName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {report.reportType}
                            </Badge>
                            <span>{format(new Date(report.dateAdded), 'MMM d, yyyy')}</span>
                          </div>
                          {!hasFile && (
                            <p className="text-xs text-warning mt-1">Re-upload to view</p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteReport(report.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
