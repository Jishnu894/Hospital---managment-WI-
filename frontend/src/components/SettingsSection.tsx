import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export function SettingsSection() {
  const { privacyMode, togglePrivacyMode } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Configure your dashboard preferences</p>
      </div>

      <div className="max-w-xl space-y-4">
        {/* Privacy Mode Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy Mode
            </CardTitle>
            <CardDescription>
              Protect sensitive patient information from prying eyes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                {privacyMode ? (
                  <EyeOff className="w-5 h-5 text-primary" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <Label className="text-base font-medium">
                    {privacyMode ? 'Privacy Mode Enabled' : 'Privacy Mode Disabled'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {privacyMode
                      ? 'Names are blurred, IDs are hidden'
                      : 'All patient details are visible'}
                  </p>
                </div>
              </div>
              <Switch
                checked={privacyMode}
                onCheckedChange={togglePrivacyMode}
              />
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p className="mb-2">When enabled:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Patient names are shown as initials only</li>
                <li>Phone numbers and IDs are blurred</li>
                <li>Useful when others might see your screen</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer Card */}
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is a <strong>frontend demo application</strong> for educational purposes.
              For real-world healthcare use:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-sm text-muted-foreground ml-2">
              <li>Encrypt all patient data</li>
              <li>Use secure backend storage</li>
              <li>Implement proper authentication</li>
              <li>Follow HIPAA/local regulations</li>
              <li>Regular security audits</li>
            </ul>
          </CardContent>
        </Card>

        {/* Storage Info */}
        <Card>
          <CardHeader>
            <CardTitle>Data Storage</CardTitle>
            <CardDescription>
              How your data is stored in this demo
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Patient Metadata:</strong> Saved in localStorage (persists across sessions)
            </p>
            <p>
              <strong>Report Metadata:</strong> Saved in localStorage (persists across sessions)
            </p>
            <p>
              <strong>PDF Files:</strong> Stored in browser memory (cleared on page refresh)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
