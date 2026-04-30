import { useState } from 'react';
import { ClipboardCheck, Check, X } from 'lucide-react';

export function SignOffsPage() {
  const [signoffs, setSignoffs] = useState([
    { id: 1, doc: 'Final Design Profile - Smith Res', type: 'Design', status: 'pending', requestedBy: 'Sarah J.', date: '2024-03-18' },
    { id: 2, doc: 'Framing Plan - Lot 42', type: 'Structural', status: 'pending', requestedBy: 'Dave W.', date: '2024-03-19' },
    { id: 3, doc: 'Delivery Terms - ABC Builders', type: 'Administrative', status: 'approved', requestedBy: 'Mike S.', date: '2024-03-15' }
  ]);

  return (
    <div className="flex flex-col h-full bg-win-bg p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
         <ClipboardCheck className="w-5 h-5 text-win-accent" />
         <span className="text-xl font-semibold">Sign Offs</span>
      </div>

      <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex-1">
        <div className="flex bg-[#fafafa] border-b border-win-border text-xs font-semibold text-win-text-sec uppercase tracking-wider">
          <div className="flex-[2] p-4">Document / Request</div>
          <div className="flex-1 p-4">Type</div>
          <div className="flex-1 p-4">Requested By</div>
          <div className="flex-1 p-4">Date</div>
          <div className="w-24 p-4 text-center">Status</div>
          <div className="w-32 p-4 text-center">Actions</div>
        </div>
        <div className="flex flex-col">
          {signoffs.map(s => (
            <div key={s.id} className="flex border-b border-[#f0f0f0] hover:bg-[#fafafa] items-center text-sm transition-colors">
              <div className="flex-[2] p-4 font-medium">{s.doc}</div>
              <div className="flex-1 p-4 text-win-text-sec">{s.type}</div>
              <div className="flex-1 p-4 text-win-text-sec">{s.requestedBy}</div>
              <div className="flex-1 p-4 text-win-text-sec">{s.date}</div>
              <div className="w-24 p-4 text-center">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  s.status === 'approved' ? 'bg-[#dff6dd] text-[#107c10]' :
                  s.status === 'rejected' ? 'bg-[#fde7e9] text-[#d13438]' :
                  'bg-[#fff4ce] text-[#d83b01]'
                }`}>
                  {s.status}
                </span>
              </div>
              <div className="w-32 p-4 flex justify-center gap-2">
                {s.status === 'pending' ? (
                  <>
                    <button className="win-btn win-btn-default px-2 py-1 text-[#107c10] hover:bg-[#dff6dd]" onClick={() => setSignoffs(signoffs.map(x => x.id === s.id ? { ...x, status: 'approved' } : x))} title="Approve"><Check className="w-4 h-4" /></button>
                    <button className="win-btn win-btn-default px-2 py-1 text-[#d13438] hover:bg-[#fde7e9]" onClick={() => setSignoffs(signoffs.map(x => x.id === s.id ? { ...x, status: 'rejected' } : x))} title="Reject"><X className="w-4 h-4" /></button>
                  </>
                ) : (
                  <span className="text-xs text-win-text-sec">Reviewed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
