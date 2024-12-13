import Navbar from '../_components/navigation/Navbar';
import { SidebarProvider } from '../_context/SidebarContext';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex">
        <div className="grow flex flex-col">
          <div className="h-[4rem]">
            <Navbar />
          </div>
          <div className="bg-slate-100/70" style={{ height: 'calc(100vh - 4rem)' }}>
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
