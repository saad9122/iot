import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const DeviceLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <CardContent>
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Device Not Found</h2>
          <p className="text-gray-500 mt-2">The requested device could not be found or accessed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceLoading;
