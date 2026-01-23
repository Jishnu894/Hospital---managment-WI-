import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadSectionProps {
  preselectedPatientId?: string;
}

const reportTypes = ['Blood Test', 'X-ray', 'Prescription', 'Other'] as const;

export function UploadSection({ preselectedPatientId }: UploadSectionProps) {
  const { patients, addReport, storeFile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPatientId, setSelectedPatientId] = useState(preselectedPatientId || '');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Update patient selection when preselected changes
  useEffect(() => {
    if (preselectedPatientId) {
      setSelectedPatientId(preselectedPatientId);
    }
  }, [preselectedPatientId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate PDF
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedPatientId) {
      toast.error('Please select a patient');
      return;
    }
    if (!selectedReportType) {
      toast.error('Please select a report type');
      return;
    }
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    setIsUploading(true);

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target?.result as string;
        
        // Add report metadata to storage
        const reportId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Store file in memory
        storeFile(reportId, fileData);
        
        // Add report metadata
        addReport({
          patientId: selectedPatientId,
          fileName: selectedFile.name,
          reportType: selectedReportType as typeof reportTypes[number],
        });

        // Reset form
        setSelectedFile(null);
        setSelectedReportType('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        setIsUploading(false);
      };

      reader.onerror = () => {
        toast.error('Failed to read file');
        setIsUploading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast.error('Upload failed');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Upload Report</h2>
        <p className="text-muted-foreground">Add new medical reports for patients</p>
      </div>

      <div className="max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Medical Report
            </CardTitle>
            <CardDescription>
              Upload PDF files for patient medical records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Selection */}
            <div className="space-y-2">
              <Label>Select Patient *</Label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      No patients found. Add a patient first.
                    </div>
                  ) : (
                    patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.village}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Report Type */}
            <div className="space-y-2">
              <Label>Report Type *</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Input */}
            <div className="space-y-2">
              <Label>PDF File *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-8 h-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium text-foreground">Click to select PDF</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Maximum file size: 10MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={isUploading || !selectedPatientId || !selectedReportType || !selectedFile}
            >
              {isUploading ? 'Uploading...' : 'Upload Report'}
            </Button>

            {/* Info Note */}
            <div className="flex items-start gap-2 p-3 bg-muted rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong>Note:</strong> Files are stored temporarily in browser memory.
                After page refresh, you'll need to re-upload to view/download.
                Metadata is saved in localStorage.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
