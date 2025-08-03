import { ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';

interface AppLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  className?: string;
}

export const AppLayout = ({ children, showNavbar = true, className = "" }: AppLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};