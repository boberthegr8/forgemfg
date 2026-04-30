import { useState } from 'react';
import { Wrench, AlertTriangle } from 'lucide-react';

export function MaintenancePage() {
  const [equipment] = useState([
    { id: 1, name: 'Saw 1 - Alpine', status: 'operational', lastService: '2024-02-15', nextService: '2024-05-15', issues: 0 },
    { id: 2, name: 'Table A Tracker', status: 'needs_attention', lastService: '2023-11-10', nextService: '2024-03-10', issues: 2 },
    { id: 3, name: 'Forklift 3', status: 'down', lastService: '2024-01-20', nextService: '2024-04-20', issues: 1 }
  ]);

  return (
    <div className="flex flex-col h-full bg-win-bg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <Wrench className="w-5 h-5 text-win-accent" />
           <span className="text-xl font-semibold">Equipment Maintenance</span>
        </div>
        <button className="win-btn win-btn-primary flex items-center gap-2">
          Schedule Service
        </button>
      </div>

      <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex-1">
        <div className="flex bg-[#fafafa] border-b border-win-border text-xs font-semibold text-win-text-sec uppercase tracking-wider">
          <div className="flex-[2] p-4">Equipment Name</div>
          <div className="w-40 p-4 text-center">Status</div>
          <div className="flex-1 p-4">Last Service</div>
          <div className="flex-1 p-4">Next Service Due</div>
          <div className="w-32 p-4 text-center">Active Issues</div>
        </div>
        <div className="flex flex-col">
          {equipment.map(eq => (
            <div key={eq.id} className="flex border-b border-[#f0f0f0] hover:bg-[#fafafa] items-center text-sm transition-colors">
              <div className="flex-[2] p-4 font-medium">{eq.name}</div>
              <div className="w-40 p-4 flex justify-center">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  eq.status === 'operational' ? 'bg-[#dff6dd] text-[#107c10]' :
                  eq.status === 'down' ? 'bg-[#fde7e9] text-[#d13438]' :
                  'bg-[#fff4ce] text-[#d83b01]'
                }`}>
                  {eq.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex-1 p-4 text-win-text-sec">{eq.lastService}</div>
              <div className="flex-1 p-4 font-semibold text-win-text-sec">{eq.nextService}</div>
              <div className="w-32 p-4 flex justify-center">
                {eq.issues > 0 ? (
                  <span className="flex items-center gap-1 text-[#d83b01] font-semibold"><AlertTriangle className="w-3 h-3" /> {eq.issues}</span>
                ) : (
                  <span className="text-win-text-sec">None</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
