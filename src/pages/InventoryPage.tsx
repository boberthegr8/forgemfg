import { useState } from 'react';
import { Package, Plus } from 'lucide-react';

export function InventoryPage() {
  const [items] = useState([
    { id: 1, sku: 'LMB-2X4-16', name: '2x4 - 16ft SPF', qty: 1200, unit: 'pcs', threshold: 500 },
    { id: 2, sku: 'LMB-2X6-12', name: '2x6 - 12ft SYP', qty: 450, unit: 'pcs', threshold: 300 },
    { id: 3, sku: 'PLT-3X4', name: '3x4 Mending Plates', qty: 5000, unit: 'box', threshold: 1000 }
  ]);

  return (
    <div className="flex flex-col h-full bg-win-bg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <Package className="w-5 h-5 text-win-accent" />
           <span className="text-xl font-semibold">Inventory</span>
        </div>
        <button className="win-btn win-btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex-1">
        <div className="flex bg-[#fafafa] border-b border-win-border text-xs font-semibold text-win-text-sec uppercase tracking-wider">
          <div className="w-32 p-4">SKU</div>
          <div className="flex-[2] p-4">Item Name</div>
          <div className="w-32 p-4 text-right">Quantity</div>
          <div className="w-24 p-4 text-center">Unit</div>
          <div className="w-32 p-4 text-right">Low Threshold</div>
          <div className="w-24 p-4 text-center">Status</div>
        </div>
        <div className="flex flex-col">
          {items.map(item => (
            <div key={item.id} className="flex border-b border-[#f0f0f0] hover:bg-[#fafafa] items-center text-sm transition-colors">
              <div className="w-32 p-4 font-mono text-xs">{item.sku}</div>
              <div className="flex-[2] p-4 font-medium">{item.name}</div>
              <div className="w-32 p-4 text-right font-semibold">{item.qty}</div>
              <div className="w-24 p-4 text-center text-win-text-sec">{item.unit}</div>
              <div className="w-32 p-4 text-right text-win-text-sec">{item.threshold}</div>
              <div className="w-24 p-4 text-center">
                {item.qty <= item.threshold ? (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#fde7e9] text-[#d13438]">Low</span>
                ) : (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#dff6dd] text-[#107c10]">OK</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
