'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { SensorData } from '../[id]/page';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

const bakcendUrl = process.env.NEXT_APP_BACKEND_URL;

const TemperatureMonitoringCard = ({ sensorData, decodedId }: { sensorData: SensorData; decodedId: string }) => {
  const [threshold, setThreshold] = useState(25.0);
  const { toast } = useToast();

  // Initialize threshold from sensor data when component mounts
  useEffect(() => {
    if (sensorData.temperatureThreshold) {
      setThreshold(sensorData.temperatureThreshold);
    }
  }, [sensorData.temperatureThreshold]);

  const getTemperatureColor = (temp: number) => {
    if (temp >= threshold) return 'text-red-400';
    if (temp >= threshold - 5) return 'text-orange-400';
    return 'text-black';
  };

  const handleThresholdChange = async (newThreshold: number) => {
    if (!decodedId) return;

    try {
      // Send update to backend
      const response = await fetch(`http://localhost:5000/threshold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: decodedId,
          threshold: newThreshold,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update threshold');
      }

      const data = await response.json();

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

      // Revert threshold on error
      setThreshold(sensorData.temperatureThreshold || 25.0);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setThreshold(value[0]);
  };

  const handleSliderChangeEnd = (value: number[]) => {
    handleThresholdChange(value[0]);
  };

  const min = 15;
  const max = 35;

  return (
    <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 lg:col-span-2">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
        <CardTitle className="flex items-center text-lg font-medium">
          <Thermometer className="mr-2 h-6 w-6" />
          Temperature Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-center items-center">
            <div
              className={`w-28 h-28 flex items-center justify-center rounded-full text-4xl font-bold shadow-md ${getTemperatureColor(
                sensorData.temperature,
              )}`}
            >
              {Number(sensorData.temperature).toFixed(1)}°C
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date(sensorData.lastUpdated).toLocaleTimeString()}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Temperature Threshold</label>
              <div className="relative">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{min}°C</span>
                  <span>{max}°C</span>
                </div>
                <Slider
                  value={[threshold]}
                  min={min}
                  max={max}
                  step={0.5}
                  onValueChange={handleSliderChange}
                  onValueCommit={handleSliderChangeEnd}
                />
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-gray-700 font-medium text-lg">{threshold.toFixed(1)}°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureMonitoringCard;
