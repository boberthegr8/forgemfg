import { useState } from 'react';
import { FileUp, Plus, FileDown } from 'lucide-react';

export function POsPage() {
  const [pos] = useState([
    { id: '1042', vendor: 'ABC Lumber Co', date: '2024-03-18', amount: 15400.00, status: 'approved' },
    { id: '1043', vendor: 'Simpson Strong-Tie', date: '2024-03-19', amount: 2350.50, status: 'pending' },
    { id: '1044', vendor: 'US Lumber', date: '2024-03-20', amount: 8900.00, status: 'draft' }
  ]);
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      alert("Purchase Orders successfully exported. QuickBooks sync will begin in the background.");
      setExporting(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-win-bg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <FileUp className="w-5 h-5 text-win-accent" />
           <span className="text-xl font-semibold">Purchase Orders</span>
        </div>
        <div className="flex gap-2">
          <button 
            className="win-btn win-btn-default flex items-center gap-2"
            onClick={handleExport}
            disabled={exporting}
          >
            <FileDown className="w-4 h-4" /> {exporting ? 'Exporting...' : 'Export to QuickBooks'}
          </button>
          <button className="win-btn win-btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create PO
          </button>
        </div>
      </div>

      <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex-1">
        <div className="flex bg-[#fafafa] border-b border-win-border text-xs font-semibold text-win-text-sec uppercase tracking-wider">
          <div className="w-24 p-4">PO #</div>
          <div className="flex-[2] p-4">Vendor</div>
          <div className="flex-1 p-4">Issue Date</div>
          <div className="w-32 p-4 text-right">Amount</div>
          <div className="w-32 p-4 text-center">Status</div>
        </div>
        <div className="flex flex-col">
          {pos.map(po => (
            <div key={po.id} className="flex border-b border-[#f0f0f0] hover:bg-[#fafafa] items-center text-sm transition-colors">
              <div className="w-24 p-4 font-mono font-semibold">PO-{po.id}</div>
              <div className="flex-[2] p-4 font-medium">{po.vendor}</div>
              <div className="flex-1 p-4 text-win-text-sec">{po.date}</div>
              <div className="w-32 p-4 text-right font-semibold">${po.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className="w-32 p-4 flex justify-center">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  po.status === 'approved' ? 'bg-[#dff6dd] text-[#107c10]' :
                  po.status === 'draft' ? 'bg-[#f3f3f3] text-win-text-sec' :
                  'bg-[#fff4ce] text-[#d83b01]'
                }`}>
                  {po.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
