import { createClient } from '@supabase/supabase-js';

const FORGE_CORE_URL = 'https://uyqanhwurngoupmvzxrh.supabase.co';
const FORGE_CORE_PUBLISHABLE_KEY = 'sb_publishable_SquKrj848EoO9NHZknVkSA_k8CKD7WQ';
const DEFAULT_LOCATION_CODE = 'JK-MAIN';

export const forgeCore = createClient(FORGE_CORE_URL, FORGE_CORE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

export interface MfgContext {
  userId: string;
  email: string;
  organizationId: string;
  organizationName: string;
  role: string;
  locationId?: string;
  locationName?: string;
}

export interface MfgQuoteLine {
  id: string;
  sku?: string;
  description: string;
  quantity: number;
  unit?: string;
  takeoffItemId?: string;
}

export interface MfgQuote {
  id: string;
  quoteNumber: string;
  title: string;
  customerName?: string;
  projectName?: string;
  projectId?: string;
  currentRevision: number;
}

export interface ProductionOperation {
  id: string;
  workOrderId: string;
  sequence: number;
  operationType: string;
  station?: string;
  status: 'queued' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  quantityPlanned: number;
  quantityCompleted: number;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  productType: string;
  status: string;
  priority: number;
  dueDate?: string;
  projectId?: string;
  projectName?: string;
  quoteId?: string;
  quoteNumber?: string;
  createdAt: string;
  itemCount: number;
  totalQuantity: number;
  operations: ProductionOperation[];
}

export interface ManufacturingWorkspace {
  context: MfgContext | null;
  quotes: MfgQuote[];
  workOrders: WorkOrder[];
}

export async function sendMfgMagicLink(email: string) {
  const { error } = await forgeCore.auth.signInWithOtp({
    email: email.trim(),
    options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}${window.location.pathname}` }
  });
  if (error) throw error;
}

export async function signOutMfg() {
  const { error } = await forgeCore.auth.signOut();
  if (error) throw error;
}

async function loadContext(): Promise<MfgContext | null> {
  const { data: userData, error: userError } = await forgeCore.auth.getUser();
  if (userError) throw userError;
  const user = userData.user;
  if (!user) return null;

  const { data: memberships, error: memberError } = await forgeCore
    .from('organization_memberships')
    .select('organization_id,role,status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1);
  if (memberError) throw memberError;
  const membership = memberships?.[0];
  if (!membership) return {
    userId: user.id, email: user.email || '', organizationId: '', organizationName: '', role: 'unassigned'
  };

  const [orgResult, locationResult] = await Promise.all([
    forgeCore.from('organizations').select('id,name').eq('id', membership.organization_id).single(),
    forgeCore.from('locations').select('id,name,code,status').eq('organization_id', membership.organization_id).eq('status', 'active').order('name')
  ]);
  if (orgResult.error) throw orgResult.error;
  if (locationResult.error) throw locationResult.error;
  const locations = locationResult.data || [];
  const location = locations.find((row: any) => row.code === DEFAULT_LOCATION_CODE) || locations[0];

  return {
    userId: user.id,
    email: user.email || '',
    organizationId: membership.organization_id,
    organizationName: orgResult.data?.name || 'Forge Organization',
    role: membership.role,
    locationId: location?.id || undefined,
    locationName: location?.name || undefined
  };
}

export async function loadManufacturingWorkspace(): Promise<ManufacturingWorkspace> {
  const context = await loadContext();
  if (!context?.organizationId) return { context, quotes: [], workOrders: [] };

  const [customersResult, projectsResult, quotesResult, revisionsResult, workOrdersResult, workItemsResult, operationsResult] = await Promise.all([
    forgeCore.from('customers').select('id,display_name').eq('organization_id', context.organizationId),
    forgeCore.from('projects').select('id,name,customer_id').eq('organization_id', context.organizationId),
    forgeCore.from('quotes').select('id,quote_number,title,description,current_revision,project_id,customer_id,status,created_at').eq('organization_id', context.organizationId).order('created_at', { ascending: false }).limit(300),
    forgeCore.from('quote_revisions').select('id,quote_id,revision_number').eq('organization_id', context.organizationId),
    forgeCore.from('work_orders').select('id,work_order_number,title,product_type,status,priority,due_date,project_id,quote_id,created_at').eq('organization_id', context.organizationId).order('created_at', { ascending: false }).limit(300),
    forgeCore.from('work_order_items').select('id,work_order_id,quantity_required').eq('organization_id', context.organizationId),
    forgeCore.from('production_operations').select('id,work_order_id,sequence,operation_type,station,status,quantity_planned,quantity_completed,started_at,completed_at,notes').eq('organization_id', context.organizationId).order('sequence')
  ]);

  for (const result of [customersResult, projectsResult, quotesResult, revisionsResult, workOrdersResult, workItemsResult, operationsResult]) {
    if (result.error) throw result.error;
  }

  const customerMap = new Map<string, string>((customersResult.data || []).map((row: any) => [String(row.id), String(row.display_name || '')]));
  const projectMap = new Map<string, any>((projectsResult.data || []).map((row: any) => [String(row.id), row]));
  const quoteMap = new Map<string, any>((quotesResult.data || []).map((row: any) => [String(row.id), row]));
  const itemsByWorkOrder = new Map<string, any[]>();
  for (const row of workItemsResult.data || []) {
    const list = itemsByWorkOrder.get(String(row.work_order_id)) || [];
    list.push(row); itemsByWorkOrder.set(String(row.work_order_id), list);
  }
  const opsByWorkOrder = new Map<string, ProductionOperation[]>();
  for (const row of operationsResult.data || []) {
    const list = opsByWorkOrder.get(String(row.work_order_id)) || [];
    list.push({
      id: row.id, workOrderId: row.work_order_id, sequence: Number(row.sequence), operationType: row.operation_type,
      station: row.station || undefined, status: row.status, quantityPlanned: Number(row.quantity_planned || 0),
      quantityCompleted: Number(row.quantity_completed || 0), startedAt: row.started_at || undefined,
      completedAt: row.completed_at || undefined, notes: row.notes || undefined
    });
    opsByWorkOrder.set(String(row.work_order_id), list);
  }

  const quotes: MfgQuote[] = (quotesResult.data || []).map((row: any) => {
    const project = row.project_id ? projectMap.get(String(row.project_id)) : undefined;
    const customerId = row.customer_id || project?.customer_id || undefined;
    return {
      id: row.id,
      quoteNumber: row.quote_number,
      title: row.title || row.description || `Quote ${row.quote_number}`,
      customerName: customerId ? customerMap.get(String(customerId)) || undefined : undefined,
      projectName: project?.name || undefined,
      projectId: row.project_id || undefined,
      currentRevision: Number(row.current_revision || 0)
    };
  });

  const workOrders: WorkOrder[] = (workOrdersResult.data || []).map((row: any) => {
    const project = row.project_id ? projectMap.get(String(row.project_id)) : undefined;
    const quote = row.quote_id ? quoteMap.get(String(row.quote_id)) : undefined;
    const items = itemsByWorkOrder.get(String(row.id)) || [];
    return {
      id: row.id,
      workOrderNumber: row.work_order_number,
      title: row.title || row.work_order_number,
      productType: row.product_type,
      status: row.status,
      priority: Number(row.priority || 3),
      dueDate: row.due_date || undefined,
      projectId: row.project_id || undefined,
      projectName: project?.name || undefined,
      quoteId: row.quote_id || undefined,
      quoteNumber: quote?.quote_number || undefined,
      createdAt: row.created_at,
      itemCount: items.length,
      totalQuantity: items.reduce((sum: number, item: any) => sum + Number(item.quantity_required || 0), 0),
      operations: (opsByWorkOrder.get(String(row.id)) || []).sort((a, b) => a.sequence - b.sequence)
    };
  });

  return { context, quotes, workOrders };
}

export async function loadQuoteLines(quote: MfgQuote): Promise<MfgQuoteLine[]> {
  const context = await loadContext();
  if (!context?.organizationId) throw new Error('Connect Forge Core first.');
  const { data: revisions, error: revisionError } = await forgeCore.from('quote_revisions')
    .select('id,revision_number').eq('organization_id', context.organizationId).eq('quote_id', quote.id).eq('revision_number', quote.currentRevision).limit(1);
  if (revisionError) throw revisionError;
  const revision = revisions?.[0];
  if (!revision) throw new Error('Current quote revision not found.');
  const { data, error } = await forgeCore.from('quote_items')
    .select('id,sku,description,quantity,unit,metadata').eq('organization_id', context.organizationId).eq('quote_revision_id', revision.id).order('line_number');
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id, sku: row.sku || undefined, description: row.description,
    quantity: Number(row.quantity || 0), unit: row.unit || undefined,
    takeoffItemId: row.metadata?.takeoff_item_id || undefined
  }));
}

export async function createWorkOrder(input: {
  quoteId: string;
  workOrderNumber: string;
  productType: 'trusses' | 'wall_panels' | 'ewp' | 'stairs' | 'mixed';
  title?: string;
  priority: number;
  dueDate?: string;
  notes?: string;
  quoteItemIds: string[];
}) {
  const context = await loadContext();
  if (!context?.organizationId) throw new Error('Connect Forge Core first.');
  const { data, error } = await forgeCore.rpc('commit_work_order_v1', {
    p_organization_id: context.organizationId,
    p_location_id: context.locationId || null,
    p_quote_id: input.quoteId,
    p_work_order_number: input.workOrderNumber,
    p_product_type: input.productType,
    p_title: input.title || null,
    p_priority: input.priority,
    p_due_date: input.dueDate || null,
    p_notes: input.notes || null,
    p_items: input.quoteItemIds.map(id => ({ quote_item_id: id }))
  });
  if (error) throw error;
  const row = data?.[0];
  if (!row?.work_order_id) throw new Error('Forge Core did not return a work order ID.');
  return row;
}

export async function updateProductionOperation(input: {
  operationId: string;
  status: ProductionOperation['status'];
  station?: string;
  quantityCompleted?: number;
  notes?: string;
}) {
  const { data, error } = await forgeCore.rpc('update_production_operation_v1', {
    p_operation_id: input.operationId,
    p_status: input.status,
    p_station: input.station ?? null,
    p_quantity_completed: input.quantityCompleted ?? null,
    p_notes: input.notes ?? null
  });
  if (error) throw error;
  return data?.[0];
}
