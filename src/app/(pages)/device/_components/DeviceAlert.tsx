import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import React from 'react';

const DeviceAlert = () => {
  return (
    <Alert variant="destructive" className="mb-8">
      <AlertDescription className="flex items-center gap-2">
        <AlertCircle className="text-yellow-600" />
        <div>
          <span className="font-medium">No Recent Data Available</span>
          <p className="mt-1 text-sm text-gray-600">
            The device hasn&apos;t reported any data in the last 15 seconds. Previous data has been hidden to prevent
            displaying outdated information.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DeviceAlert;
