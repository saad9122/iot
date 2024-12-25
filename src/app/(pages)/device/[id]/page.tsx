'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Thermometer, Bolt, ZapOff, Clock, WifiOff } from 'lucide-react';

interface SensorData {
  temperature: number;
  voltage: number;
  current: number;
  power: { Power: number };
  relayState: boolean;
  temperatureThreshold: number;
  lastUpdated: Date;
  device_id?: string;
}

export default function SensorDashboard({ params }: { params: { id: string } }) {
  const { id } = params;
  const decodedId = id ? decodeURIComponent(id) : '';
  const TIMEOUT_THRESHOLD = 15000; // 15 seconds in milliseconds

  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    voltage: 0,
    current: 0,
    power: { Power: 0 },
    relayState: false,
    temperatureThreshold: 25.0,
    lastUpdated: new Date(),
  });

  const [threshold, setThreshold] = useState(25.0);
  const [isConnected, setIsConnected] = useState(false);
  const [isDeviceActive, setIsDeviceActive] = useState(true);

  // Check device timeout
  useEffect(() => {
    const checkDeviceTimeout = () => {
      const now = new Date().getTime();
      const lastUpdate = new Date(sensorData.lastUpdated).getTime();
      setIsDeviceActive(now - lastUpdate < TIMEOUT_THRESHOLD);
    };

    const interval = setInterval(checkDeviceTimeout, 1000);
    return () => clearInterval(interval);
  }, [sensorData.lastUpdated]);

  useEffect(() => {
    if (!decodedId) return;

    const socket = io('http://localhost:5000', {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribeToDevice', decodedId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('sensorData', (data) => {
      if (data.device_id === decodedId) {
        setSensorData({
          ...data,
          lastUpdated: new Date(),
        });
        if (data.temperatureThreshold !== threshold) {
          setThreshold(data.temperatureThreshold);
        }
      }
    });

    return () => {
      socket.emit('unsubscribeFromDevice', decodedId);
      socket.disconnect();
    };
  }, [decodedId]);

  const handleThresholdChange = async () => {
    if (!decodedId) return;

    try {
      const response = await fetch(`/api/sensors/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperatureThreshold: threshold }),
      });

      if (!response.ok) throw new Error('Failed to update threshold');
    } catch (error) {
      console.error('Failed to update threshold:', error);
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= threshold) return 'text-red-500';
    if (temp >= threshold - 5) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Device Monitor: {decodedId}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Server Connected' : 'Server Disconnected'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${isDeviceActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm text-gray-600">{isDeviceActive ? 'Device Active' : 'Device Timeout'}</span>
              </div>
            </div>
          </div>
        </div>

        {!isDeviceActive && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <WifiOff className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              Device hasn't reported data in the last 15 seconds. Please check the connection.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border border-gray-200 rounded-xl bg-white transition-all duration-300 hover:shadow-xl">
            <CardHeader className="p-6 border-b border-gray-100">
              <CardTitle className="flex items-center text-2xl font-semibold text-gray-700">
                <Thermometer className="mr-3 text-red-500" /> Temperature Monitor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <span className={`text-5xl md:text-6xl font-bold ${getTemperatureColor(sensorData.temperature)}`}>
                    {sensorData.temperature.toFixed(1)}°C
                  </span>
                  <p className="text-sm text-gray-500 mt-3">
                    Last updated: {new Date(sensorData.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-600 text-sm">Temperature Threshold</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(parseFloat(e.target.value))}
                        className="w-24"
                        step="0.1"
                      />
                      <Button onClick={handleThresholdChange} className="bg-blue-500 hover:bg-blue-600">
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-200 rounded-xl bg-white transition-all duration-300 hover:shadow-xl">
            <CardHeader className="p-6 border-b border-gray-100">
              <CardTitle className="flex items-center text-2xl font-semibold text-gray-700">
                <Bolt className="mr-3 text-yellow-500" /> Power Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-gray-700">
                      <ZapOff className="mr-2 text-blue-500" />
                      <span className="font-medium">Voltage:</span>
                      <span className="ml-2 text-lg">{sensorData.voltage.toFixed(2)} V</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-gray-700">
                      <Bolt className="mr-2 text-green-500" />
                      <span className="font-medium">Current:</span>
                      <span className="ml-2 text-lg">{sensorData.current.toFixed(2)} A</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-gray-700">
                    <Clock className="mr-2 text-orange-500" />
                    <span className="font-medium">Power:</span>
                    <span className="ml-2 text-lg">{sensorData.power.Power.toFixed(2)} W</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
