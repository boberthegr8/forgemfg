import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { FileText, Plus, Search, Filter, Mail, CheckCircle, XCircle, FileSignature, Edit, Printer } from 'lucide-react';
import { format } from 'date-fns';

export function QuotesPage() {
  const { quotes, contacts, updateQuote, addQuote, currentUser } = useAppStore();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    contactId: '',
    desc: '',
    productType: 'Trusses',
    amount: '',
    items: '',
    expiry: format(new Date(Date.now() + 30 * 864e5), 'yyyy-MM-dd')
  });

  const openEditModal = (q: any) => {
    setEditingQuote(q);
    setFormData({
      contactId: q.contactId.toString(),
      desc: q.desc,
      productType: q.productType,
      amount: q.amount.toString(),
      items: q.items,
      expiry: q.expiry
    });
    setModalOpen(true);
  };

  const handleCreateOrUpdateQuote = () => {
    if (!formData.contactId || !formData.desc || !formData.amount) return;
    const contact = contacts.find(c => c.id === Number(formData.contactId));
    
    if (editingQuote) {
      updateQuote(editingQuote.id, {
        contactId: Number(formData.contactId),
        client: contact ? contact.first + ' ' + contact.last : 'Unknown',
        company: contact ? contact.company : 'Unknown Company',
        desc: formData.desc,
        productType: formData.productType,
        amount: parseFloat(formData.amount),
        items: formData.items,
        expiry: formData.expiry,
      });
    } else {
      addQuote({
        contactId: Number(formData.contactId),
        client: contact ? contact.first + ' ' + contact.last : 'Unknown',
        company: contact ? contact.company : 'Unknown Company',
        desc: formData.desc,
        productType: formData.productType,
        amount: parseFloat(formData.amount),
        items: formData.items,
        notes: '',
        expiry: formData.expiry,
        status: 'draft',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
    }
    setModalOpen(false);
    setEditingQuote(null);
  };

  const getFilteredQuotes = () => {
    let q = quotes;
    if (filter !== 'all') {
      q = q.filter(quote => quote.status === filter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      q = q.filter(quote => 
        quote.client.toLowerCase().includes(lower) || 
        quote.company.toLowerCase().includes(lower) ||
        quote.desc.toLowerCase().includes(lower)
      );
    }
    // Sort by recent
    return q.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredQuotes = getFilteredQuotes();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Draft</span>;
      case 'sent': return <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Sent</span>;
      case 'accepted': return <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Accepted</span>;
      case 'rejected': return <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-win-bg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <FileSignature className="w-5 h-5 text-win-accent" />
           <span className="text-xl font-semibold">Quotes & Proposals</span>
        </div>
        <button className="win-btn win-btn-primary flex items-center gap-2" onClick={() => {
          setEditingQuote(null);
          setFormData({
            contactId: '',
            desc: '',
            productType: 'Trusses',
            amount: '',
            items: '',
            expiry: format(new Date(Date.now() + 30 * 864e5), 'yyyy-MM-dd')
          });
          setModalOpen(true);
        }}>
          <Plus className="w-4 h-4" /> New Quote
        </button>
      </div>

      <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex flex-col flex-1 min-h-[400px]">
        <div className="flex flex-col sm:flex-row p-4 border-b border-win-border gap-4 justify-between bg-[#fbfbfb]">
          <div className="flex gap-2">
            {['all', 'draft', 'sent', 'accepted', 'rejected'].map(f => (
              <button 
                key={f}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors capitalize ${filter === f ? 'bg-win-accent text-white shadow-sm' : 'bg-transparent text-win-text-sec hover:bg-[#e5e5e5] hover:text-win-text'}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-win-text-sec absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search quotes..." 
                className="pl-9 pr-3 py-1.5 text-xs border border-win-border rounded bg-white w-[250px] outline-none focus:border-win-accent focus:ring-1 focus:ring-win-accent transition"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex bg-[#fafafa] border-b border-win-border text-[10px] font-semibold text-win-text-sec uppercase tracking-wider">
          <div className="w-16 p-3">ID</div>
          <div className="flex-1 p-3">Details</div>
          <div className="w-48 p-3">Customer</div>
          <div className="w-32 p-3 text-right">Amount</div>
          <div className="w-32 p-3 text-center">Status</div>
          <div className="w-32 p-3 text-center">Date</div>
          <div className="w-40 p-3 text-right">Actions</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredQuotes.length > 0 ? filteredQuotes.map(q => (
            <div key={q.id} className="flex border-b border-win-border hover:bg-[#fbfbfb] transition text-sm items-center">
              <div className="w-16 p-3 font-mono text-win-text-sec">#{q.id}</div>
              <div className="flex-1 p-3">
                <div className="font-semibold text-win-text truncate">{q.desc}</div>
                <div className="text-xs text-win-text-sec flex items-center gap-2 mt-0.5">
                  <span className="bg-[#e5e5e5] px-1.5 rounded text-[10px] uppercase font-bold">{q.productType}</span>
                </div>
              </div>
              <div className="w-48 p-3">
                <div className="font-medium text-sm truncate">{q.company}</div>
                <div className="text-xs text-win-text-sec truncate">{q.client}</div>
              </div>
              <div className="w-32 p-3 text-right font-mono font-medium text-[#107c10]">
                ${q.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="w-32 p-3 flex justify-center">
                {getStatusBadge(q.status)}
              </div>
              <div className="w-32 p-3 text-center text-xs text-win-text-sec">
                {q.date}
              </div>
              <div className="w-40 p-3 flex justify-end gap-1">
                {q.status === 'draft' && (
                  <>
                    <button className="p-1.5 text-win-text-sec hover:text-[#0078d4] hover:bg-[#e5f1fb] rounded" title="Send Quote" onClick={() => updateQuote(q.id, { status: 'sent', date: format(new Date(), 'yyyy-MM-dd') })}>
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-win-text-sec hover:text-win-text hover:bg-[#e5e5e5] rounded" title="Edit" onClick={() => openEditModal(q)}>
                      <Edit className="w-4 h-4" />
                    </button>
                  </>
                )}
                {q.status === 'sent' && (
                  <>
                    <button className="p-1.5 text-win-text-sec hover:text-[#107c10] hover:bg-[#dff6dd] rounded" title="Mark Accepted" onClick={() => updateQuote(q.id, { status: 'accepted' })}>
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-win-text-sec hover:text-[#d13438] hover:bg-[#fde7e9] rounded" title="Mark Rejected" onClick={() => updateQuote(q.id, { status: 'rejected' })}>
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button className="p-1.5 text-win-text-sec hover:text-win-text hover:bg-[#e5e5e5] rounded" title="Print/PDF">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-win-text-sec">
               <FileText className="w-8 h-8 mx-auto mb-2 text-[#cccccc]" />
               <div>No quotes found.</div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-win-surface border border-win-border rounded-[8px] w-full max-w-lg shadow-lg flex flex-col">
            <div className="px-6 py-4 border-b border-win-border flex justify-between items-center bg-[#fbfbfb] rounded-t-[8px]">
              <div className="font-semibold text-lg flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-win-accent" /> {editingQuote ? 'Edit Quote' : 'New Quote'}
              </div>
              <button onClick={() => { setModalOpen(false); setEditingQuote(null); }} className="text-win-text-sec hover:text-win-text text-xl">&times;</button>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              <label className="flex flex-col gap-1 text-xs font-semibold">Dealer / Contact
                <select className="win-input" value={formData.contactId} onChange={e => setFormData({...formData, contactId: e.target.value})}>
                  <option value="">Select a dealer...</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.company} ({c.first} {c.last})</option>
                  ))}
                </select>
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-xs font-semibold">Product Type
                  <select className="win-input" value={formData.productType} onChange={e => setFormData({...formData, productType: e.target.value})}>
                    <option value="Trusses">Trusses</option>
                    <option value="Wall Panels">Wall Panels</option>
                    <option value="EWP Floor Systems">EWP Floor Systems</option>
                    <option value="Stairs">Stairs</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold">Total Amount ($)
                  <input type="number" step="0.01" className="win-input" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="e.g. 5500.00" />
                </label>
              </div>

              <label className="flex flex-col gap-1 text-xs font-semibold">Project Description
                <input type="text" className="win-input" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="e.g. Lot 45 - 2000 sq ft Bungalow" />
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold">Included Items (Line Items)
                <textarea className="win-input resize-none h-24" value={formData.items} onChange={e => setFormData({...formData, items: e.target.value})} placeholder="List of items included in this quote..." />
              </label>
              
              <label className="flex flex-col gap-1 text-xs font-semibold w-1/2">Expiry Date
                <input type="date" className="win-input" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
              </label>
            </div>
            <div className="px-6 py-4 flex justify-end gap-2 border-t border-win-border bg-[#fbfbfb] rounded-b-[8px]">
              <button className="win-btn win-btn-default" onClick={() => { setModalOpen(false); setEditingQuote(null); }}>Cancel</button>
              <button className="win-btn win-btn-primary" onClick={handleCreateOrUpdateQuote} disabled={!formData.contactId || !formData.desc || !formData.amount}>
                {editingQuote ? 'Save Changes' : 'Create Draft Quote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
