import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPA_URL = 'https://zumamemyvczdmpswirjt.supabase.co';
const SUPA_KEY = 'sb_publishable_favqe0R1h3-xnSaoNGi-Iw_R8CVAlV6';
export const supabase = createClient(SUPA_URL, SUPA_KEY);
const ORG_ID = 'jk-hardware-001';

const ld = (k: string, d: any) => {
  try { return JSON.parse(localStorage.getItem('forge_' + k) || '') || d; }
  catch { return d; }
};
const sv = (k: string, v: any) => localStorage.setItem('forge_' + k, JSON.stringify(v));

export const initialData = {
  users: [
    { id: 1, first: 'Rob', last: 'Flagg', role: 'admin' },
    { id: 2, first: 'John', last: 'Doe', role: 'sales' },
    { id: 3, first: 'Mike', last: 'Smith', role: 'foreman' },
    { id: 4, first: 'Sarah', last: 'Jones', role: 'designer' },
    { id: 5, first: 'Dave', last: 'Wilson', role: 'driver' },
    { id: 6, first: 'Robert', last: 'Kelly', role: 'engineer' },
    { id: 7, first: 'Client', last: 'Turkstra', role: 'contractor' },
    { id: 8, first: 'Yard', last: 'Manager', role: 'general_manager' },
    { id: 9, first: 'Tim', last: 'Floor', role: 'floor_worker' }
  ],
  contacts: [
    { id: 101, first: 'John', last: 'Turkstra', email: 'j.turkstra@turkstralumber.com', company: 'Turkstra Lumber Dunnville', phone: '905-774-7575', status: 'active', date: '2024-05-15', ts: Date.now() - 864e5 * 300, ownerId: 1 },
    { id: 102, first: 'Mark', last: 'Smith', email: 'mark@turkstrawaterdown.com', company: 'Turkstra Lumber Waterdown', phone: '905-689-6604', status: 'active', date: '2024-06-10', ts: Date.now() - 864e5 * 200, ownerId: 1 },
    { id: 103, first: 'Steve', last: 'Jones', email: 'steve@turkstrasmithville.com', company: 'Turkstra Lumber Smithville', phone: '905-957-3311', status: 'active', date: '2024-08-22', ts: Date.now() - 864e5 * 150, ownerId: 1 },
    { id: 104, first: 'Adam', last: 'Boss', email: 'adam@homebuildingcentre.ca', company: 'Burford Home Hardware', phone: '519-449-2451', status: 'active', date: '2025-01-11', ts: Date.now() - 864e5 * 90, ownerId: 1 },
    { id: 105, first: 'Dave', last: 'L', email: 'dave@brantfordhomehardware.ca', company: 'Brantford Home Hardware', phone: '519-756-3111', status: 'active', date: '2025-02-15', ts: Date.now() - 864e5 * 60, ownerId: 1 },
    { id: 106, first: 'Mike', last: 'M', email: 'mike@parishomehardware.ca', company: 'Paris Home Hardware', phone: '519-442-2244', status: 'active', date: '2025-03-01', ts: Date.now() - 864e5 * 45, ownerId: 1 },
    { id: 107, first: 'Chris', last: 'C', email: 'chris@simcoehomehardware.ca', company: 'Simcoe Home Hardware', phone: '519-426-3820', status: 'active', date: '2025-03-10', ts: Date.now() - 864e5 * 35, ownerId: 1 },
    { id: 108, first: 'Bill', last: 'W', email: 'bill@timbermartcaledonia.ca', company: 'Timber Mart Caledonia', phone: '905-765-4422', status: 'active', date: '2025-03-20', ts: Date.now() - 864e5 * 25, ownerId: 1 },
    { id: 109, first: 'Tom', last: 'H', email: 'tom@timbermarthagersville.ca', company: 'Timber Mart Hagersville', phone: '905-768-3331', status: 'active', date: '2025-04-01', ts: Date.now() - 864e5 * 15, ownerId: 1 },
    { id: 110, first: 'Gary', last: 'G', email: 'gary@timbermartdunnville.ca', company: 'Timber Mart Dunnville', phone: '905-774-7651', status: 'active', date: '2025-04-10', ts: Date.now() - 864e5 * 5, ownerId: 1 },
  ],
  quotes: [
    { id: 201, contactId: 101, client: 'John Turkstra', company: 'Turkstra Lumber Dunnville', desc: 'Custom garage trusses', productType: 'Trusses', amount: 8450.00, items: '12x Common Trusses 6/12 pitch\n2x Gable Ends\nDelivery', notes: '', expiry: '2026-05-30', status: 'draft', date: '2026-04-20', pdfUrl: null, ownerId: 5 },
    { id: 202, contactId: 104, client: 'Adam Boss', company: 'Burford Home Hardware', desc: 'New subdivision Lot 4', productType: 'Wall Panels', amount: 12500.00, items: 'Exterior wall panels for 1500 sq ft bungalow', notes: '', expiry: '2026-06-15', status: 'sent', date: '2026-04-25', pdfUrl: null, ownerId: 6 },
    { id: 203, contactId: 108, client: 'Bill W', company: 'Timber Mart Caledonia', desc: 'Commercial building floor', productType: 'EWP Floor Systems', amount: 24000.00, items: 'TJI floor joists, rim board, LVL beams', notes: '', expiry: '2026-06-01', status: 'accepted', date: '2026-04-18', pdfUrl: null, ownerId: 5, poNumber: 'CAL-88992' },
  ],
  deals: [
    { id: 301, quoteId: 203, client: 'Bill W', company: 'Timber Mart Caledonia', value: 24000.00, productType: 'EWP Floor Systems', poNumber: 'CAL-88992', stage: 'Design/Engineering', date: '2026-04-18', todos: [], timeline: [{ id: 401, name: 'PO Received', date: '2026-04-18', type: 'milestone', done: true }], steps: [], truss: null, ts: Date.now(), ownerId: 5 },
    { id: 302, quoteId: null, client: 'Chris C', company: 'Simcoe Home Hardware', value: 16500.00, productType: 'Mixed', poNumber: 'SIM-11002', stage: 'Production', date: '2026-04-15', todos: [], timeline: [{ id: 402, name: 'PO Received', date: '2026-04-15', type: 'milestone', done: true }, { id: 403, name: 'Engineering Approved', date: '2026-04-22', type: 'milestone', done: true }], steps: [], truss: null, ts: Date.now(), ownerId: 6 },
  ],
  productionItems: [
    { id: 1, name: 'T1 - Scissor Truss - Lot 42', quantity: 12, status: 'cutting', station: 'Saw 1', date: new Date().toISOString().slice(0, 10) },
    { id: 2, name: 'T2 - Common - Lot 42', quantity: 45, status: 'assembly', station: 'Table A', date: new Date().toISOString().slice(0, 10) },
    { id: 3, name: 'Girder G1 - Lot 43', quantity: 2, status: 'queued', station: 'Saw 2', date: new Date(Date.now() + 864e5).toISOString().slice(0, 10) },
    { id: 4, name: 'Jack Trusses - Lot 43', quantity: 24, status: 'completed', station: 'Stacker', date: new Date(Date.now() - 864e5).toISOString().slice(0, 10) }
  ],
  todos: [],
  deliveries: [
    { id: 901, customer: 'Home Hardware Burford', address: 'Savannah Ridge Drive, Brantford', date: new Date().toISOString().slice(0, 10), slot: 'priority-1', driver: 'Driver 1', hardware: '1 - Yes', call: 'Yes', comments: 'Wall Panels', status: 'delivered', ownerId: 1 },
    { id: 902, customer: 'Turkstra Lumber', address: 'Dunnville Yard', date: new Date().toISOString().slice(0, 10), slot: 'priority-2', driver: 'Driver 1', hardware: '', call: '', comments: 'Truss load', status: 'delivered', ownerId: 1 },
  ],
  activity: [],
  notes: [],
  punches: [],
  nid: 1000
};

interface CrmState {
  users: any[];
  currentUserId: number;
  viewFilter: number | 'all';
  contacts: any[];
  quotes: any[];
  deals: any[];
  productionItems: any[];
  todos: any[];
  deliveries: any[];
  activity: any[];
  notes: any[];
  punches: any[];
  nid: number;
}

interface AppContextType extends CrmState {
  setCurrentUserId: (id: number) => void;
  setViewFilter: (filter: number | 'all') => void;
  updateState: (updates: Partial<CrmState>) => void;
  addDelivery: (delivery: any) => void;
  editDelivery: (id: number, data: any) => void;
  deleteDelivery: (id: number) => void;
  addQuote: (quote: any) => void;
  updateQuote: (id: number, data: any) => void;
  deleteQuote: (id: number) => void;
  acceptQuote: (id: number, poNumber: string, deposit?: string) => void;
  addContact: (contact: any) => void;
  addDealToDelivery: (deal: any, deliveryDate: string) => void;
  updateContact: (id: number, data: any) => void;
  addTodo: (todo: any) => void;
  toggleTodo: (id: number) => void;
  clockIn: (userId: number, note?: string) => void;
  clockOut: (userId: number, note?: string) => void;
  currentUser: any;
  userRole: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CrmState>(() => ({
    users: ld('users', initialData.users),
    currentUserId: ld('currentUserId', 1),
    viewFilter: ld('viewFilter', 'all'),
    contacts: ld('contacts', initialData.contacts),
    quotes: ld('quotes', initialData.quotes),
    deals: ld('deals', initialData.deals),
    productionItems: ld('productionItems', initialData.productionItems),
    todos: ld('todos', initialData.todos),
    deliveries: ld('deliveries', initialData.deliveries),
    activity: ld('activity', initialData.activity),
    notes: ld('notes', initialData.notes),
    punches: ld('punches', initialData.punches),
    nid: ld('nid', initialData.nid),
  }));

  const pushToCloud = async (s: CrmState) => {
    try {
      await supabase.from('forge_state').upsert({
        org_id: ORG_ID,
        ...s,
        updated_at: new Date().toISOString()
      }, { onConflict: 'org_id' });
    } catch (e) {
      console.warn('Cloud sync failed:', e);
    }
  };

  const updateState = (updates: Partial<CrmState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      // Save to local storage
      Object.keys(updates).forEach(k => sv(k, next[k as keyof CrmState]));
      pushToCloud(next);
      return next;
    });
  };

  const setCurrentUserId = (id: number) => {
    sv('currentUserId', id);
    setState(s => ({ ...s, currentUserId: id }));
  };

  const setViewFilter = (filter: number | 'all') => {
    sv('viewFilter', filter);
    setState(s => ({ ...s, viewFilter: filter }));
  };

  const currentUser = state.users.find(u => u.id === state.currentUserId) || state.users[0];
  const userRole = currentUser.role;

  // Determine effective owner based on role and viewFilter
  const getOwnerId = () => {
    if (userRole === 'admin' && state.viewFilter !== 'all') {
      return state.viewFilter;
    }
    return currentUser.id;
  };

  const addDelivery = (delivery: any) => {
    updateState({
      deliveries: [...state.deliveries, { ...delivery, id: state.nid + 1 }],
      nid: state.nid + 1
    });
  };

  const editDelivery = (id: number, data: any) => {
    updateState({
      deliveries: state.deliveries.map(d => d.id === id ? { ...d, ...data } : d)
    });
  };

  const deleteDelivery = (id: number) => {
    updateState({
      deliveries: state.deliveries.filter(d => d.id !== id)
    });
  };

  const addQuote = (quote: any) => {
    updateState({
      quotes: [{ ...quote, id: state.nid + 1, ts: Date.now(), ownerId: getOwnerId() }, ...state.quotes],
      nid: state.nid + 1
    });
  };

  const updateQuote = (id: number, data: any) => {
    updateState({
      quotes: state.quotes.map(q => q.id === id ? { ...q, ...data } : q)
    });
  };

  const deleteQuote = (id: number) => {
    updateState({
      quotes: state.quotes.filter(q => q.id !== id)
    });
  };

  const acceptQuote = (id: number, poNumber: string, deposit?: string) => {
    const quote = state.quotes.find(q => q.id === id);
    if (!quote) return;
    
    // Update quote status
    const newQuotes = state.quotes.map(q => q.id === id ? { ...q, status: 'accepted', poNumber, deposit } : q);
    
    // Create new deal
    const newDeal = {
      id: state.nid + 1,
      quoteId: id,
      client: quote.client,
      company: quote.company,
      value: quote.amount,
      productType: quote.productType || 'Trusses',
      poNumber: poNumber,
      deposit: deposit,
      stage: 'PO Received',
      date: new Date().toISOString().slice(0, 10),
      todos: [],
      timeline: [{ id: state.nid + 2, name: 'Quote accepted and PO/Deposit Received', date: new Date().toISOString().slice(0, 10), type: 'milestone', done: true }],
      steps: [],
      truss: null,
      ts: Date.now(),
      ownerId: quote.ownerId || getOwnerId()
    };
    
    updateState({
      quotes: newQuotes,
      deals: [newDeal, ...state.deals],
      nid: state.nid + 2,
      activity: [{ txt: `Quote accepted \u2014 ${quote.client} moved to Pipeline. ${poNumber ? `(PO: ${poNumber})` : ''} ${deposit ? `(Deposit: ${deposit})` : ''}`, ts: Date.now() }, ...state.activity]
    });
  };

  const addContact = (contact: any) => {
    updateState({
      contacts: [{ ...contact, id: state.nid + 1, ts: Date.now(), customFields: {}, ownerId: getOwnerId() }, ...state.contacts],
      nid: state.nid + 1
    });
  };

  const updateContact = (id: number, data: any) => {
    updateState({
      contacts: state.contacts.map(c => c.id === id ? { ...c, ...data } : c)
    });
  };

  const addDealToDelivery = (deal: any, deliveryDate: string) => {
    const newDelivery = {
      id: state.nid + 1,
      customer: deal.client,
      address: '', // Could be filled in by the user
      date: deliveryDate,
      slot: 'am',
      driver: '',
      hardware: '',
      call: '',
      comments: `From deal: ${deal.stage}`,
      status: 'scheduled',
      ownerId: deal.ownerId || getOwnerId()
    };

    updateState({
      deliveries: [...state.deliveries, newDelivery],
      nid: state.nid + 1,
      activity: [{ txt: `Delivery scheduled for ${deal.client}`, ts: Date.now() }, ...state.activity]
    });
  };

  const addTodo = (todo: any) => {
    updateState({
      todos: [{ ...todo, id: state.nid + 1, ts: Date.now(), done: false, ownerId: todo.ownerId || getOwnerId() }, ...state.todos],
      nid: state.nid + 1,
      activity: [{ txt: `Added a task: ${todo.title}`, ts: Date.now() }, ...state.activity]
    });
  };

  const toggleTodo = (id: number) => {
    updateState({
      todos: state.todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    });
  };

  const clockIn = (userId: number, note = '') => {
    updateState({
      punches: [{ id: state.nid + 1, userId, type: 'in', ts: Date.now(), time: new Date().toISOString(), note }, ...state.punches],
      nid: state.nid + 1
    });
  };

  const clockOut = (userId: number, note = '') => {
    updateState({
      punches: [{ id: state.nid + 1, userId, type: 'out', ts: Date.now(), time: new Date().toISOString(), note }, ...state.punches],
      nid: state.nid + 1
    });
  };

  useEffect(() => {
    const pullFromCloud = async () => {
      try {
        const { data, error } = await supabase.from('forge_state').select('*').eq('org_id', ORG_ID).single();
        if (data && !error) {
          const newState = {
            users: data.users || state.users,
            contacts: data.contacts || state.contacts,
            quotes: data.quotes || state.quotes,
            deals: data.deals || state.deals,
            todos: data.todos || state.todos,
            deliveries: data.deliveries || state.deliveries,
            activity: data.activity || state.activity,
            notes: data.notes || state.notes,
            punches: data.punches || state.punches,
            nid: data.nid || state.nid,
          };
          setState(prev => ({ ...prev, ...newState }));
          Object.keys(newState).forEach(k => sv(k, newState[k as keyof typeof newState]));
        }
      } catch (e) {
        console.warn('Cloud pull failed:', e);
      }
    };
    pullFromCloud();
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      setCurrentUserId,
      setViewFilter,
      updateState,
      addDelivery,
      editDelivery,
      deleteDelivery,
      addQuote,
      updateQuote,
      acceptQuote,
      addContact,
      updateContact,
      addDealToDelivery,
      addTodo,
      toggleTodo,
      clockIn,
      clockOut,
      currentUser,
      userRole
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
