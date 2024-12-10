'use client';
import Image from 'next/image';
import React from 'react';
import {
  AccountIcon,
  CreditCardsIcon,
  DashboardIcon,
  InvestmentIcon,
  InvoiceIcon,
  LoansIcon,
  PrivilegesIcon,
  ServicesIcon,
  SettingsIcon,
} from '../../_components/svgicons/sidebarIcons';
import { SvgIconProps } from '../../../../src/types/commonTypes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/app/_context/SidebarContext';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebar();

  const handleOverlayClick = (e) => {
    if (e?.target?.classList?.contains('sidebarOverlay')) {
      toggleSidebar();
    }
  };

  return (
    <div
      className={cn(
        'sidebarOverlay',
        isOpen
          ? 'w-full fixed top-0 bottom-0 left-0 right-0 z-30 bg-gray-900/40'
          : 'w-0 lg:w-[13rem] hidden xl:block overflow-hidden flex-none z-30',
      )}
      onClick={handleOverlayClick}
    >
      <div className={cn('pt-6', isOpen && 'absolute left-0 top-0 bottom-0 w-1/2 sm:w-[13rem] bg-white z-40')}>
        <div className="flex justify-center items-start space-x-2 h-[6rem]">
          <div>
            <Image src="/icons/logo.svg" alt="logo" width={36} height={36} />
          </div>
          <p className="prose prose-2xl">BankDash.</p>
        </div>
        <ul className="space-y-4">
          {sideBarList.map((item) => {
            return (
              <li className={cn('py-2 pl-8', pathname === item.link && 'border-l-4 border-primary')} key={item.name}>
                <Link className="flex items-center justify-start space-x-5" href={item.link}>
                  {<item.icon fill={pathname === item.link ? '#3056D3' : '#B1B1B1'} width={23} height={23} />}
                  <p className={cn('text-sm text-wrap', pathname === item.link && 'text-primary')}>{item.name}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

interface ISidebarListItem {
  icon: React.FC<SvgIconProps>;
  name: string;
  link: string;
}

const sideBarList: ISidebarListItem[] = [
  {
    icon: DashboardIcon,
    name: 'Dashboard',
    link: '/',
  },
  {
    icon: InvoiceIcon,
    name: 'invoices',
    link: '/invoices',
  },
  {
    icon: AccountIcon,
    name: 'Customers',
    link: '/customers',
  },
  {
    icon: InvestmentIcon,
    name: 'Products',
    link: '/products',
  },
  {
    icon: AccountIcon,
    name: 'Users',
    link: '/users',
  },
  // {
  //   icon: CreditCardsIcon,
  //   name: 'Credit Cards',
  //   link: '/credit-cards',
  // },
  // {
  //   icon: LoansIcon,
  //   name: 'Loans',
  //   link: '/loans',
  // },
  // {
  //   icon: ServicesIcon,
  //   name: 'Services',
  //   link: '/services',
  // },
  // {
  //   icon: PrivilegesIcon,
  //   name: 'My Privileges',
  //   link: '/prviliges',
  // },
  // {
  //   icon: SettingsIcon,
  //   name: 'Settings',
  //   link: '/settings',
  // },
];

// const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => {
//   return <DashboardIconSVG {...props} />;
// };
