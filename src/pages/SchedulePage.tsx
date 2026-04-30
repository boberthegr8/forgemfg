import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Calendar, Filter, Search, Truck, ArrowRight, User, X } from 'lucide-react';
import { format, addDays } from 'date-fns';

export function SchedulePage() {
  const { productionItems, deliveries, currentUser, updateState, addDelivery, users } = useAppStore();
  const [filter, setFilter] = useState('all');

  const canEdit = ['admin', 'general_manager', 'foreman', 'sales'].includes(currentUser?.role || '');

  const [dragInfo, setDragInfo] = useState<{ id: number, type: 'production' | 'delivery' } | null>(null);

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

  const upcomingDays = Array.from({ length: 5 }).map((_, i) => addDays(new Date(), i));

  const [editDeliveryItem, setEditDeliveryItem] = useState<any>(null);

  const handleUpdateDelivery = () => {
    if (!editDeliveryItem) return;
    updateState({
      deliveries: deliveries.map(d => d.id === editDeliveryItem.id ? editDeliveryItem : d)
    });
    setEditDeliveryItem(null);
  };

  const handleDrop = (e: React.DragEvent, dateStr: string, targetType: 'production' | 'delivery') => {

    e.preventDefault();
    if (!canEdit || !dragInfo) return;

    if (dragInfo.type === 'production') {
      const item = productionItems.find(p => p.id === dragInfo.id);
      if (!item) return;

      if (targetType === 'delivery') {
        // Only allow dropping into delivery if completed or just prompt
        setPendingDeliveryItem({ ...item });
        let cust = item.name.split('-')[2]?.trim() || '';
        setDeliveryData({
          date: dateStr,
          slot: 'am',
          customer: cust || item.name,
          address: '',
          driver: ''
        });
        setDeliveryModalOpen(true);
      } else {
        // Change production day
        updateState({
          productionItems: productionItems.map(p => p.id === dragInfo.id ? { ...p, date: dateStr } : p)
        });
      }
    } else if (dragInfo.type === 'delivery') {
      if (targetType === 'delivery') {
        updateState({
          deliveries: deliveries.map(d => d.id === dragInfo.id ? { ...d, date: dateStr } : d)
        });
      }
    }
    
    setDragInfo(null);
  };

  const [editProductionItem, setEditProductionItem] = useState<any>(null);

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
    
    // Update production item to status delivery
    updateState({
      productionItems: productionItems.map(p => p.id === pendingDeliveryItem.id ? { ...p, status: 'delivery' } : p)
    });

    setDeliveryModalOpen(false);
    setPendingDeliveryItem(null);
  };

  // A super basic schedule view that gathers things up
  return (
    <div className="p-6 h-full flex flex-col gap-6 bg-win-bg overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-win-accent" /> Schedule
          </h1>
          <p className="text-sm text-win-text-sec">Production schedule, tasks, and upcoming events</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
         {upcomingDays.map((ds, idx) => {
           const dsStr = format(ds, 'yyyy-MM-dd');
           const dayDeliveries = (deliveries || []).filter(d => d.date === dsStr);
           const dayProduction = (productionItems || []).filter(p => p.date === dsStr);

           return (
             <div key={idx} className="min-w-[300px] flex-1 bg-win-surface border border-win-border rounded-md shadow-sm p-4">
               <h2 className="font-bold border-b border-win-border pb-2 mb-3">
                 {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : format(ds, 'EEEE, MMM do')}
               </h2>

               {/* Production */}
               <div 
                 className="mb-4 bg-[#fbfbfb] border border-transparent rounded p-2 transition-colors target-drop"
                 onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-[#0078d4]', 'bg-[#e5f1fb]'); }}
                 onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('border-[#0078d4]', 'bg-[#e5f1fb]'); }}
                 onDrop={e => {
                   e.currentTarget.classList.remove('border-[#0078d4]', 'bg-[#e5f1fb]');
                   handleDrop(e, dsStr, 'production');
                 }}
               >
                 <h3 className="text-xs font-semibold text-win-text-sec uppercase mb-2">Production</h3>
                 <div className="flex flex-col gap-2 min-h-[50px]">
                   {dayProduction.length > 0 ? dayProduction.map(p => (
                     <div 
                       key={p.id} 
                       className={`text-sm p-2 bg-[#f8f8f8] border border-win-border rounded ${canEdit ? 'cursor-pointer hover:border-win-accent' : ''}`}
                       draggable={canEdit}
                       onDragStart={() => setDragInfo({ id: p.id, type: 'production' })}
                       onClick={() => canEdit && setEditProductionItem(p)}
                     >
                       <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-white mr-2 ${
                          p.status === 'cutting' ? 'bg-[#d13438]' :
                          p.status === 'assembly' ? 'bg-[#0078d4]' :
                          p.status === 'completed' ? 'bg-[#107c10]' :
                          p.status === 'delivery' ? 'bg-[#0078d4]' :
                          'bg-gray-400'
                       }`}>
                         {p.status === 'delivery' && <Truck className="w-2.5 h-2.5 inline-block mr-1" />}
                         {p.status}
                       </span>
                       {p.name} <span className="text-win-text-sec">({p.station})</span>
                     </div>
                   )) : (
                     <div className="text-xs text-win-text-sec italic pointer-events-none">No production items scheduled.</div>
                   )}
                 </div>
               </div>

               {/* Deliveries */}
               <div 
                 className="bg-[#fbfbfb] border border-transparent rounded p-2 transition-colors target-drop"
                 onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-[#0078d4]', 'bg-[#e5f1fb]'); }}
                 onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('border-[#0078d4]', 'bg-[#e5f1fb]'); }}
                 onDrop={e => {
                   e.currentTarget.classList.remove('border-[#0078d4]', 'bg-[#e5f1fb]');
                   handleDrop(e, dsStr, 'delivery');
                 }}
               >
                 <h3 className="text-xs font-semibold text-[#0078d4] uppercase mb-2 flex items-center gap-1"><Truck className="w-3 h-3" /> Deliveries</h3>
                 <div className="flex flex-col gap-2 min-h-[50px]">
                   {dayDeliveries.length > 0 ? dayDeliveries.map(d => (
                     <div 
                       key={d.id} 
                       className={`text-sm p-2 bg-[#e5f1fb] border border-[#0078d4] rounded flex items-center gap-2 ${canEdit ? 'cursor-pointer hover:shadow-md' : ''}`}
                       draggable={canEdit}
                       onDragStart={() => setDragInfo({ id: d.id, type: 'delivery' })}
                       onClick={() => canEdit && setEditDeliveryItem(d)}
                     >
                       <Truck className="w-4 h-4 text-[#0078d4] flex-shrink-0" />
                       <div className="truncate w-full text-xs pointer-events-none">
                          <strong>{d.customer}</strong>
                          <div className="pointer-events-auto">
                            {d.address ? (
                                <a href={`https://maps.google.com/?q=${encodeURIComponent(d.address)}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="hover:underline hover:text-win-accent inline-flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                  {d.address}
                                </a>
                            ) : 'No Address'}
                          </div>
                       </div>
                     </div>
                   )) : (
                     <div className="text-xs text-win-text-sec italic pointer-events-none">No deliveries scheduled.</div>
                   )}
                 </div>
               </div>
            </div>
           );
         })}
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

      {editProductionItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-win-surface border border-win-border rounded-[8px] w-[400px] shadow-lg flex flex-col">
            <div className="px-6 py-4 border-b border-win-border flex justify-between items-center bg-[#fbfbfb] rounded-t-[8px]">
              <div>
                <h2 className="text-lg font-semibold">Edit Production Item</h2>
                <div className="text-sm text-win-text-sec mt-1">{editProductionItem.name}</div>
              </div>
              <button onClick={() => setEditProductionItem(null)} className="text-win-text-sec hover:text-win-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-xs font-semibold">Station
                <input 
                  className="win-input" 
                  value={editProductionItem.station} 
                  onChange={e => setEditProductionItem({...editProductionItem, station: e.target.value})} 
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold">Date
                <input 
                  type="date" 
                  className="win-input" 
                  value={editProductionItem.date} 
                  onChange={e => setEditProductionItem({...editProductionItem, date: e.target.value})} 
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold">Status
                <select 
                  className="win-input" 
                  value={editProductionItem.status} 
                  onChange={e => setEditProductionItem({...editProductionItem, status: e.target.value})}
                >
                  <option value="queued">Queued</option>
                  <option value="cutting">Cutting</option>
                  <option value="assembly">Assembly</option>
                  <option value="completed">Completed</option>
                  <option value="delivery">Delivery</option>
                </select>
              </label>
            </div>

            <div className="px-6 py-4 flex justify-end gap-2 border-t border-win-border bg-[#fbfbfb] rounded-b-[8px]">
               <button className="win-btn win-btn-default" onClick={() => setEditProductionItem(null)}>Cancel</button>
               <button className="win-btn win-btn-primary" onClick={() => {
                 updateState({
                   productionItems: productionItems.map(p => p.id === editProductionItem.id ? editProductionItem : p)
                 });
                 setEditProductionItem(null);
               }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {editDeliveryItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-win-surface border border-win-border rounded-[8px] w-[400px] shadow-lg flex flex-col">
            <div className="px-6 py-4 border-b border-win-border flex justify-between items-center bg-[#fbfbfb] rounded-t-[8px]">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-win-accent" /> Edit Delivery
                </h2>
              </div>
              <button onClick={() => setEditDeliveryItem(null)} className="text-win-text-sec hover:text-win-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-xs font-semibold">Customer / Site Name
                <input className="win-input" value={editDeliveryItem.customer} onChange={e => setEditDeliveryItem({...editDeliveryItem, customer: e.target.value})} />
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold">Delivery Address
                <input className="win-input" value={editDeliveryItem.address} onChange={e => setEditDeliveryItem({...editDeliveryItem, address: e.target.value})} />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-xs font-semibold">Date
                  <input type="date" className="win-input" value={editDeliveryItem.date} onChange={e => setEditDeliveryItem({...editDeliveryItem, date: e.target.value})} />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold">Time Slot
                  <select className="win-input" value={editDeliveryItem.slot} onChange={e => setEditDeliveryItem({...editDeliveryItem, slot: e.target.value})}>
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                    <option value="priority-1">1st Priority</option>
                    <option value="priority-2">2nd Priority</option>
                    <option value="priority-3">3rd Priority</option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-1 text-xs font-semibold">Driver
                  <select className="win-input" value={editDeliveryItem.driver} onChange={e => setEditDeliveryItem({...editDeliveryItem, driver: e.target.value})}>
                    <option value="">(Unassigned)</option>
                    {drivers.map(d => (
                      <option key={d.id} value={`${d.first} ${d.last}`}>{d.first} {d.last}</option>
                    ))}
                  </select>
              </label>
            </div>

            <div className="px-6 py-4 flex justify-end gap-2 border-t border-win-border bg-[#fbfbfb] rounded-b-[8px]">
               <button className="win-btn win-btn-default" onClick={() => setEditDeliveryItem(null)}>Cancel</button>
               <button className="win-btn win-btn-primary" onClick={handleUpdateDelivery}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
