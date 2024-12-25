'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Thermometer, Bolt, ZapOff, Clock } from 'lucide-react';
import { io } from 'socket.io-client';

interface SensorData {
  temperature: number;
  voltage: number;
  current: number;
  power: number;
  relayState: boolean;
  temperatureThreshold: number;
  lastUpdated: Date;
}

const SOCKET_URL = process.env.SOCKET_APP_URL;

export default function SensorDashboard({ params }: { params: { id: string } }) {
  const { id } = params;
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    voltage: 0,
    current: 0,
    power: 0,
    relayState: false,
    temperatureThreshold: 25.0,
    lastUpdated: new Date(),
  });

  const [threshold, setThreshold] = useState(25.0);

  console.log(SOCKET_URL, 'SOCKET_URL');

  useEffect(() => {
    if (!id) return; // Ensure `id` is available

    const socket = io('http://localhost:5000');

    socket.on('sensorData', (data) => {
      console.log(data, 'dataaaa');
      if (data.id === id) {
        setSensorData(data);
      }
    });

    // Cleanup the WebSocket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleThresholdChange = async () => {
    if (!id) return;

    try {
      await fetch(`/api/sensors/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sensorData,
          temperatureThreshold: threshold,
        }),
      });
    } catch (error) {
      console.error('Failed to update threshold', error);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">Temperature & Power Monitor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temperature Card */}
        <Card className="shadow-lg border border-gray-200 rounded-lg bg-white">
          <CardHeader className="p-4 border-b border-gray-100">
            <CardTitle className="flex items-center text-xl md:text-2xl font-semibold text-gray-700">
              <Thermometer className="mr-3 text-red-500" /> Temperature
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center md:flex-row md:justify-between space-y-6 md:space-y-0">
              <span className="text-4xl md:text-5xl font-bold text-gray-800">
                {sensorData.temperature.toFixed(1)}°C
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm md:text-base">Set Value:</span>
                <Input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-20 md:w-24 border border-gray-300 rounded-md shadow-sm p-2 text-gray-800"
                />
                <Button
                  onClick={handleThresholdChange}
                  size="sm"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500"
                >
                  Set
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Power Card */}
        <Card className="shadow-lg border border-gray-200 rounded-lg bg-white">
          <CardHeader className="p-4 border-b border-gray-100">
            <CardTitle className="flex items-center text-xl md:text-2xl font-semibold text-gray-700">
              <Bolt className="mr-3 text-yellow-500" /> Power Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <ZapOff className="mr-2 text-blue-500" />
                  <span className="font-medium">Voltage:</span>
                  <span className="ml-2">{sensorData.voltage.toFixed(2)} V</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Bolt className="mr-2 text-green-500" />
                  <span className="font-medium">Current:</span>
                  <span className="ml-2">{sensorData.current.toFixed(2)} A</span>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="mr-2 text-orange-500" />
                <span className="font-medium">Power:</span>
                <span className="ml-2">{sensorData.power.toFixed(2)} W</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
