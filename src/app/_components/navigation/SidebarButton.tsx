'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/app/_context/SidebarContext';

const SidebarButton = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <div>
      <Button className="xl:hidden" onClick={toggleSidebar}>
        Navbar
      </Button>
    </div>
  );
};

export default SidebarButton;
