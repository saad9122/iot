'use client';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import DeviceCard from './_components/DeviceCard';

// Helper function to check device activity
function isDeviceActive(lastActivityAt: string | null): boolean {
  if (!lastActivityAt) return false;

  const lastActivityTime = new Date(lastActivityAt);
  const currentTime = new Date();
  const diffInMinutes = (currentTime.getTime() - lastActivityTime.getTime()) / 60000;

  // Device is active if its last activity was within the past 5 minutes
  return diffInMinutes <= 5;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch devices on component mount and every 10 seconds
  useEffect(() => {
    fetchDevices(); // Initial fetch

    const intervalId = setInterval(fetchDevices, 10000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Skeleton loader for devices
  const DeviceSkeleton = () => (
    <div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-5 w-20" />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Devices</h1>
        <Badge variant="secondary">Total: {devices.length}</Badge>
      </div>

      {loading && devices.length === 0 ? (
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
