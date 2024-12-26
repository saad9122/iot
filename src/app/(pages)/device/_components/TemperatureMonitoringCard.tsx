'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer } from 'lucide-react';
import React, { useState } from 'react';
import { SensorData } from '../[id]/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';

const TemperatureMonitoringCard = ({ sensorData, decodedId }: { sensorData: SensorData; decodedId: string }) => {
  const [threshold, setThreshold] = useState(25.0);
  const { toast } = useToast();

  const getTemperatureColor = (temp: number) => {
    if (temp >= threshold) return 'text-red-500';
    if (temp >= threshold - 5) return 'text-orange-500';
    return 'text-black-500';
  };

  const handleThresholdChange = async () => {
    if (!decodedId) return;

    try {
      const response = await fetch(`/api/sensors/${decodedId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperatureThreshold: threshold }),
      });

      if (!response.ok) throw new Error('Failed to update threshold');

      toast({
        title: 'Success',
        description: 'Temperature threshold updated successfully',
      });
    } catch (error) {
      console.error('Failed to update threshold:', error);
      toast({
        title: 'Error',
        description: 'Failed to update temperature threshold',
        variant: 'destructive',
      });
    }
  };
  return (
    <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center text-lg font-medium text-gray-900">
          <Thermometer className="mr-2 h-5 w-5 text-red-500" />
          Temperature Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center items-center md:items-start">
            <div className={`text-5xl font-bold ${getTemperatureColor(sensorData.temperature)}`}>
              {Number(sensorData.temperature).toFixed(1)}°C
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date(sensorData.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Temperature Threshold</label>
              {/* <Slider defaultValue={[33]} max={100} step={1} /> */}

              <div className="flex gap-3">
                <Input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-32"
                />
                <Button onClick={handleThresholdChange} className="bg-blue-600 hover:bg-blue-700">
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureMonitoringCard;
