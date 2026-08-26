import { useEffect, useMemo, useState } from 'react';
import { Boxes, ChevronRight, Factory, LogOut, Plus, RefreshCw, ShieldCheck, Wrench } from 'lucide-react';
import {
  createWorkOrder,
  forgeCore,
  loadManufacturingWorkspace,
  loadQuoteLines,
  sendMfgMagicLink,
  signOutMfg,
  updateProductionOperation,
  type ManufacturingWorkspace,
  type MfgQuoteLine,
  type ProductionOperation,
  type WorkOrder
} from './forgeCore';

const OWNER_EMAIL = 'rob.flagg1234@gmail.com';
const PRODUCT_TYPES = [
  ['trusses', 'Trusses'],
  ['wall_panels', 'Wall Panels'],
  ['ewp', 'EWP'],
  ['stairs', 'Stairs'],
  ['mixed', 'Mixed Products']
] as const;
const OP_STATUSES: ProductionOperation['status'][] = ['queued', 'in_progress', 'completed', 'blocked', 'cancelled'];
const label = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const fmtDate = (value?: string) => value ? new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : '—';

export default function App() {
  const [workspace, setWorkspace] = useState<ManufacturingWorkspace>({ context: null, quotes: [], workOrders: [] });
  const [email, setEmail] = useState(OWNER_EMAIL);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  const [quoteId, setQuoteId] = useState('');
  const [quoteLines, setQuoteLines] = useState<MfgQuoteLine[]>([]);
  const [selectedLines, setSelectedLines] = useState<Record<string, boolean>>({});
  const [workOrderNumber, setWorkOrderNumber] = useState('');
  const [productType, setProductType] = useState<'trusses' | 'wall_panels' | 'ewp' | 'stairs' | 'mixed'>('trusses');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(3);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const refresh = async () => {
    setLoading(true); setError('');
    try {
      const next = await loadManufacturingWorkspace();
      setWorkspace(next);
      if (selectedWorkOrder) setSelectedWorkOrder(next.workOrders.find(item => item.id === selectedWorkOrder.id) || null);
    } catch (err: any) { setError(err?.message || 'Could not load Forge Manufacturing.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    void refresh();
    const { data } = forgeCore.auth.onAuthStateChange(() => window.setTimeout(() => void refresh(), 0));
    unsubscribe = () => data.subscription.unsubscribe();
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    const quote = workspace.quotes.find(item => item.id === quoteId);
    if (!quote) { setQuoteLines([]); setSelectedLines({}); return; }
    setBusy(true); setError('');
    void loadQuoteLines(quote).then(lines => {
      setQuoteLines(lines);
      setSelectedLines(Object.fromEntries(lines.map(line => [line.id, true])));
    }).catch((err: any) => setError(err?.message || 'Could not load quote lines.')).finally(() => setBusy(false));
  }, [quoteId, workspace.quotes]);

  const connected = Boolean(workspace.context?.organizationId);
  const metrics = useMemo(() => ({
    released: workspace.workOrders.filter(item => item.status === 'released').length,
    production: workspace.workOrders.filter(item => item.status === 'in_production').length,
    blocked: workspace.workOrders.filter(item => item.operations.some(op => op.status === 'blocked')).length,
    completed: workspace.workOrders.filter(item => item.status === 'completed').length
  }), [workspace.workOrders]);

  const sendLink = async () => {
    setBusy(true); setError(''); setMessage('');
    try { await sendMfgMagicLink(email); setMessage('Passwordless Forge sign-in link sent. Open it on this device.'); }
    catch (err: any) { setError(err?.message || 'Could not send sign-in link.'); }
    finally { setBusy(false); }
  };

  const doSignOut = async () => {
    setBusy(true);
    try { await signOutMfg(); setWorkspace({ context: null, quotes: [], workOrders: [] }); setSelectedWorkOrder(null); }
    catch (err: any) { setError(err?.message || 'Could not sign out.'); }
    finally { setBusy(false); }
  };

  const saveWorkOrder = async () => {
    const ids = quoteLines.filter(line => selectedLines[line.id]).map(line => line.id);
    if (!quoteId || !workOrderNumber.trim() || !ids.length) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await createWorkOrder({
        quoteId,
        workOrderNumber: workOrderNumber.trim(),
        productType,
        title: title.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        notes: notes || undefined,
        quoteItemIds: ids
      });
      setMessage(`Work order ${workOrderNumber.trim()} released — ${result.item_count} lines / ${result.operation_count} production stages.`);
      setShowNew(false); setQuoteId(''); setQuoteLines([]); setSelectedLines({}); setWorkOrderNumber(''); setTitle(''); setDueDate(''); setNotes(''); setPriority(3);
      await refresh();
    } catch (err: any) { setError(err?.message || 'Could not create work order.'); }
    finally { setBusy(false); }
  };

  const updateOperation = async (workOrder: WorkOrder, op: ProductionOperation, patch: Partial<ProductionOperation>) => {
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await updateProductionOperation({
        operationId: op.id,
        status: patch.status || op.status,
        station: patch.station ?? op.station,
        quantityCompleted: patch.quantityCompleted ?? op.quantityCompleted,
        notes: patch.notes ?? op.notes
      });
      setMessage(`${workOrder.workOrderNumber} — ${op.operationType} updated. Work order: ${label(result?.work_order_status || workOrder.status)}.`);
      await refresh();
    } catch (err: any) { setError(err?.message || 'Could not update production operation.'); }
    finally { setBusy(false); }
  };

  return <div className="mfg-shell">
    <aside className="mfg-sidebar">
      <div className="mfg-brand"><div className="mfg-logo"><Factory size={20} /></div><div><strong>FORGE</strong><span>Manufacturing</span></div></div>
      <div className="mfg-location">{connected ? workspace.context?.locationName || 'Organization-wide' : 'Forge Core'} <span>⌄</span></div>
      <nav>
        <div className="nav-label">Forge Suite</div>
        <a href="https://forge2-navy.vercel.app" className="suite-link"><span>Home</span><ChevronRight size={14} /></a>
        <a href="https://forge-crm-six.vercel.app" className="suite-link"><span>CRM</span><ChevronRight size={14} /></a>
        <a href="https://robquotes.vercel.app" className="suite-link"><span>Reader</span><ChevronRight size={14} /></a>
        <a href="https://forge-scope.vercel.app" className="suite-link"><span>Scope</span><ChevronRight size={14} /></a>
        <a href="https://lumber-estimator-ai.vercel.app" className="suite-link"><span>Quote / AI Quoter</span><ChevronRight size={14} /></a>
        <div className="suite-link active"><span>Manufacturing</span><span className="active-dot" /></div>
        <a href="https://forge-portal-pi.vercel.app" className="suite-link"><span>Portal</span><ChevronRight size={14} /></a>
        <div className="nav-separator" />
        <div className="nav-label">Manufacturing</div>
        <button className="suite-link active"><span>Work Orders</span><span className="active-dot" /></button>
        <button className="suite-link"><span>Shop Floor</span><Boxes size={14} /></button>
      </nav>
      <div className="core-card"><div><ShieldCheck size={15} /><strong>Forge Core</strong></div><span>{connected ? workspace.context?.organizationName : 'Not connected'}</span><small>{connected ? workspace.context?.role : 'Passwordless POC'}</small></div>
    </aside>

    <main className="mfg-main">
      <header className="mfg-header"><div><span className="eyebrow">Forge Manufacturing</span><h1>Work Orders & Production</h1><p>Quote lineage → released work → shop-floor operations.</p></div><div className="header-actions">{connected && <button className="secondary-btn" onClick={() => void refresh()} disabled={loading || busy}><RefreshCw size={15} className={loading ? 'spin' : ''} />Refresh</button>}{connected && <button className="secondary-btn" onClick={() => void doSignOut()} disabled={busy}><LogOut size={15} />Sign out</button>}</div></header>

      <div className="mfg-content">
        {error && <div className="alert danger">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        {!connected ? <section className="sign-in-card"><div className="icon-card"><ShieldCheck size={26} /></div><h2>Connect Manufacturing to Forge Core</h2><p>This module no longer uses the old Forge Portal database or whole-app state blobs.</p><label><span>Forge owner email</span><input value={email} onChange={event => setEmail(event.target.value)} type="email" /></label><button className="primary-btn full" onClick={() => void sendLink()} disabled={busy || !email.trim()}>Send passwordless sign-in link</button></section> : <>
          <section className="metrics-grid">{[['Released',metrics.released],['In Production',metrics.production],['Blocked',metrics.blocked],['Completed',metrics.completed]].map(([name,value]) => <div className="metric" key={String(name)}><span>{name}</span><strong>{value}</strong></div>)}</section>

          <section className="toolbar"><div><span className="eyebrow">Production control</span><h2>Manufacturing work orders</h2></div><button className="primary-btn" onClick={() => setShowNew(true)}><Plus size={16} />New Work Order</button></section>

          <section className="wo-grid">
            <div className="wo-list">{workspace.workOrders.map(order => <button className={`wo-row ${selectedWorkOrder?.id === order.id ? 'selected' : ''}`} key={order.id} onClick={() => setSelectedWorkOrder(order)}><div className="wo-row-top"><strong>{order.workOrderNumber}</strong><span className={`status ${order.status}`}>{label(order.status)}</span></div><h3>{order.title}</h3><div className="wo-meta"><span>{label(order.productType)}</span><span>{order.projectName || order.quoteNumber || 'No project'}</span><span>Due {fmtDate(order.dueDate)}</span></div><div className="progress"><div style={{ width: `${order.operations.length ? Math.round(order.operations.filter(op => op.status === 'completed').length / order.operations.length * 100) : 0}%` }} /></div><small>{order.itemCount} quote lines • {order.totalQuantity} total qty • Priority {order.priority}</small></button>)}{!workspace.workOrders.length && <div className="empty"><Factory size={36} /><strong>No Core work orders yet</strong><span>Release one from a priced quote to start production.</span></div>}</div>

            <div className="operations-panel">{selectedWorkOrder ? <><div className="panel-heading"><div><span className="eyebrow">Shop route</span><h2>{selectedWorkOrder.workOrderNumber}</h2><p>{selectedWorkOrder.title} • {label(selectedWorkOrder.productType)}</p></div><span className={`status ${selectedWorkOrder.status}`}>{label(selectedWorkOrder.status)}</span></div><div className="operation-stack">{selectedWorkOrder.operations.map(op => <OperationRow key={op.id} op={op} busy={busy} onSave={patch => void updateOperation(selectedWorkOrder, op, patch)} />)}</div></> : <div className="empty tall"><Wrench size={36} /><strong>Select a work order</strong><span>Production operations and stations will appear here.</span></div>}</div>
          </section>
        </>}
      </div>
    </main>

    {showNew && <NewWorkOrderModal quotes={workspace.quotes} quoteId={quoteId} setQuoteId={setQuoteId} quoteLines={quoteLines} selectedLines={selectedLines} setSelectedLines={setSelectedLines} workOrderNumber={workOrderNumber} setWorkOrderNumber={setWorkOrderNumber} productType={productType} setProductType={setProductType} title={title} setTitle={setTitle} priority={priority} setPriority={setPriority} dueDate={dueDate} setDueDate={setDueDate} notes={notes} setNotes={setNotes} busy={busy} onClose={() => setShowNew(false)} onSave={() => void saveWorkOrder()} />}
  </div>;
}

function OperationRow({ op, busy, onSave }: { op: ProductionOperation; busy: boolean; onSave: (patch: Partial<ProductionOperation>) => void }) {
  const [station, setStation] = useState(op.station || '');
  const [qty, setQty] = useState(op.quantityCompleted);
  useEffect(() => { setStation(op.station || ''); setQty(op.quantityCompleted); }, [op.id, op.station, op.quantityCompleted]);
  return <div className="operation-row"><div className="op-seq">{op.sequence}</div><div className="op-main"><strong>{op.operationType}</strong><span>{op.quantityCompleted} / {op.quantityPlanned} complete</span></div><input className="compact-input" value={station} onChange={event => setStation(event.target.value)} placeholder="Station" /><input className="qty-input" type="number" min="0" max={op.quantityPlanned} value={qty} onChange={event => setQty(Number(event.target.value))} /><select className="compact-input" value={op.status} onChange={event => onSave({ status: event.target.value as ProductionOperation['status'], station, quantityCompleted: Number(qty) })} disabled={busy}>{OP_STATUSES.map(status => <option key={status} value={status}>{label(status)}</option>)}</select><button className="save-link" disabled={busy} onClick={() => onSave({ station, quantityCompleted: Number(qty) })}>Save</button></div>;
}

function NewWorkOrderModal(props: any) {
  const selectedCount = props.quoteLines.filter((line: MfgQuoteLine) => props.selectedLines[line.id]).length;
  return <div className="modal-backdrop"><div className="modal"><div className="modal-heading"><div><span className="eyebrow">Release to production</span><h2>New Work Order</h2></div><button className="secondary-btn" onClick={props.onClose}>Close</button></div><div className="form-grid"><label><span>Quote</span><select value={props.quoteId} onChange={(event: any) => props.setQuoteId(event.target.value)}><option value="">Select Core quote…</option>{props.quotes.map((quote: any) => <option key={quote.id} value={quote.id}>{quote.quoteNumber} — {quote.customerName || quote.projectName || quote.title}</option>)}</select></label><label><span>Work order #</span><input value={props.workOrderNumber} onChange={(event: any) => props.setWorkOrderNumber(event.target.value)} placeholder="WO-2026-001" /></label><label><span>Product</span><select value={props.productType} onChange={(event: any) => props.setProductType(event.target.value)}>{PRODUCT_TYPES.map(([value,name]) => <option value={value} key={value}>{name}</option>)}</select></label><label><span>Priority</span><select value={props.priority} onChange={(event: any) => props.setPriority(Number(event.target.value))}>{[1,2,3,4,5].map(value => <option key={value} value={value}>{value}{value === 1 ? ' — Highest' : value === 5 ? ' — Lowest' : ''}</option>)}</select></label><label><span>Title</span><input value={props.title} onChange={(event: any) => props.setTitle(event.target.value)} placeholder="Job / production title" /></label><label><span>Due date</span><input type="date" value={props.dueDate} onChange={(event: any) => props.setDueDate(event.target.value)} /></label><label className="full-span"><span>Notes</span><textarea value={props.notes} onChange={(event: any) => props.setNotes(event.target.value)} /></label></div>{props.quoteLines.length > 0 && <div className="line-picker"><div className="line-picker-head"><strong>Manufactured quote lines</strong><span>{selectedCount} selected</span></div>{props.quoteLines.map((line: MfgQuoteLine) => <label className="line-item" key={line.id}><input type="checkbox" checked={Boolean(props.selectedLines[line.id])} onChange={event => props.setSelectedLines((old: any) => ({ ...old, [line.id]: event.target.checked }))} /><div><strong>{line.description}</strong><span>{line.sku || 'No SKU'} • {line.quantity} {line.unit || 'units'}</span></div></label>)}</div>}<div className="modal-actions"><button className="secondary-btn" onClick={props.onClose}>Cancel</button><button className="primary-btn" onClick={props.onSave} disabled={props.busy || !props.quoteId || !props.workOrderNumber.trim() || selectedCount < 1}>{props.busy ? 'Releasing…' : 'Release Work Order'}</button></div></div></div>;
}
