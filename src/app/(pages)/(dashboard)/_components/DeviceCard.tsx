'use client';
import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu } from 'lucide-react';

interface DeviceCardProps {
  device: {
    id: string;
    name: string;
    location?: string;
    lastActivityAt: string | null;
  };
  isDeviceActive: (lastActivityAt: string | null) => boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, isDeviceActive }) => {
  return (
    <Link href={`/device/${device.id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <Cpu className="w-6 h-6 text-gray-500" />
          <div>
            <CardTitle>{device.name}</CardTitle>
            <CardDescription>{device.location || 'Location not set'}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant={isDeviceActive(device.lastActivityAt) ? 'default' : 'destructive'}>
              {isDeviceActive(device.lastActivityAt) ? 'Active' : 'Inactive'}
            </Badge>
            <p className="text-sm text-gray-500">
              Last Active: {device.lastActivityAt ? new Date(device.lastActivityAt).toLocaleString() : 'Never'}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DeviceCard;
