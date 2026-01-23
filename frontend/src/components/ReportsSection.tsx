import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Report } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PDFPreviewModal } from './PDFPreviewModal';
import { Search, FileText, Trash2, Eye, Download, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';

export function ReportsSection() {
  const { reports, patients, deleteReport, privacyMode, getFile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Get patient name by ID
  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return 'Unknown Patient';
    
    if (privacyMode) {
      return patient.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return patient.name;
  };

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let result = reports;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.fileName.toLowerCase().includes(query) ||
          r.reportType.toLowerCase().includes(query) ||
          getPatientName(r.patientId).toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'oldest':
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case 'name':
          return a.fileName.localeCompare(b.fileName);
        default:
          return 0;
      }
    });

    return result;
  }, [reports, searchQuery, sortBy, privacyMode]);

  const handleDownload = (report: Report) => {
    const fileData = getFile(report.id);
    if (!fileData) return;
    
    const link = document.createElement('a');
    link.href = fileData;
    link.download = report.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Report type badge colors
  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case 'Blood Test':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{type}</Badge>;
      case 'X-ray':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{type}</Badge>;
      case 'Prescription':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{type}</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reports</h2>
        <p className="text-muted-foreground">View and manage medical reports</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">File Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">
              {reports.length === 0 ? 'No reports yet' : 'No matching reports'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {reports.length === 0
                ? 'Go to Upload section to add medical reports.'
                : 'Try adjusting your search query.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => {
            const hasFile = getFile(report.id);
            
            return (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* File Icon */}
                    <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-destructive" />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium truncate">{report.fileName}</h3>
                        {!hasFile && (
                          <Badge variant="outline" className="text-warning border-warning text-xs">
                            Re-upload needed
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                        {getReportTypeBadge(report.reportType)}
                        <span>•</span>
                        <span className={privacyMode ? 'blur-sm' : ''}>
                          {getPatientName(report.patientId)}
                        </span>
                        <span>•</span>
                        <span>{format(new Date(report.dateAdded), 'MMM d, yyyy')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedReport(report)}
                        disabled={!hasFile}
                        title={hasFile ? 'Open' : 'File not available'}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(report)}
                        disabled={!hasFile}
                        title={hasFile ? 'Download' : 'File not available'}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteReport(report.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* PDF Preview Modal */}
      {selectedReport && (
        <PDFPreviewModal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          fileName={selectedReport.fileName}
          fileData={getFile(selectedReport.id)}
        />
      )}
    </div>
  );
}
