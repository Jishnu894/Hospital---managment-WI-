import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileData?: string;
}

export function PDFPreviewModal({ isOpen, onClose, fileName, fileData }: PDFPreviewModalProps) {
  const handleDownload = () => {
    if (!fileData) return;
    
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-[80vh]">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="truncate pr-4">{fileName}</DialogTitle>
          {fileData && (
            <Button size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </DialogHeader>

        <div className="flex-1 min-h-0 rounded-lg overflow-hidden bg-muted">
          {fileData ? (
            <iframe
              src={fileData}
              className="w-full h-full"
              title="PDF Preview"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <AlertCircle className="w-12 h-12 mb-4" />
              <h3 className="font-medium text-lg mb-2">File Not Available</h3>
              <p className="text-sm text-center max-w-sm">
                This file was uploaded in a previous session.
                <br />
                Please re-upload the PDF to view it.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
