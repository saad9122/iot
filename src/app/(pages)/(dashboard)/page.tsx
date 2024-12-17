'use client';

import React, { useEffect, useState } from 'react';

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
      setLoading(false); // Set loading to false only once
    }
  }

  // Fetch devices on component mount and every 5 seconds
  useEffect(() => {
    fetchDevices(); // Initial fetch

    const intervalId = setInterval(fetchDevices, 10000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Devices</h1>

      {/* Show loading only for the first render */}
      {loading && devices.length === 0 ? (
        <p>Loading devices...</p>
      ) : devices.length === 0 ? (
        <p>No devices available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div
              key={device.id}
              className="border rounded-lg p-4 shadow-lg bg-white hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{device.name}</h2>
              <p className="text-gray-600 mb-1">
                <strong>Location:</strong> {device.location || 'Not Specified'}
              </p>
              <p className={`font-medium ${isDeviceActive(device.lastActivityAt) ? 'text-green-600' : 'text-red-600'}`}>
                {isDeviceActive(device.lastActivityAt) ? 'Active' : 'Inactive'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
