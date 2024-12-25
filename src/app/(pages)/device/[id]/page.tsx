'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Thermometer, Bolt, ZapOff, Clock, IdCardIcon } from 'lucide-react';

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
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('sensor data use Effect');
    if (!decodedId) return;

    // Initialize socket connection
    const socket = io('http://localhost:5000', {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
    });

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);

      // Subscribe to specific device
      socket.emit('subscribeToDevice', decodedId);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    // Listen for sensor data
    socket.on('sensorData', (data) => {
      console.log(data.device_id, 'device_id');
      console.log(decodedId, 'decodedId');

      if (data.device_id === decodedId) {
        console.log('inside set data');
        setSensorData({
          ...data,
          lastUpdated: new Date(),
        });

        // Update threshold state if it's different
        if (data.temperatureThreshold !== threshold) {
          setThreshold(data.temperatureThreshold);
        }
      }
    });

    // Cleanup function
    return () => {
      // Unsubscribe from device updates
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
        body: JSON.stringify({
          temperatureThreshold: threshold,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update threshold');
      }
    } catch (error) {
      console.error('Failed to update threshold:', error);
      // You might want to add error handling UI here
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Temperature & Power Monitor</h1>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

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
              <div className="text-center md:text-left">
                <span className="text-4xl md:text-5xl font-bold text-gray-800">
                  {sensorData.temperature.toFixed(1)}°C
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {new Date(sensorData.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm md:text-base">Threshold:</span>
                <Input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-20 md:w-24"
                  step="0.1"
                />
                <Button onClick={handleThresholdChange} size="sm">
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
                {/* <span className="ml-2">{sensorData.power.Power.toFixed(2)} W</span> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
