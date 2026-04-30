import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { FileArchive, Upload, Filter, Search, FileText, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';

export function PlansPage() {
  const { quotes, contacts } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fake some plans based on accepted quotes for visual effect
  const plansData = quotes.filter(q => q.status === 'accepted' || q.status === 'sent').map(q => ({
    id: q.id * 10,
    quoteId: q.id,
    projectName: q.desc,
    client: q.client,
    company: q.company,
    type: q.productType,
    date: q.date,
    files: [
      { id: Math.random(), name: `${q.productType.replace(' ', '_')}_Plan_v1.pdf`, size: '2.4 MB', type: 'pdf' },
      { id: Math.random(), name: `Engineering_Specs.pdf`, size: '1.1 MB', type: 'pdf' }
    ]
  }));

  const filteredPlans = plansData.filter(p => 
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-win-bg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <FileArchive className="w-5 h-5 text-win-accent" />
           <span className="text-xl font-semibold">Plans & Documents</span>
        </div>
        <button className="win-btn win-btn-primary flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex flex-col flex-1 min-h-[400px]">
        <div className="flex p-4 border-b border-win-border justify-between bg-[#fbfbfb]">
          <div className="flex gap-2 relative w-[300px]">
            <Search className="w-4 h-4 text-win-text-sec absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search projects or clients..." 
              className="pl-9 pr-3 py-1.5 text-xs border border-win-border rounded bg-white w-full outline-none focus:border-win-accent focus:ring-1 focus:ring-win-accent transition"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex bg-[#fafafa] border-b border-win-border text-[10px] font-semibold text-win-text-sec uppercase tracking-wider">
          <div className="w-1/3 p-3">Project / Client</div>
          <div className="w-1/6 p-3">Type</div>
          <div className="w-1/6 p-3">Date</div>
          <div className="flex-1 p-3">Attached Documents</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredPlans.length > 0 ? filteredPlans.map(p => (
            <div key={p.id} className="flex border-b border-win-border hover:bg-[#fbfbfb] transition text-sm">
              <div className="w-1/3 p-3 lg:p-4">
                <div className="font-semibold text-win-text truncate">{p.projectName}</div>
                <div className="text-xs text-win-text-sec mt-1 truncate">{p.company} ({p.client})</div>
              </div>
              <div className="w-1/6 p-3 lg:p-4">
                <span className="bg-[#e5e5e5] px-2 py-0.5 rounded text-[10px] uppercase font-bold text-win-text-sec flex items-center w-max">
                  {p.type}
                </span>
              </div>
              <div className="w-1/6 p-3 lg:p-4 text-xs text-win-text-sec">
                {p.date}
              </div>
              <div className="flex-1 p-3 lg:p-4">
                <div className="flex flex-col gap-2">
                  {p.files.map(f => (
                    <div key={f.id} className="flex items-center justify-between border border-[#e5e5e5] bg-white rounded p-2 hover:border-[#0078d4] transition group">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-[#d13438] shrink-0" />
                        <span className="text-xs truncate font-medium text-win-text cursor-pointer hover:underline">{f.name}</span>
                        <span className="text-[10px] text-win-text-sec shrink-0">{f.size}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-[#e5f1fb] text-[#0078d4] rounded" title="View"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1 hover:bg-[#e5f1fb] text-[#0078d4] rounded" title="Download"><Download className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-win-text-sec">
               <FileArchive className="w-8 h-8 mx-auto mb-2 text-[#cccccc]" />
               <div>No plans or documents found.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
