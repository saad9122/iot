import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bolt, Clock, ZapOff } from 'lucide-react';
import { SensorData } from '../[id]/page';

const PowerMetric = ({ sensorData }: { sensorData: SensorData }) => {
  return (
    <Card className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center text-lg font-medium text-gray-900">
          <Bolt className="mr-2 h-5 w-5 text-yellow-500" />
          Power Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ZapOff className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium text-gray-700">Voltage</span>
              </div>
              <span className="text-2xl font-semibold text-gray-900">{sensorData?.voltage.toFixed(2)} V</span>
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bolt className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium text-gray-700">Current</span>
              </div>
              <span className="text-2xl font-semibold text-gray-900">{sensorData?.current.toFixed(2)} A</span>
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-orange-500 mr-2" />
                <span className="font-medium text-gray-700">Power</span>
              </div>
              <span className="text-2xl font-semibold text-gray-900">{sensorData?.power.toFixed(2)} W</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerMetric;
