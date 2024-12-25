'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import DeviceCard from './_components/DeviceCard';
import { io } from 'socket.io-client';

interface Device {
  id: string;
  name: string;
  location?: string;
  lastActivityAt: string | null;
  sensorData?: {
    temperature: number;
    voltage: number;
    current: number;
    power: number;
    temperatureThreshold: number;
  };
}

// Helper function to check device activity
function isDeviceActive(lastActivityAt: string | null): boolean {
  if (!lastActivityAt) return false;
  const lastActivityTime = new Date(lastActivityAt);
  const currentTime = new Date();
  const diffInMinutes = (currentTime.getTime() - lastActivityTime.getTime()) / 60000;
  return diffInMinutes <= 5;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    // Function to fetch devices from the API
    async function fetchDevices() {
      try {
        const response = await fetch('/api/devices', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch devices');
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchDevices();

    // Listen for device updates
    socket.on('sensorData', (data) => {
      setDevices((prevDevices) => {
        return prevDevices.map((device) => {
          if (device.id === data.device_id) {
            return {
              ...device,
              lastActivityAt: new Date().toISOString(),
              sensorData: {
                temperature: data.temperature,
                voltage: data.voltage,
                current: data.current,
                power: data.power,
                temperatureThreshold: data.temperatureThreshold,
              },
            };
          }
          return device;
        });
      });
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  const DeviceSkeleton = () => (
    <div className="p-6 border rounded-lg shadow-sm">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Devices</h1>
        <div className="flex gap-2">
          <Badge variant="secondary">Total: {devices.length}</Badge>
          <Badge variant="success">
            Active: {devices.filter((device) => isDeviceActive(device.lastActivityAt)).length}
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <DeviceSkeleton key={index} />
          ))}
        </div>
      ) : devices.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">No devices available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} isDeviceActive={isDeviceActive} />
          ))}
        </div>
      )}
    </div>
  );
}
