import { useState } from 'react';
import { Award, FileText, Download } from 'lucide-react';

export function SealsPage() {
  const [seals] = useState([
    { id: 1, sealNum: 'SEAL-2024-001', job: 'Smith Residence', engineer: 'P.Eng Robert K.', date: '2024-03-20', state: 'FL' },
    { id: 2, sealNum: 'SEAL-2024-002', job: 'Lot 42 Subdivision', engineer: 'P.Eng Robert K.', date: '2024-03-18', state: 'GA' }
  ]);

  return (
    <div className="flex flex-col h-full bg-win-bg p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
         <Award className="w-5 h-5 text-win-accent" />
         <span className="text-xl font-semibold">Engineered Seals</span>
      </div>

      <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex-1">
        <div className="flex bg-[#fafafa] border-b border-win-border text-xs font-semibold text-win-text-sec uppercase tracking-wider">
          <div className="w-32 p-4">Seal Number</div>
          <div className="flex-[2] p-4">Job / Project</div>
          <div className="flex-1 p-4">Engineer</div>
          <div className="w-24 p-4 text-center">State</div>
          <div className="w-32 p-4">Issue Date</div>
          <div className="w-24 p-4 text-center">Document</div>
        </div>
        <div className="flex flex-col">
          {seals.map(s => (
             <div key={s.id} className="flex border-b border-[#f0f0f0] hover:bg-[#fafafa] items-center text-sm transition-colors">
               <div className="w-32 p-4 font-mono text-xs">{s.sealNum}</div>
               <div className="flex-[2] p-4 font-medium">{s.job}</div>
               <div className="flex-1 p-4 text-win-text-sec">{s.engineer}</div>
               <div className="w-24 p-4 text-center font-semibold text-win-text-sec">{s.state}</div>
               <div className="w-32 p-4 text-win-text-sec">{s.date}</div>
               <div className="w-24 p-4 flex justify-center">
                 <button className="text-win-accent hover:text-blue-700" title="Download PDF"><Download className="w-4 h-4" /></button>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
