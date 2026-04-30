import { useAppStore } from '../lib/store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { contacts, quotes, deals, todos, deliveries, currentUser, userRole, viewFilter, toggleTodo, users } = useAppStore();

  const effectiveUserId = userRole === 'admin' ? viewFilter : currentUser.id;
  
  const scopedContacts = effectiveUserId === 'all' ? contacts : contacts.filter(c => (c.ownerId || 1) === effectiveUserId);
  const scopedQuotes = effectiveUserId === 'all' ? quotes : quotes.filter(q => (q.ownerId || 1) === effectiveUserId);
  const scopedDeals = effectiveUserId === 'all' ? deals : deals.filter(d => (d.ownerId || 1) === effectiveUserId);
  const scopedTodos = effectiveUserId === 'all' ? todos : todos.filter(t => (t.ownerId || 1) === effectiveUserId);

  const scopedDeliveries = effectiveUserId === 'all' ? deliveries : deliveries.filter(d => (d.ownerId || 1) === effectiveUserId);

  const totalQuoted = scopedQuotes.reduce((acc, q) => acc + (q.amount || 0), 0);
  const totalPipeline = scopedDeals.reduce((acc, d) => acc + (d.value || 0), 0);
  const activeTodos = scopedTodos.filter(t => !t.done).length;

  const fmt = (n: number) => '$' + Number(n).toLocaleString();

  // Create simple chart data from deals by stage
  const pipelineData = ['PO Received', 'Design/Engineering', 'Pending Sign Off', 'Production', 'Ready to Ship'].map(stage => ({
    name: stage.split('/')[0], // Shorten names for the XAxis
    value: scopedDeals.filter(d => d.stage === stage).reduce((sum, d) => sum + (d.value || 0), 0)
  }));

  return (
    <div className="p-6 overflow-y-auto h-full flex flex-col gap-6">
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Dealers', val: scopedContacts.length, sub: 'Total in system', color: 'bg-win-accent' },
          { label: 'Open Quotes', val: scopedQuotes.length, sub: 'Pending response', color: 'bg-[#107c10]' },
          { label: 'Total Quoted', val: fmt(totalQuoted), sub: 'All quotes combined', color: 'bg-[#d83b01]' },
          { label: 'Pipeline Value', val: fmt(totalPipeline), sub: 'Active deals', color: 'bg-[#00bcf2]' },
          { label: 'Open Tasks', val: activeTodos, sub: 'Need action', color: 'bg-[#5c2d91]' }
        ].map((s, i) => (
          <div key={i} className="bg-win-surface border border-win-border rounded-[4px] p-5 relative overflow-hidden shadow-sm">
            <div className="text-[11px] uppercase tracking-wider text-win-text-sec font-semibold mb-2">{s.label}</div>
            <div className="text-3xl font-semibold text-win-text mb-1">{s.val}</div>
            <div className="text-xs text-win-text-sec">{s.sub}</div>
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10 ${s.color}`}></div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 bg-win-surface border border-win-border rounded-[4px] p-5 shadow-sm">
          <div className="text-sm font-semibold mb-4 text-win-text">Pipeline Value by Stage</div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#605e5c' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value: number) => fmt(value)} 
                  contentStyle={{ borderRadius: '4px', border: '1px solid #e5e5e5', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#00bcf2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-win-surface border border-win-border rounded-[4px] p-5 shadow-sm">
          <div className="text-sm font-semibold mb-4 text-win-text">{"Today's Deliveries"}</div>
          <div className="flex flex-col gap-3">
            {scopedDeliveries.slice(0, 5).map(d => (
              <div key={d.id} className="flex gap-3 text-sm pb-3 border-b border-win-border last:border-0 last:pb-0">
                <div className="flex-1">
                  <div className="font-medium">{d.customer}</div>
                  <div className="text-xs text-win-text-sec text-ellipsis overflow-hidden">
                    {d.address ? (
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(d.address)}`} target="_blank" rel="noreferrer" className="hover:underline hover:text-win-accent inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {d.address}
                      </a>
                    ) : 'No address'}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] bg-[#e5f1fb] text-win-accent px-2 py-[2px] rounded uppercase font-semibold">{d.slot}</span>
                </div>
              </div>
            ))}
            {scopedDeliveries.length === 0 && <div className="text-xs text-win-text-sec">No deliveries today</div>}
          </div>
        </div>

        <div className="bg-win-surface border border-win-border rounded-[4px] p-5 shadow-sm">
          <div className="text-sm font-semibold mb-4 text-win-text">Recent Quotes</div>
          <div className="flex flex-col gap-3 text-sm">
             {scopedQuotes.slice(0, 5).map(q => (
               <div key={q.id} className="flex justify-between border-b border-win-border pb-3 last:border-0 last:pb-0">
                 <div>
                    <div className="font-medium">{q.client}</div>
                    <div className="text-xs text-win-text-sec">{q.company}</div>
                 </div>
                 <div className="text-right">
                    <div className="font-semibold">{fmt(q.amount)}</div>
                    <div className="text-[10px] text-[#107c10] uppercase">{q.status}</div>
                 </div>
               </div>
             ))}
             {scopedQuotes.length === 0 && <div className="text-xs text-win-text-sec">No quotes yet</div>}
          </div>
        </div>

        <div className="bg-win-surface border border-win-border rounded-[4px] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-win-text">To-Do List</div>
          </div>
          <div className="flex flex-col gap-2">
            {scopedTodos.filter((t: any) => !t.done).slice(0, 5).map((t: any) => {
              const owner = users.find(u => u.id === (t.ownerId || 1));
              return (
              <div key={t.id} className="flex items-center gap-3 p-2 bg-[#fafafa] border border-win-border rounded text-sm hover:border-win-accent transition cursor-pointer" onClick={() => toggleTodo(t.id)}>
                <div className="w-4 h-4 border border-win-text-sec rounded-sm shrink-0 flex items-center justify-center">
                   {/* Empty */}
                </div>
                <div className="flex flex-col flex-1 truncate">
                   <span className="truncate text-xs font-medium">{t.title}</span>
                   {userRole === 'admin' && owner && <span className="text-[10px] text-win-text-sec">{owner.first} {owner.last}</span>}
                </div>
              </div>
            )})}
            {scopedTodos.filter((t: any) => !t.done).length === 0 && <div className="text-xs text-win-text-sec">All caught up!</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
