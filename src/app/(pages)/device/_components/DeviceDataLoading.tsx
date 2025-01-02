import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import React from 'react';

const DeviceDataLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <CardContent>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="text-xl font-semibold text-gray-700">Loading Device Data...</span>
          </div>
          <p className="text-gray-500 mt-4">
            Please wait while we establish connection and fetch the latest information
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceDataLoading;
