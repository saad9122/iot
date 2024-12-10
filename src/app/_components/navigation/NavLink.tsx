'use client';
import React from 'react';
import { ISidebarListItem } from './Sidebar';
import { Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const NavLink: React.FC<ISidebarListItem> = (props) => {
  const { link, name } = props;
  const pathname = usePathname();
  return (
    <li className={cn('py-2 pl-8', pathname === link && 'border-l-4 border-primary')} key={name}>
      <Link className="flex items-center justify-start space-x-5" href={link}>
        {<props.icon fill={pathname === link ? '#3056D3' : '#B1B1B1'} width={23} height={23} />}
        <p className={cn('text-sm text-wrap', pathname === link && 'text-primary')}>{name}</p>
      </Link>
    </li>
  );
};

export default NavLink;
