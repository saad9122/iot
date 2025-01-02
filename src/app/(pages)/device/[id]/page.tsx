'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ApiResponse } from '@/util/utilityFunctions';
import { Device } from '@prisma/client';
import { optionGenerator } from '@/app/_actions/auth';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import TemperatureMonitoringCard from '../_components/TemperatureMonitoringCard';
import PowerMetric from '../_components/PowerMetric';
import DeviceInformation from '../_components/DeviceInformation';
import DeviceAlert from '../_components/DeviceAlert';
import NoDataDisplay from '../_components/NoDataDisplay';
import DeviceDataLoading from '../_components/DeviceDataLoading';

export interface SensorData {
  temperature: number;
  voltage: number;
  current: number;
  power: number;
  reverseRelay: boolean;
  relayState: boolean;
  temperatureThreshold: number;
  lastUpdated: Date;
  deviceId?: string;
}

const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const backendUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export default function SensorDashboard({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { id } = params;
  const decodedId = id ? decodeURIComponent(id) : '';
  const TIMEOUT_THRESHOLD = 15000;

  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [threshold, setThreshold] = useState(25.0);
  const [isConnected, setIsConnected] = useState(false);
  const [isDeviceActive, setIsDeviceActive] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialData, setHasInitialData] = useState(false);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const requestOptions = await optionGenerator({ method: 'GET' });
        const response = await fetch(`/api/devices/${decodedId}`, requestOptions);
        const data: ApiResponse<Device> = await response.json();

        if (!data.data || !data?.success) {
          throw new Error(data?.message);
        }

        setDevice(data.data);
      } catch (error) {
        console.error('Error fetching device info:', error);
        toast({
          title: 'Error fetching device info',
          description: (error as Error).message,
          variant: 'destructive',
        });
      }
    };

    fetchDeviceInfo();
  }, [decodedId]);

  useEffect(() => {
    const checkDeviceTimeout = () => {
      if (!sensorData) return;
      const now = new Date().getTime();
      const lastUpdate = new Date(sensorData.lastUpdated).getTime();
      const isActive = now - lastUpdate < TIMEOUT_THRESHOLD;
      setIsDeviceActive(isActive);

      // Clear sensor data if device is inactive
      // if (!isActive && sensorData) {
      //   setSensorData(null);
      // }
    };

    const interval = setInterval(checkDeviceTimeout, 1000);
    return () => clearInterval(interval);
  }, [sensorData?.lastUpdated]);

  useEffect(() => {
    if (!decodedId) return;

    const socket = io(backendUrl, {
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
      console.log(data, 'dataaaaa');
      if (data.deviceId === decodedId) {
        setSensorData({
          ...data,
          lastUpdated: new Date(),
        });
        if (data.temperatureThreshold !== threshold) {
          setThreshold(data.temperatureThreshold);
        }
        if (!hasInitialData) {
          setHasInitialData(true);
          const now = new Date().getTime();
          const lastUpdate = new Date(data.lastUpdated).getTime();
          const isActive = now - lastUpdate < TIMEOUT_THRESHOLD;
          setIsDeviceActive(isActive);
          setIsLoading(false);
        }
      }
    });

    // Set a timeout for initial data load
    const initialDataTimeout = setTimeout(() => {
      if (!hasInitialData) {
        setIsLoading(false);
      }
    }, 5000); // Wait 5 seconds for initial data

    return () => {
      clearTimeout(initialDataTimeout);
      socket.emit('unsubscribeFromDevice', decodedId);
      socket.disconnect();
    };
  }, [decodedId]);

  if (isLoading && !device) return <DeviceDataLoading />;

  // if (!device) return <DeviceLoading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section with Gradient Background */}
        <div className="mb-8 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Device Monitoring Dashboard
              </h1>
              <p className="mt-2 text-gray-600">Real-time device metrics and status monitoring</p>
            </div>
            <div className="flex gap-4">
              {/* <Badge variant={isConnected ? 'success' : 'destructive'} className="h-8 px-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge> */}
              <Badge variant={isDeviceActive ? 'success' : 'destructive'} className="h-8 px-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {isDeviceActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {!isDeviceActive && <DeviceAlert />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device Information Card */}
          {device && <DeviceInformation device={device} />}

          {/* Temperature Monitor Card */}

          {sensorData && isDeviceActive ? (
            <TemperatureMonitoringCard sensorData={sensorData} decodedId={decodedId} />
          ) : (
            <NoDataDisplay
              title="No Temperature Data Available"
              message="Waiting for device to report new temperature readings..."
            />
          )}

          {/* Power Metrics Card */}
          {sensorData && <PowerMetric sensorData={sensorData} />}
        </div>
      </div>
    </div>
  );
}
