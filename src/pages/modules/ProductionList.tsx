import { useState } from 'react';
import { Settings, Play, Check, Pause, Truck, X } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { format } from 'date-fns';

export function ProductionList({ title }: { title: string }) {
  const { currentUser, addDelivery, users, productionItems, updateState } = useAppStore();
  const canEdit = ['admin', 'general_manager', 'foreman'].includes(currentUser?.role || '');
  const items = productionItems;
  const setItems = (newItems: any[]) => updateState({ productionItems: newItems });
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);

  // Delivery Modal State
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [pendingDeliveryItem, setPendingDeliveryItem] = useState<any>(null);
  const [deliveryData, setDeliveryData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    slot: 'am',
    customer: '',
    address: '',
    driver: '',
  });

  const drivers = users.filter(u => u.role === 'driver');

  const handleDrop = (stage: string) => {
    if (!canEdit) return;
    if (draggedItemId) {
      if (stage === 'delivery') {
        const item = items.find(i => i.id === draggedItemId);
        if (item) {
          setPendingDeliveryItem(item);
          // Try to guess customer if 'Lot' or name includes it, otherwise blank
          let cust = item.name.split('-')[2]?.trim() || '';
          setDeliveryData({ ...deliveryData, customer: cust || item.name });
          setDeliveryModalOpen(true);
        }
      } else {
        setItems(items.map(x => x.id === draggedItemId ? { ...x, status: stage } : x));
      }
      setDraggedItemId(null);
    }
  };

  const handleConfirmDelivery = () => {
    if (!pendingDeliveryItem) return;
    addDelivery({
      id: Math.floor(Math.random() * 10000) + 1000,
      customer: deliveryData.customer || pendingDeliveryItem.name,
      address: deliveryData.address,
      date: deliveryData.date,
      slot: deliveryData.slot,
      driver: deliveryData.driver,
      hardware: '',
      call: '',
      comments: pendingDeliveryItem.name + ` (Qty: ${pendingDeliveryItem.quantity})`,
      status: 'scheduled',
      ownerId: currentUser?.id || 1
    });
    setItems(items.map(x => x.id === pendingDeliveryItem.id ? { ...x, status: 'delivery' } : x));
    setDeliveryModalOpen(false);
    setPendingDeliveryItem(null);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      
      <div className="grid grid-cols-5 gap-4 h-full">
        {['queued', 'cutting', 'assembly', 'completed', 'delivery'].map(stage => (
          <div 
            key={stage} 
            className={`bg-[#f8f8f8] border ${stage === 'delivery' ? 'border-[#0078d4] bg-[#e5f1fb]' : 'border-win-border'} rounded flex flex-col p-3 gap-3`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(stage);
            }}
          >
            <h3 className={`font-semibold text-xs uppercase tracking-wider flex justify-between items-center ${stage === 'delivery' ? 'text-[#0078d4]' : 'text-win-text-sec'}`}>
              <div className="flex items-center gap-1">
                {stage === 'delivery' && <Truck className="w-3 h-3" />}
                {stage}
              </div>
              <span className={`${stage === 'delivery' ? 'bg-[#0078d4] text-white' : 'bg-gray-200 text-gray-700'} px-1.5 py-0.5 rounded text-[10px]`}>
                {items.filter(i => i.status === stage).length}
              </span>
            </h3>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {items.filter(i => i.status === stage).map(item => (
                <div 
                  key={item.id} 
                  draggable={canEdit && stage !== 'delivery'}
                  onDragStart={() => canEdit && stage !== 'delivery' && setDraggedItemId(item.id)}
                  onDragEnd={() => canEdit && stage !== 'delivery' && setDraggedItemId(null)}
                  className={`bg-white border text-sm border-win-border p-3 rounded shadow-sm transition-all ${canEdit && stage !== 'delivery' ? 'cursor-pointer hover:border-win-accent hover:shadow-md active:opacity-60 active:scale-95' : ''}`}
                >
                  <div className="font-semibold mb-1">{item.name}</div>
                  <div className="text-xs text-win-text-sec mb-3">Qty: {item.quantity} • {item.station}</div>
                  {canEdit && stage !== 'delivery' && (
                    <div className="flex justify-end gap-1">
                      {stage !== 'completed' && (
                        <button 
                          className="text-[10px] uppercase font-bold text-[#107c10] hover:bg-[#dff6dd] px-2 py-1 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            const stages = ['queued', 'cutting', 'assembly', 'completed', 'delivery'];
                            const next = stages[stages.indexOf(stage) + 1];
                            if (next === 'delivery') {
                              setPendingDeliveryItem(item);
                              let cust = item.name.split('-')[2]?.trim() || '';
                              setDeliveryData({ ...deliveryData, customer: cust || item.name });
                              setDeliveryModalOpen(true);
                            } else {
                              setItems(items.map(x => x.id === item.id ? { ...x, status: next } : x));
                            }
                          }}
                        >
                          Forward
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {deliveryModalOpen && pendingDeliveryItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-win-surface border border-win-border rounded-[8px] w-[400px] shadow-lg flex flex-col">
            <div className="px-6 py-4 border-b border-win-border flex justify-between items-center bg-[#fbfbfb] rounded-t-[8px]">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-win-accent" /> Schedule Delivery
                </h2>
                <div className="text-sm text-win-text-sec mt-1">For: {pendingDeliveryItem.name}</div>
              </div>
              <button onClick={() => setDeliveryModalOpen(false)} className="text-win-text-sec hover:text-win-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-xs font-semibold">Customer / Site Name
                <input className="win-input" value={deliveryData.customer} onChange={e => setDeliveryData({...deliveryData, customer: e.target.value})} placeholder="e.g. Smith Residence" />
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold">Delivery Address
                <input className="win-input" value={deliveryData.address} onChange={e => setDeliveryData({...deliveryData, address: e.target.value})} placeholder="Full address (for GPS)" />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-xs font-semibold">Date
                  <input type="date" className="win-input" value={deliveryData.date} onChange={e => setDeliveryData({...deliveryData, date: e.target.value})} />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold">Time Slot
                  <select className="win-input" value={deliveryData.slot} onChange={e => setDeliveryData({...deliveryData, slot: e.target.value})}>
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                    <option value="priority-1">1st Priority</option>
                    <option value="priority-2">2nd Priority</option>
                    <option value="priority-3">3rd Priority</option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-1 text-xs font-semibold">Driver
                  <select className="win-input" value={deliveryData.driver} onChange={e => setDeliveryData({...deliveryData, driver: e.target.value})}>
                    <option value="">(Unassigned)</option>
                    {drivers.map(d => (
                      <option key={d.id} value={`${d.first} ${d.last}`}>{d.first} {d.last}</option>
                    ))}
                  </select>
              </label>
            </div>

            <div className="px-6 py-4 flex justify-end gap-2 border-t border-win-border bg-[#fbfbfb] rounded-b-[8px]">
               <button className="win-btn win-btn-default" onClick={() => setDeliveryModalOpen(false)}>Cancel</button>
               <button className="win-btn win-btn-primary" onClick={handleConfirmDelivery}>Schedule Delivery</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
