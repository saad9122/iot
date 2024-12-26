import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

import React from 'react';

const NoDataDisplay = ({ title, message }: { title: string; message: string }) => {
  return (
    <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-center items-center">
      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-gray-500 mt-2">{message}</p>
    </Card>
  );
};

export default NoDataDisplay;
