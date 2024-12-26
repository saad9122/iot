import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Device } from '@prisma/client';

const DeviceInformation = ({ device }: { device: Device }) => {
  return (
    <Card className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center text-lg font-medium text-gray-900">
          <Info className="mr-2 h-5 w-5 text-blue-500" />
          Device Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Device Name</span>
            <span className="ml-auto text-sm text-gray-900">{device.name}</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Description</span>
            <span className="ml-auto text-sm text-gray-900">{device.description}</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Location</span>
            <span className="ml-auto text-sm text-gray-900">{device.location || 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceInformation;
