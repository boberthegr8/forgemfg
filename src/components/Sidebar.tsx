import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { LayoutDashboard, Users, FileText, Trello, CheckSquare, Truck, BarChart2, Calendar, Clock, DollarSign, Building2, PenTool, Layers, HardHat, ClipboardCheck, Stamp, FileCheck2, Wrench, Package } from 'lucide-react';

export function Sidebar({ currentPage, setPage }: { currentPage: string, setPage: (p: string) => void }) {
  const { users, currentUser, setCurrentUserId, todos, deliveries } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const getBadgeCount = (page: string) => {
    if (page === 'todos') return todos.filter(t => !t.done && (t.ownerId || 1) === currentUser.id).length;
    return 0;
  };

  const navItems = [
    { section: 'Dashboard', roles: ['admin', 'general_manager', 'foreman', 'sales', 'designer', 'engineer', 'floor_worker', 'driver'] },
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'general_manager', 'sales', 'designer', 'engineer', 'floor_worker'] },
    { id: 'schedule', label: 'Schedule', icon: Calendar, roles: ['admin', 'general_manager', 'foreman', 'driver', 'sales', 'designer', 'engineer', 'floor_worker'] },
    { section: 'CRM & Sales', roles: ['admin', 'general_manager', 'sales'] },
    { id: 'contacts', label: 'Dealers', icon: Users, roles: ['admin', 'general_manager', 'sales'] },
    { id: 'quotes', label: 'Quotes', icon: FileText, roles: ['admin', 'general_manager', 'sales'] },
    { id: 'pipeline', label: 'Pipeline', icon: Trello, roles: ['admin', 'general_manager', 'sales'] },
    { id: 'plans', label: 'Plans & Docs', icon: ClipboardCheck, roles: ['admin', 'general_manager', 'sales', 'designer', 'engineer'] },
    { section: 'Production', roles: ['admin', 'foreman', 'designer', 'sales'] },
    { id: 'trusses', label: 'Trusses', icon: Layers, roles: ['admin', 'foreman', 'designer', 'sales'] },
    { id: 'wallPanels', label: 'Wall Panels', icon: Layers, roles: ['admin', 'foreman', 'designer', 'sales'] },
    { id: 'ewp', label: 'EWP Floor Systems', icon: PenTool, roles: ['admin', 'foreman', 'designer', 'sales'] },
    { id: 'stairs', label: 'Stairs', icon: Layers, roles: ['admin', 'foreman', 'designer', 'sales'] },
    { id: 'mixedProducts', label: 'Mixed Products', icon: Package, roles: ['admin', 'foreman', 'designer', 'sales'] },
    { section: 'Engineering', roles: ['admin', 'foreman', 'designer'] },
    { id: 'engineering', label: 'Engineering', icon: HardHat, roles: ['admin', 'foreman', 'designer'] },
    { id: 'signoffs', label: 'Sign Offs', icon: ClipboardCheck, roles: ['admin', 'foreman', 'designer'] },
    { id: 'seals', label: 'Seals', icon: Stamp, roles: ['admin', 'designer'] },
    { section: 'Ops', roles: ['admin', 'general_manager', 'foreman', 'driver', 'sales'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin', 'general_manager', 'foreman'] },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, roles: ['admin', 'foreman'] },
    { id: 'pos', label: 'Purchase Orders', icon: FileCheck2, roles: ['admin', 'sales', 'foreman'] },
    { id: 'todos', label: 'To-do List', icon: CheckSquare, badge: true, roles: ['admin', 'foreman', 'driver', 'sales', 'designer', 'engineer', 'floor_worker'] },
    { id: 'delivery', label: 'Delivery', icon: Truck, roles: ['admin', 'foreman', 'driver', 'sales'] },
    { id: 'calendar', label: 'Calendar', icon: Calendar, roles: ['admin', 'foreman', 'sales', 'designer'] },
    { section: 'Management', roles: ['admin'] },
    { id: 'workforce', label: 'Workforce', icon: Users, roles: ['admin'] },
    { id: 'users', label: 'Users', icon: Users, roles: ['admin'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, roles: ['admin', 'sales'] },
    { id: 'payroll', label: 'Payroll', icon: DollarSign, roles: ['admin'] },
    { id: 'punch', label: 'Punch Clock', icon: Clock, roles: ['admin', 'foreman', 'driver', 'designer'] },
  ];

  return (
    <div className="w-[240px] bg-win-surface border-r border-win-border flex flex-col shrink-0 h-screen select-none">
      <div className="p-5 border-b border-win-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-[4px] bg-win-accent flex items-center justify-center shrink-0">
          <Building2 className="text-white w-6 h-6" />
        </div>
        <div className="leading-none">
          <div className="text-[18px] font-semibold text-win-text min-w-[120px] whitespace-nowrap">Forge Mfg</div>
          <div className="text-[11px] text-win-text-sec mt-1 tracking-wider">V2.69</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-1">
        {navItems.map((item, idx) => {
          if (item.roles && !item.roles.includes(currentUser.role)) return null;

          if (item.section) {
            // Check if there are any visible children under this section
            let hasVisibleChildren = false;
            for (let i = idx + 1; i < navItems.length; i++) {
              if (navItems[i].section) break; // Next section found
              if (navItems[i].roles && navItems[i].roles!.includes(currentUser.role)) {
                hasVisibleChildren = true;
                break;
              }
            }
            if (!hasVisibleChildren) return null;

            return <div key={idx} className="px-3 pt-4 pb-1 text-[11px] uppercase tracking-widest text-win-text-sec font-semibold">{item.section}</div>;
          }

          const Icon = item.icon!;
          const isActive = currentPage === item.id;
          const badge = item.badge ? getBadgeCount(item.id!) : 0;

          return (
            <div 
              key={item.id} 
              onClick={() => setPage(item.id!)}
              className={`flex items-center gap-3 px-3 py-[8px] mx-1 rounded-[4px] cursor-pointer text-[14px] transition-colors ${isActive ? 'bg-[#e5f1fb] text-win-accent relative' : 'text-win-text hover:bg-win-surface-hover'}`}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[16px] bg-win-accent rounded-r-[2px]"></div>}
              <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              <span className={isActive ? 'font-medium' : ''}>{item.label}</span>
              {badge > 0 && <span className="ml-auto text-[10px] bg-win-accent text-white px-2 py-0.5 rounded-full font-bold">{badge}</span>}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-win-border flex flex-col gap-2 relative">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold text-win-text-sec uppercase tracking-wider">Alerts</div>
          <button className="p-1 hover:bg-[#e5e5e5] rounded text-win-text-sec relative transition-colors group" title="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#d13438] rounded-full border border-win-surface"></span>
            
            <div className="absolute bottom-full mb-2 left-0 w-64 bg-win-surface border border-win-border rounded shadow-lg text-left hidden group-hover:flex flex-col z-50">
              <div className="p-2 border-b border-win-border text-[11px] font-semibold text-win-text-sec uppercase">Recent Alerts</div>
              <div className="p-3 border-b border-[#f0f0f0] hover:bg-[#fafafa]">
                <div className="text-xs font-semibold text-win-text mb-1">New Seal Available</div>
                <div className="text-[11px] text-win-text-sec">P.Eng Robert K. sealed Lot 42 package</div>
              </div>
              <div className="p-3 hover:bg-[#fafafa]">
                <div className="text-xs font-semibold text-win-text mb-1">Inventory Alert</div>
                <div className="text-[11px] text-[#d13438]">2x4 - 16ft SPF is below threshold</div>
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-win-surface-hover p-2 rounded-[4px] -mx-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-8 h-8 rounded-[4px] bg-[#e5e5e5] flex items-center justify-center text-xs font-bold text-win-text">
            {currentUser.first[0]}{currentUser.last[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-win-text truncate">{currentUser.first} {currentUser.last}</div>
            <div className="text-[11px] text-win-text-sec uppercase">{currentUser.role}</div>
          </div>
        </div>

        {menuOpen && (
          <div className="absolute bottom-[70px] left-2 right-2 bg-win-surface border border-win-border rounded-[4px] shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-win-border text-[11px] font-semibold text-win-text-sec uppercase">Switch User</div>
            {users.map(u => (
              <div 
                key={u.id} 
                onClick={() => { setCurrentUserId(u.id); setMenuOpen(false); }}
                className="flex items-center gap-3 p-2 hover:bg-[#f3f3f3] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-[4px] bg-[#e5e5e5] flex items-center justify-center text-[10px] font-bold">
                  {u.first[0]}{u.last[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{u.first} {u.last}</div>
                  <div className="text-[10px] text-win-text-sec">{u.role}</div>
                </div>
                {currentUser.id === u.id && <div className="w-2 h-2 rounded-full bg-win-accent"></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
