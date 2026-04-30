import { useState, useEffect } from 'react';
import { AppProvider, useAppStore } from './lib/store';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { DeliveryBoard } from './pages/DeliveryBoard';
import { CalendarPage } from './pages/CalendarPage';
import { ContactsPage } from './pages/ContactsPage';
import { PipelinePage } from './pages/PipelinePage';
import { UsersPage } from './pages/UsersPage';
import { TodosPage } from './pages/TodosPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PunchClockPage } from './pages/PunchClockPage';
import { PayrollPage } from './pages/PayrollPage';
import { WorkforcePage } from './pages/WorkforcePage';
import { EngineeringPage } from './pages/EngineeringPage';
import { SignOffsPage } from './pages/SignOffsPage';
import { SealsPage } from './pages/SealsPage';
import { POsPage } from './pages/POsPage';
import { InventoryPage } from './pages/InventoryPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { GenericPage } from './pages/GenericPage'; // still imported if needed elsewhere
import { GoogleOAuthProvider } from '@react-oauth/google';

import { ProductCategoryPage } from './pages/ProductCategoryPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';
import { SchedulePage } from './pages/SchedulePage';
import { QuotesPage } from './pages/QuotesPage';
import { PlansPage } from './pages/PlansPage';

const PAGE_ROLES: Record<string, string[]> = {
  dash: ['admin', 'general_manager', 'sales', 'designer', 'engineer', 'floor_worker'],
  contacts: ['admin', 'general_manager', 'sales', 'designer', 'engineer', 'driver'],
  quotes: ['admin', 'general_manager', 'sales'],
  plans: ['admin', 'general_manager', 'sales', 'designer', 'engineer'],
  pipeline: ['admin', 'general_manager', 'foreman', 'sales', 'designer', 'engineer'],
  todos: ['admin', 'general_manager', 'foreman', 'driver', 'sales', 'designer', 'engineer', 'floor_worker'],
  delivery: ['admin', 'general_manager', 'foreman', 'driver', 'sales'],
  schedule: ['admin', 'general_manager', 'foreman', 'driver', 'sales', 'designer', 'engineer', 'floor_worker'],
  calendar: ['admin', 'general_manager', 'foreman', 'sales', 'designer', 'engineer'],
  workforce: ['admin', 'general_manager'],
  users: ['admin', 'general_manager'],
  analytics: ['admin', 'general_manager', 'sales'],
  payroll: ['admin', 'general_manager'],
  punch: ['admin', 'general_manager', 'foreman', 'driver', 'designer', 'engineer'],
  trusses: ['admin', 'general_manager', 'foreman', 'designer', 'sales', 'engineer'],
  ewp: ['admin', 'general_manager', 'foreman', 'designer', 'sales', 'engineer'],
  wallPanels: ['admin', 'general_manager', 'foreman', 'designer', 'sales', 'engineer'],
  stairs: ['admin', 'general_manager', 'foreman', 'designer', 'sales', 'engineer'],
  mixedProducts: ['admin', 'general_manager', 'foreman', 'designer', 'sales', 'engineer'],
  engineering: ['admin', 'general_manager', 'foreman', 'designer', 'engineer'],
  signoffs: ['admin', 'general_manager', 'foreman', 'designer', 'engineer'],
  seals: ['admin', 'general_manager', 'designer', 'engineer'],
  pos: ['admin', 'general_manager', 'sales', 'foreman'],
  inventory: ['admin', 'general_manager', 'foreman'],
  maintenance: ['admin', 'general_manager', 'foreman']
};

function AppContent() {
  const [currentPage, setPage] = useState('dash');
  const { currentUser, setCurrentUserId, users } = useAppStore();

  useEffect(() => {
    if (currentUser && currentUser.role) {
      const allowedRoles = PAGE_ROLES[currentPage];
      if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // Redirect to a default page depending on role
        if (currentUser.role === 'driver') {
          setPage('delivery');
        } else if (currentUser.role === 'foreman') {
          setPage('pipeline');
        } else {
          setPage('dash');
        }
      }
    }
  }, [currentUser, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dash': return <Dashboard />;
      case 'delivery': return <DeliveryBoard />;
      case 'calendar': return <CalendarPage />;
      case 'schedule': return <SchedulePage />;
      case 'quotes': return <QuotesPage />;
      case 'plans': return <PlansPage />;
      case 'contacts': return <ContactsPage />;
      case 'pipeline': return <PipelinePage />;
      case 'workforce': return <WorkforcePage />;
      case 'users': return <UsersPage />;
      case 'todos': return <TodosPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'payroll': return <PayrollPage />;
      case 'punch': return <PunchClockPage />;
      case 'trusses': return <ProductCategoryPage title="Trusses" productType="Trusses" />;
      case 'ewp': return <ProductCategoryPage title="EWP Floor Systems" productType="EWP Floor Systems" />;
      case 'wallPanels': return <ProductCategoryPage title="Wall Panels" productType="Wall Panels" />;
      case 'stairs': return <ProductCategoryPage title="Stairs" productType="Stairs" />;
      case 'mixedProducts': return <ProductCategoryPage title="Mixed Products" productType="Mixed" />;
      case 'engineering': return <EngineeringPage />;
      case 'signoffs': return <SignOffsPage />;
      case 'seals': return <SealsPage />;
      case 'pos': return <POsPage />;
      case 'inventory': return <InventoryPage />;
      case 'maintenance': return <MaintenancePage />;
      default: return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dash: 'Dashboard',
      delivery: 'Delivery Board',
      calendar: 'Calendar',
      schedule: 'Schedule',
      quotes: 'Quotes',
      plans: 'Plans & Docs',
      contacts: 'Dealers',
      pipeline: 'Pipeline',
      todos: 'To-do List',
      users: 'Users',
      analytics: 'Analytics',
      payroll: 'Payroll',
      punch: 'Punch Clock',
      workforce: 'Workforce',
      trusses: 'Trusses',
      ewp: 'Engineered Wood Products',
      wallPanels: 'Wall Panels',
      stairs: 'Stairs',
      mixedProducts: 'Mixed Products',
      engineering: 'Engineering',
      signoffs: 'Sign Offs',
      seals: 'Seals',
      pos: 'Purchase Orders',
      inventory: 'Inventory',
      maintenance: 'Maintenance'
    };
    return titles[currentPage] || 'Dashboard';
  };

  if (currentUser?.role === 'contractor') {
    return (
      <div className="flex flex-col h-screen bg-win-bg w-full overflow-hidden text-sm">
        <div className="bg-win-surface border-b border-win-border p-4 shadow-sm flex items-center justify-between">
          <div className="font-bold text-lg text-win-accent flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
            Forge Portal
          </div>
          <select 
            className="text-xs font-semibold text-white uppercase tracking-wider px-2 py-1 bg-win-accent rounded appearance-none cursor-pointer outline-none border-none pr-6"
            value={currentUser.id}
            onChange={e => setCurrentUserId(Number(e.target.value))}
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")', 
              backgroundRepeat: 'no-repeat', 
              backgroundPosition: 'right 6px center' 
            }}
          >
            {users.map(u => (
              <option key={u.id} value={u.id} className="text-black bg-white">{u.first} ({u.role})</option>
            ))}
          </select>
        </div>
        <div className="flex-1 relative overflow-auto">
          <CustomerPortalPage />
        </div>
      </div>
    );
  }

  if (currentUser?.role === 'driver') {
    return (
      <div className="flex flex-col h-screen bg-win-bg w-full overflow-hidden text-sm">
        <div className="bg-win-surface border-b border-win-border p-4 shadow-sm flex items-center justify-between">
          <div className="font-bold text-lg text-win-accent flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
            Forge
          </div>
          <select 
            className="text-xs font-semibold text-white uppercase tracking-wider px-2 py-1 bg-win-accent rounded appearance-none cursor-pointer outline-none border-none pr-6"
            value={currentUser.id}
            onChange={e => setCurrentUserId(Number(e.target.value))}
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")', 
              backgroundRepeat: 'no-repeat', 
              backgroundPosition: 'right 6px center' 
            }}
          >
            {users.map(u => (
              <option key={u.id} value={u.id} className="text-black bg-white">{u.first} ({u.role})</option>
            ))}
          </select>
        </div>
        <div className="p-3 bg-[#e5f1fb] text-[#0078d4] text-xs font-medium flex justify-between items-center shadow-sm z-10 border-b border-[#0078d4]/20">
          <div>Next Stop: <strong>Smith Residence (10:30 AM)</strong></div>
          <button className="bg-[#0078d4] text-white px-2 py-1 rounded shadow hover:bg-[#005a9e] active:scale-95 transition-transform" onClick={() => setPage('punch')}>Punch Clock</button>
        </div>
        <div className="flex-1 relative overflow-auto pb-16">
          {renderPage()}
        </div>
        {/* Mobile Bottom Nav */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-win-surface border-t border-win-border flex shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
          <button className={`flex-1 flex flex-col items-center justify-center gap-1 ${currentPage === 'delivery' ? 'text-win-accent' : 'text-win-text-sec hover:text-win-text'}`} onClick={() => setPage('delivery')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/></svg>
            <span className="text-[10px] font-semibold">Route</span>
          </button>
          <button className={`flex-1 flex flex-col items-center justify-center gap-1 ${currentPage === 'contacts' ? 'text-win-accent' : 'text-win-text-sec hover:text-win-text'}`} onClick={() => setPage('contacts')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span className="text-[10px] font-semibold">Contacts</span>
          </button>
          <button className={`flex-1 flex flex-col items-center justify-center gap-1 ${currentPage === 'todos' ? 'text-win-accent' : 'text-win-text-sec hover:text-win-text'}`} onClick={() => setPage('todos')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>
            <span className="text-[10px] font-semibold">Tasks</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-win-bg w-full overflow-hidden text-sm">
      <Sidebar currentPage={currentPage} setPage={setPage} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={getPageTitle()} />
        <div className="flex-1 relative overflow-hidden">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </GoogleOAuthProvider>
  );
}
