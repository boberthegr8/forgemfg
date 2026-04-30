import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Truck, ChevronLeft, ChevronRight, QrCode, X, Camera, Upload } from 'lucide-react';
import { format, addDays, startOfWeek, subWeeks, addWeeks, isSameDay } from 'date-fns';

export function DeliveryBoard() {
  const { deliveries, users, addDelivery, editDelivery, deleteDelivery, userRole } = useAppStore();
  const [addingDelivery, setAddingDelivery] = useState(false);
  const [editingDelId, setEditingDelId] = useState<number | null>(null);
  const [viewingQr, setViewingQr] = useState<any>(null);
  
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevPeriod = () => {
    setCurrentDate(viewMode === 'day' ? addDays(currentDate, -1) : addWeeks(currentDate, -1));
  };
  const nextPeriod = () => {
    setCurrentDate(viewMode === 'day' ? addDays(currentDate, 1) : addWeeks(currentDate, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Basic Form State
  const [formData, setFormData] = useState({
    customer: '', address: '', date: new Date().toISOString().slice(0,10),
    slot: 'am', driver: '', hardware: '', call: '', comments: '', status: 'scheduled'
  });

  const canEdit = true;

  const handleOpenAdd = () => {
    setFormData({ customer: '', address: '', date: format(currentDate, 'yyyy-MM-dd'), slot: 'am', driver: '', hardware: '', call: '', comments: '', status: 'scheduled' });
    setEditingDelId(null);
    setAddingDelivery(true);
  };

  const handleOpenEdit = (d: any) => {
    if (!canEdit) return;
    setFormData({ ...d });
    setEditingDelId(d.id);
    setAddingDelivery(true);
  };

  const handleSave = () => {
    if (!formData.customer.trim()) return;
    if (editingDelId) {
      editDelivery(editingDelId, formData);
    } else {
      addDelivery(formData);
    }
    setAddingDelivery(false);
  };

  const handleDelete = () => {
    if (editingDelId && canEdit) {
      deleteDelivery(editingDelId);
      setAddingDelivery(false);
    }
  };

  const DeliveryCard = ({ d }: { d: any; key?: any }) => (
    <div onClick={(e) => { e.stopPropagation(); handleOpenEdit(d); }} className={`p-2 border border-win-border rounded-[4px] hover:border-win-accent transition duration-150 ${canEdit ? 'cursor-pointer' : ''} ${d.status === 'delivered' ? 'opacity-50' : 'bg-white'}`}>
      <div className="flex justify-between items-start mb-1 gap-1">
        <div className="font-semibold text-xs leading-tight line-clamp-2">{d.customer}</div>
        <span className="text-[9px] whitespace-nowrap uppercase font-bold bg-[#f3f3f3] px-1 py-0.5 rounded text-win-text-sec">{d.slot.replace('priority-','')}{d.slot.startsWith('priority')?'st':''}</span>
      </div>
      <div className="text-[10px] text-win-text-sec mb-2 truncate flex justify-between items-center gap-1">
        {d.address ? (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(d.address)}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:underline hover:text-win-accent flex items-center gap-1 truncate"
          >
            {d.address}
          </a>
        ) : '\u2014'}
        <button 
          onClick={(e) => { e.stopPropagation(); setViewingQr(d); }}
          className="p-1 hover:bg-[#e5e5e5] rounded text-win-text-sec hover:text-win-accent shrink-0 transition"
          title="Mobile Ticket / QR"
        >
          <QrCode className="w-3 h-3" />
        </button>
      </div>
      <div className="flex gap-1 flex-wrap">
         <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${d.status === 'scheduled' ? 'bg-[#f0f0f0]' : d.status === 'onroute' ? 'bg-[#e5f1fb] text-win-accent' : 'bg-[#dff6dd] text-[#107c10]'}`}>
           {d.status.toUpperCase()}
         </span>
         {d.driver && <span className="text-[9px] px-1.5 py-0.5 bg-[#f0f0f0] rounded">{d.driver}</span>}
      </div>
    </div>
  );

  const currentDateStr = format(currentDate, 'yyyy-MM-dd');
  const dayDels = deliveries.filter(d => d.date === currentDateStr);
  const weekStart = startOfWeek(currentDate, {weekStartsOn: 1}); // Monday
  const weekDays = Array.from({length: 6}).map((_, i) => addDays(weekStart, i)); // Mon-Sat

  return (
    <div className="flex flex-col h-full bg-win-bg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2">
           <Truck className="w-5 h-5 text-win-accent" />
           <span className="text-xl font-semibold">Delivery Board</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-win-surface border border-win-border rounded-[4px] p-0.5">
            <button className={`px-4 py-1 text-xs font-semibold rounded-[2px] transition ${viewMode === 'day' ? 'bg-win-accent text-white shadow-sm' : 'text-win-text hover:bg-[#f3f3f3]'}`} onClick={() => setViewMode('day')}>Day</button>
            <button className={`px-4 py-1 text-xs font-semibold rounded-[2px] transition ${viewMode === 'week' ? 'bg-win-accent text-white shadow-sm' : 'text-win-text hover:bg-[#f3f3f3]'}`} onClick={() => setViewMode('week')}>Week</button>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-[#e5e5e5] rounded border border-transparent hover:border-win-border transition" onClick={prevPeriod}><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-2 py-1 text-xs font-semibold hover:bg-[#e5e5e5] rounded border border-transparent hover:border-win-border transition" onClick={goToToday}>Today</button>
            <button className="p-1 hover:bg-[#e5e5e5] rounded border border-transparent hover:border-win-border transition" onClick={nextPeriod}><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="font-semibold text-sm min-w-[140px] text-center">
            {viewMode === 'day' ? format(currentDate, 'EEEE, MMM d') : `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 5), 'MMM d, yyyy')}`}
          </div>
          {canEdit && <button className="win-btn win-btn-primary whitespace-nowrap" onClick={handleOpenAdd}>+ Schedule</button>}
        </div>
      </div>

      {viewMode === 'day' ? (
        <div className="grid grid-cols-2 gap-6 pb-6">
           <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex flex-col">
              <div className="p-4 border-b border-win-border font-semibold text-win-accent">☀ AM Run</div>
              <div className="p-3 flex flex-col gap-2 overflow-y-auto">
                 {['priority-1', 'priority-2', 'priority-3', 'am'].map(slot => {
                    const slotDels = dayDels.filter(d => d.slot === slot);
                    if (slotDels.length === 0) return null;
                    return slotDels.map(d => <DeliveryCard key={d.id} d={d} />);
                 })}
                 {dayDels.filter(d => d.slot === 'am' || d.slot.startsWith('priority')).length === 0 && <div className="text-sm text-win-text-sec p-2">No AM deliveries.</div>}
              </div>
           </div>

           <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex flex-col">
              <div className="p-4 border-b border-win-border font-semibold text-[#d83b01]">🌙 PM Run</div>
              <div className="p-3 flex flex-col gap-2 overflow-y-auto">
                 {dayDels.filter(d => d.slot === 'pm').map(d => <DeliveryCard key={d.id} d={d} />)}
                 {dayDels.filter(d => d.slot === 'pm').length === 0 && <div className="text-sm text-win-text-sec p-2">No PM deliveries.</div>}
              </div>
           </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {weekDays.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dDels = deliveries.filter(d => d.date === dayStr);
            const isTodayDay = isSameDay(day, new Date());
            
            return (
              <div key={dayStr} className="w-[280px] shrink-0 bg-win-surface border border-win-border rounded-[4px] flex flex-col">
                <div className={`p-3 border-b border-win-border flex justify-between items-center ${isTodayDay ? 'bg-[#e5f1fb]' : 'bg-[#fafafa]'}`}>
                  <div className="flex flex-col">
                    <span className={`text-sm font-semibold ${isTodayDay ? 'text-win-accent' : ''}`}>{format(day, 'EEEE')}</span>
                    <span className="text-xs text-win-text-sec">{format(day, 'MMM d')}</span>
                  </div>
                  <span className="bg-[#e5e5e5] text-xs px-2 py-0.5 rounded-full font-semibold">{dDels.length}</span>
                </div>
                <div className="p-2 flex flex-col gap-2 overflow-y-auto flex-1">
                  {['priority-1', 'priority-2', 'priority-3', 'am', 'pm'].map(slot => {
                    const slotDels = dDels.filter(d => d.slot === slot);
                    if (slotDels.length === 0) return null;
                    return (
                      <div key={slot} className="flex flex-col gap-1">
                        <div className="text-[10px] uppercase font-bold text-win-text-sec tracking-wider mt-1">{slot.replace('priority-', '')}{slot.startsWith('priority')?'st':''} Run</div>
                        {slotDels.map(d => <DeliveryCard key={d.id} d={d} />)}
                      </div>
                    );
                  })}
                  {dDels.length === 0 && <div className="text-xs text-win-text-sec p-2 text-center">No deliveries</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {addingDelivery && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-win-surface border border-win-border rounded-[8px] w-[520px] max-w-full shadow-lg flex flex-col max-h-[90vh]">
             <div className="px-6 py-4 border-b border-win-border flex justify-between items-center text-lg font-semibold">
               {editingDelId ? 'Edit Delivery' : 'Schedule Delivery'}
               <button onClick={() => setAddingDelivery(false)} className="text-win-text-sec hover:text-win-text text-xl">&times;</button>
             </div>
             <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-xs font-semibold">Customer
                    <input className="win-input" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} placeholder="Customer name" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold">Priority / Slot
                    <select className="win-input" value={formData.slot} onChange={e => setFormData({...formData, slot: e.target.value})}>
                      <option value="priority-1">1st Priority</option>
                      <option value="priority-2">2nd Priority</option>
                      <option value="priority-3">3rd Priority</option>
                      <option value="am">AM Run</option>
                      <option value="pm">PM Run</option>
                    </select>
                  </label>
                </div>
                <label className="flex flex-col gap-1 text-xs font-semibold">Address
                  <input className="win-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Delivery address" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-xs font-semibold">Date
                    <input type="date" className="win-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold">Driver
                    <select className="win-input" value={formData.driver} onChange={e => setFormData({...formData, driver: e.target.value})}>
                      <option value="">-- Unassigned --</option>
                      {users.filter(u => u.role === 'driver' || u.role === 'foreman').map(u => (
                        <option key={u.id} value={`${u.first} ${u.last}`}>{u.first} {u.last}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-xs font-semibold">Hardware Included
                    <select className="win-input" value={formData.hardware} onChange={e => setFormData({...formData, hardware: e.target.value})}>
                      <option value="">No</option>
                      <option value="1 - Yes">1 - Yes</option>
                      <option value="2 - Yes">2 - Yes</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold">Call Customer
                    <select className="win-input" value={formData.call} onChange={e => setFormData({...formData, call: e.target.value})}>
                      <option value="">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </label>
                </div>
                <label className="flex flex-col gap-1 text-xs font-semibold">Comments / Notes
                  <textarea className="win-input h-20 resize-y" value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} placeholder="Special instructions..."></textarea>
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold">Status
                  <select className="win-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="scheduled">Scheduled</option>
                    <option value="onroute">On Route</option>
                    <option value="delivered">Delivered</option>
                    <option value="issue">Issue</option>
                  </select>
                </label>
             </div>
              <div className="px-6 py-4 flex justify-end gap-2 border-t border-win-border bg-[#fbfbfb] rounded-b-[8px]">
               {editingDelId && <button className="win-btn border-[#d13438] text-[#d13438] hover:bg-[#d13438] hover:text-white mr-auto" onClick={handleDelete}>Delete</button>}
               <button className="win-btn win-btn-default" onClick={() => setAddingDelivery(false)}>Cancel</button>
               <button className="win-btn win-btn-primary" onClick={handleSave}>Save Delivery</button>
             </div>
          </div>
        </div>
      )}

      {viewingQr && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setViewingQr(null); }}>
          <div className="bg-win-surface border border-win-border rounded-[8px] w-[320px] shadow-lg flex flex-col items-center">
             <div className="w-full px-4 py-3 border-b border-win-border flex justify-between items-center text-sm font-semibold">
               Mobile Ticket
               <button onClick={() => setViewingQr(null)} className="text-win-text-sec hover:text-win-text"><X className="w-4 h-4" /></button>
             </div>
             <div className="p-6 flex flex-col items-center gap-4 w-full">
               <div className="w-40 h-40 bg-white border border-[#e5e5e5] p-2 rounded shadow-sm flex items-center justify-center relative">
                 {/* Dummy QR Code UI */}
                 <QrCode className="w-24 h-24 text-win-text opacity-80" strokeWidth={1} />
                 <div className="absolute inset-x-0 bottom-2 text-center text-[10px] font-mono text-win-text-sec bg-white/80">TKT-{viewingQr.id || 'NEW'}</div>
               </div>
               <div className="text-center w-full">
                 <div className="font-semibold text-sm truncate">{viewingQr.customer}</div>
                 <div className="text-xs text-win-text-sec truncate w-full text-center">
                   {viewingQr.address && (
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(viewingQr.address)}`} target="_blank" rel="noreferrer" className="hover:underline hover:text-win-accent inline-flex items-center gap-1 justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span className="truncate">{viewingQr.address}</span>
                      </a>
                   )}
                 </div>
                 
                 <div className="mt-4 flex flex-col gap-2">
                   <button 
                     className="w-full win-btn win-btn-primary flex items-center justify-center gap-2"
                     onClick={() => {
                        alert("Camera app opened. Photo geotagged and watermarked at " + new Date().toLocaleString());
                     }}
                   >
                     <Camera className="w-4 h-4" /> Drop Photo
                   </button>
                   <button 
                     className="w-full win-btn win-btn-default flex items-center justify-center gap-2"
                     onClick={() => {
                        alert("Please select a photo.");
                     }}
                   >
                     <Upload className="w-4 h-4" /> Upload
                   </button>
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
