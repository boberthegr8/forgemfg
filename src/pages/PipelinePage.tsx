import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Trello, Truck } from 'lucide-react';

export function PipelinePage() {
  const { deals, deliveries, updateState, addDealToDelivery, currentUser, userRole, viewFilter } = useAppStore();
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));
  const [draggedDealId, setDraggedDealId] = useState<number | null>(null);

  const STAGES = ['PO Received', 'Design/Engineering', 'Pending Sign Off', 'Production', 'Ready to Ship', 'Completed'];

  const effectiveUserId = userRole === 'admin' ? viewFilter : currentUser.id;
  const scopedDeals = effectiveUserId === 'all' ? deals : deals.filter(d => (d.ownerId || 1) === effectiveUserId);

  const fmt = (n: number) => '$' + Number(n).toLocaleString();

  const handleMoveStage = (id: number, newStage: string) => {
    updateState({
      deals: deals.map(d => d.id === id ? { ...d, stage: newStage } : d)
    });
  };

  const handleScheduleDelivery = () => {
    if (!selectedDeal) return;
    addDealToDelivery(selectedDeal, deliveryDate);
    setScheduleModal(false);
    setSelectedDeal(null);
  };

  return (
    <div className="flex flex-col h-full bg-win-bg overflow-hidden p-6 gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
           <Trello className="w-5 h-5 text-win-accent" />
           <span className="text-xl font-semibold">Pipeline</span>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageDeals = scopedDeals.filter(d => d.stage === stage);
          return (
            <div 
              key={stage} 
              className="w-[300px] shrink-0 bg-win-surface border border-win-border rounded-[4px] flex flex-col max-h-full"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedDealId) {
                  handleMoveStage(draggedDealId, stage);
                  setDraggedDealId(null);
                }
              }}
            >
              <div className="p-3 border-b border-win-border font-semibold flex justify-between items-center bg-[#fafafa]">
                <span className="text-win-text-sec text-sm uppercase tracking-wider">{stage}</span>
                <span className="bg-[#e5e5e5] text-xs px-2 py-0.5 rounded-full">{stageDeals.length}</span>
              </div>
              <div className="p-3 flex flex-col gap-3 overflow-y-auto flex-1">
                {stageDeals.map(deal => (
                  <div 
                    key={deal.id} 
                    draggable
                    onDragStart={() => setDraggedDealId(deal.id)}
                    onDragEnd={() => setDraggedDealId(null)}
                    className="p-4 bg-white border border-win-border rounded-[4px] shadow-sm hover:border-win-accent hover:shadow-md transition cursor-pointer flex flex-col gap-2 group relative active:opacity-60 active:scale-95"
                  >
                    <div className="font-semibold text-sm">{deal.client}</div>
                    <div className="text-xs text-win-text-sec">{deal.company}</div>
                    
                    <div className="flex gap-2 text-[10px] font-semibold text-win-text-sec flex-wrap">
                       {deal.productType && <span className="bg-[#f0f0f0] px-1.5 py-0.5 rounded">{deal.productType}</span>}
                       {deal.poNumber && <span className="bg-[#e5f1fb] text-win-accent px-1.5 py-0.5 rounded">PO: {deal.poNumber}</span>}
                    </div>

                    <div className="font-semibold text-win-accent mt-1">{fmt(deal.value)}</div>
                    
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                      <select 
                         className="text-[10px] border border-[#e5e5e5] rounded bg-white p-1"
                         value={deal.stage}
                         onChange={(e) => handleMoveStage(deal.id, e.target.value)}
                         onClick={e => e.stopPropagation()}
                      >
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button 
                        className="bg-win-accent text-white p-1 rounded hover:bg-win-accent-hover text-[10px] flex items-center justify-center gap-1"
                        onClick={(e) => { e.stopPropagation(); setSelectedDeal(deal); setScheduleModal(true); }}
                      >
                         <Truck className="w-3 h-3" /> Delivery
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {scheduleModal && selectedDeal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-win-surface border border-win-border rounded-[8px] w-[400px] shadow-lg flex flex-col">
            <div className="px-6 py-4 border-b border-win-border text-lg font-semibold flex">
              Schedule Delivery From Pipeline
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="text-sm">
                Schedule a delivery for <span className="font-semibold">{selectedDeal.client}</span> ({selectedDeal.company})
              </div>
              <label className="flex flex-col gap-1 text-xs font-semibold">Delivery Date
                <input type="date" className="win-input" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
              </label>
            </div>
            <div className="px-6 py-4 flex justify-end gap-2 border-t border-win-border bg-[#fbfbfb] rounded-b-[8px]">
              <button className="win-btn win-btn-default" onClick={() => setScheduleModal(false)}>Cancel</button>
              <button className="win-btn win-btn-primary" onClick={handleScheduleDelivery}>Schedule & Go to Board</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
