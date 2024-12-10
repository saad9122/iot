import React from 'react';
import SearchBar from './SearchBar';
import Image from 'next/image';
import UserDropdown from './UserDropdown';
import { Button } from '@/components/ui/button';
import SidebarButton from './SidebarButton';

const Navbar = () => {
  return (
    <div className="flex justify-end items-center h-full px-6">
      <div className="flex items-center space-x-4">
        <UserDropdown />
      </div>
    </div>
  );
};

interface IRoundButton {
  imageSrc: string;
}

const RoundButton: React.FC<IRoundButton> = ({ imageSrc }) => {
  return (
    <button type="button" className="bg-gray-100/80 w-[80px] h-[50px] flex justify-center items-center rounded-full">
      <Image src={imageSrc} alt="icon" width={25} height={25} className="" />
    </button>
  );
};

export default Navbar;
