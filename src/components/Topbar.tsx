import { ReactNode, useState, useRef, useEffect } from 'react';
import { Search, User, FileText } from 'lucide-react';
import { useAppStore } from '../lib/store';

export function Topbar({ title, actions }: { title: string, actions?: ReactNode }) {
  const [q, setQ] = useState('');
  const [showRes, setShowRes] = useState(false);
  const { contacts, quotes, userRole, users, viewFilter, setViewFilter, currentUser } = useAppStore();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRes(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Use effective view scope for search results
  const scopedContacts = userRole === 'admin' ? contacts : contacts.filter(c => (c.ownerId || 1) === currentUser.id);
  const scopedQuotes = userRole === 'admin' ? quotes : quotes.filter(q => (q.ownerId || 1) === currentUser.id);

  const resContacts = q ? scopedContacts.filter(c => (c.first + ' ' + c.last).toLowerCase().includes(q.toLowerCase()) || c.company?.toLowerCase().includes(q.toLowerCase())) : [];
  const resQuotes = q ? scopedQuotes.filter(qu => qu.client?.toLowerCase().includes(q.toLowerCase()) || qu.desc?.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <div className="h-[60px] bg-win-surface border-b border-win-border flex items-center px-6 gap-4 shrink-0 shadow-sm relative z-40">
      <div className="text-[20px] font-semibold text-win-text flex-1 tracking-tight">{title}</div>
      
      {userRole === 'admin' && (
        <div className="flex items-center gap-2 mr-4">
          <span className="text-xs text-win-text-sec font-semibold">Viewing:</span>
          <select 
            className="win-input py-1 text-xs px-2 w-[150px]"
            value={viewFilter}
            onChange={(e) => setViewFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">All Users</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.first} {u.last} ({u.role})</option>
            ))}
          </select>
        </div>
      )}

      {/* Global Search */}
      <div className="relative w-64" ref={searchRef}>
         <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-win-text-sec" />
         </div>
         <input 
            type="text" 
            className="win-input w-full pl-8 py-1.5 text-xs bg-[#f3f3f3] border-transparent focus:bg-white transition-colors" 
            placeholder="Search dealers, quotes..."
            value={q}
            onChange={(e) => {
               setQ(e.target.value);
               setShowRes(true);
            }}
            onFocus={() => { if(q) setShowRes(true); }}
         />
         
         {showRes && q && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-win-border shadow-lg rounded-[4px] max-h-96 overflow-y-auto">
               {resContacts.length === 0 && resQuotes.length === 0 && (
                  <div className="p-3 text-xs text-win-text-sec text-center">No results found.</div>
               )}
               {resContacts.length > 0 && (
                 <div>
                    <div className="bg-[#f3f3f3] px-3 py-1 text-[10px] uppercase font-bold text-win-text-sec tracking-wider">Dealers</div>
                    {resContacts.slice(0, 5).map(c => (
                      <div key={c.id} className="p-2 border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa] cursor-pointer flex gap-2 items-center text-xs">
                         <User className="w-3 h-3 text-win-accent" />
                         <span className="font-semibold">{c.first} {c.last}</span>
                         <span className="text-win-text-sec truncate">{c.company}</span>
                      </div>
                    ))}
                 </div>
               )}
               {resQuotes.length > 0 && (
                 <div>
                    <div className="bg-[#f3f3f3] px-3 py-1 text-[10px] uppercase font-bold text-win-text-sec tracking-wider">Quotes</div>
                    {resQuotes.slice(0, 5).map(qu => (
                      <div key={qu.id} className="p-2 border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa] cursor-pointer flex gap-2 items-center text-xs">
                         <FileText className="w-3 h-3 text-win-accent" />
                         <span className="font-semibold">{qu.client}</span>
                         <span className="text-win-text-sec truncate">${Number(qu.amount).toLocaleString()}</span>
                      </div>
                    ))}
                 </div>
               )}
            </div>
         )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
