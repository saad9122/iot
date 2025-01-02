'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Edit3, Wifi, MapPin, Info, XCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Device } from '@prisma/client';

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

export default function SensorDashboard({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { id } = params;
  const decodedId = id ? decodeURIComponent(id) : '';

  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedDevice, setEditedDevice] = useState({
    name: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const response = await fetch(`${baseApiUrl}/api/devices/${decodedId}`);
        const data = await response.json();

        if (data.success) {
          setDevice(data.data);
          setEditedDevice({
            name: data.data.name,
            location: data.data.location,
            description: data.data.description,
          });
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: (error as Error).message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceInfo();
  }, [decodedId]);

  const handleSaveInfo = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/api/devices/${decodedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedDevice),
      });
      const data = await response.json();

      if (data.success && data.data) {
        setDevice(data?.data);
        toast({
          title: 'Success',
          description: 'Device information updated successfully.',
        });
        setIsEditingInfo(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-lg font-medium text-gray-600">Loading device information...</p>
        </div>
      </div>
    );
  }

  const deviceStatus = device?.lastActivityAt
    ? new Date().getTime() - new Date(device.lastActivityAt).getTime() < 300000
      ? 'online'
      : 'offline'
    : 'unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{device?.name || 'Device Dashboard'}</h1>
            <p className="text-gray-500 mt-1">Manage and monitor your device settings</p>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center px-3 py-1 rounded-full ${
                deviceStatus === 'online'
                  ? 'bg-green-100 text-green-800'
                  : deviceStatus === 'offline'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              <Wifi className="w-4 h-4 mr-2" />
              <span className="capitalize">{deviceStatus}</span>
            </div>
          </div>
        </div>

        {/* Device Information Card */}
        <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-xl font-bold">Device Information</CardTitle>
            </div>
            <Button
              onClick={() => setIsEditingInfo(true)}
              variant="outline"
              className="hover:bg-gray-100 transition-colors duration-200"
            >
              <Edit3 className="mr-2 w-4 h-4" />
              Edit Info
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Info className="w-4 h-4 text-gray-500 mr-2" />
                  <p className="text-sm font-medium text-gray-600">Name</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">{device?.name || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                  <p className="text-sm font-medium text-gray-600">Location</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">{device?.location || 'N/A'}</p>
              </div>
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Info className="w-4 h-4 text-gray-500 mr-2" />
                  <p className="text-sm font-medium text-gray-600">Description</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">{device?.description || 'N/A'}</p>
              </div>
              {device?.lastActivityAt && (
                <div className="md:col-span-2">
                  <Alert>
                    <Clock className="w-4 h-4" />
                    <AlertDescription>
                      Last updated: {new Date(device?.lastActivityAt).toLocaleString()}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Device Info Modal */}
        <Dialog open={isEditingInfo} onOpenChange={setIsEditingInfo}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-blue-500" />
                <span>Edit Device Information</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  name="name"
                  value={editedDevice.name}
                  onChange={(e) => setEditedDevice({ ...editedDevice, name: e.target.value })}
                  placeholder="Enter device name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <Input
                  name="location"
                  value={editedDevice.location}
                  onChange={(e) => setEditedDevice({ ...editedDevice, location: e.target.value })}
                  placeholder="Enter device location"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Input
                  name="description"
                  value={editedDevice.description}
                  onChange={(e) => setEditedDevice({ ...editedDevice, description: e.target.value })}
                  placeholder="Enter device description"
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingInfo(false)} className="mr-2">
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveInfo}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
