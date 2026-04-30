import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Check, X, FileUp, Package, Truck, ArrowRight, FileText } from 'lucide-react';

export function CustomerPortalPage() {
  const { quotes, deals, acceptQuote, updateQuote } = useAppStore();
  const fmt = (n: number) => '$' + Number(n).toLocaleString();

  const myQuotes = quotes.slice(0, 3);
  const myDeals = deals.slice(0, 3);

  return (
    <div className="p-6 overflow-y-auto h-full flex flex-col gap-6 bg-win-bg">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-win-text">
          <Package className="w-6 h-6 text-win-accent" /> Contractor Portal
        </h1>
        <p className="text-sm text-win-text-sec">View your quotes, active orders, and deliveries in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-win-surface border border-win-border rounded-[8px] p-5 shadow-sm">
           <h2 className="text-sm font-semibold mb-4 border-b border-win-border pb-2 flex items-center gap-2">
             <FileText className="w-4 h-4 text-win-text-sec" /> Pending Quotes
           </h2>
           <div className="flex flex-col gap-3">
             {myQuotes.map(q => (
               <div key={q.id} className="p-3 border border-win-border rounded-[4px] flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{fmt(q.amount)}</span>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      q.status === 'accepted' ? 'bg-[#dff6dd] text-[#107c10]' :
                      q.status === 'rejected' ? 'bg-[#fde7e9] text-[#d13438]' :
                      q.status === 'sent' ? 'bg-[#e5f1fb] text-win-accent' :
                      'bg-[#f3f3f3] text-win-text-sec' 
                    }`}>{q.status}</span>
                  </div>
                  <div className="text-xs text-win-text-sec truncate">{q.desc || 'No description'}</div>
                  
                  {q.status !== 'accepted' && q.status !== 'rejected' && (
                    <div className="mt-2 pt-2 border-t border-[#f0f0f0] flex justify-end gap-2">
                      <button className="win-btn win-btn-default px-2 py-1 text-xs text-[#d13438] hover:bg-[#fde7e9]" onClick={() => updateQuote(q.id, {status: 'rejected'})}>
                        <X className="w-3 h-3 inline mr-1" /> Reject
                      </button>
                      <button className="win-btn win-btn-primary px-2 py-1 text-xs" onClick={() => acceptQuote(q.id, 'PO-1234')}>
                        <Check className="w-3 h-3 inline mr-1" /> Accept Quote
                      </button>
                    </div>
                  )}
               </div>
             ))}
           </div>
        </div>
        
        <div className="bg-win-surface border border-win-border rounded-[8px] p-5 shadow-sm">
           <h2 className="text-sm font-semibold mb-4 border-b border-win-border pb-2 flex items-center gap-2">
             <Truck className="w-4 h-4 text-win-text-sec" /> Active Orders
           </h2>
           <div className="flex flex-col gap-3">
             {myDeals.map(d => (
               <div key={d.id} className="p-3 border border-win-border bg-[#fafafa] rounded-[4px] relative group overflow-hidden">
                 <div className="absolute top-0 left-0 bottom-0 w-1 bg-win-accent"></div>
                 <div className="flex justify-between items-start pl-2">
                   <div>
                     <div className="font-semibold text-sm">{d.company}</div>
                     <div className="text-xs text-win-text-sec mt-1">{d.client}</div>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-win-text">{fmt(d.value)}</span>
                      <span className="text-[10px] uppercase font-bold bg-[#e5e5e5] px-1.5 py-0.5 rounded text-win-text-sec">{d.stage}</span>
                   </div>
                 </div>
                 {d.deliveryDate && (
                    <div className="pl-2 mt-3 text-xs text-win-text-sec flex items-center gap-1 font-medium">
                      <Truck className="w-3 h-3" /> Scheduled for: <span className="text-win-text">{d.deliveryDate}</span>
                    </div>
                 )}
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
