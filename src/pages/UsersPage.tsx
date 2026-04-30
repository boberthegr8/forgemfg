import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Users as UsersIcon, Plus, UserPlus, Shield, User, HardHat, Car, Briefcase, Building, Wrench, PenTool } from 'lucide-react';

export function UsersPage() {
  const { users, currentUser, setCurrentUserId, updateState } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ first: '', last: '', role: 'driver' });

  // Only Admin should normally see this page, we'll assume it's protected by the layout
  const handleAddUser = () => {
    if (!formData.first || !formData.last) return;
    
    // In our simplified store we don't have an autoincrement ID for users directly exposed,
    // so we'll just derive one
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    
    updateState({
      users: [...users, { ...formData, id: newId }]
    });
    
    setModalOpen(false);
    setFormData({ first: '', last: '', role: 'driver' });
  };

  const canAddUser = currentUser?.role === 'admin';

  const getRoleIcon = (role: string) => {
    if (role === 'admin') return <Shield className="w-4 h-4 text-win-accent" />;
    if (role === 'general_manager') return <Building className="w-4 h-4 text-win-accent-hover" />;
    if (role === 'foreman') return <HardHat className="w-4 h-4 text-purple-600" />;
    if (role === 'driver') return <Car className="w-4 h-4 text-green-600" />;
    if (role === 'sales') return <Briefcase className="w-4 h-4 text-blue-500" />;
    if (role === 'designer') return <PenTool className="w-4 h-4 text-indigo-500" />;
    if (role === 'engineer') return <PenTool className="w-4 h-4 text-indigo-400" />;
    if (role === 'floor_worker') return <Wrench className="w-4 h-4 text-orange-500" />;
    return <User className="w-4 h-4 text-win-text-sec" />;
  };

  return (
    <div className="flex flex-col h-full bg-win-bg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <UsersIcon className="w-5 h-5 text-win-accent" />
           <span className="text-xl font-semibold">User Management</span>
        </div>
        {canAddUser && (
          <button className="win-btn win-btn-primary flex items-center gap-2" onClick={() => setModalOpen(true)}>
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        )}
      </div>

      <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex-1">
        <div className="flex bg-[#fafafa] border-b border-win-border text-xs font-semibold text-win-text-sec uppercase tracking-wider">
          <div className="w-64 p-4">User</div>
          <div className="w-48 p-4">Role</div>
          <div className="flex-1 p-4">Permissions Overview</div>
          <div className="w-32 p-4 text-right">Actions</div>
        </div>
        <div className="flex flex-col">
          {users.map(u => (
            <div key={u.id} className="flex items-center border-b border-win-border hover:bg-[#fbfbfb] transition text-sm">
              <div className="w-64 p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded shrink-0 bg-[#e5e5e5] flex items-center justify-center text-xs font-bold text-win-text">
                  {u.first[0]}{u.last[0]}
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                     {u.first} {u.last}
                     {u.id === currentUser.id && <span className="text-[10px] bg-[#e5f1fb] text-win-accent px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">You</span>}
                  </div>
                </div>
              </div>
              <div className="w-48 p-4 flex items-center gap-2">
                {getRoleIcon(u.role)}
                <span className="capitalize">{u.role}</span>
              </div>
              <div className="flex-1 p-4 text-xs text-win-text-sec">
                {u.role === 'admin' && "Full system access. Can modify settings, users, and financials."}
                {u.role === 'general_manager' && "System management and oversight access."}
                {u.role === 'foreman' && "Can manage deliveries, view schedules, and update task statuses."}
                {u.role === 'driver' && "Can view their delivery schedule and mark deliveries as complete."}
                {u.role === 'sales' && "Can manage contacts, quotes, pipeline and view analytics."}
                {u.role === 'designer' && "Can manage engineering, sign offs, seals, and schedule."}
                {u.role === 'floor_worker' && "Can view schedule, dashboard, and tasks."}
              </div>
              <div className="w-32 p-4 flex justify-end">
                <button 
                  className={`text-xs font-semibold px-3 py-1.5 rounded transition ${u.id === currentUser.id ? 'bg-[#f3f3f3] text-win-text-sec cursor-not-allowed' : 'bg-win-accent text-white hover:bg-win-accent-hover'}`}
                  onClick={() => { if (u.id !== currentUser.id) setCurrentUserId(u.id); }}
                  disabled={u.id === currentUser.id}
                >
                  {u.id === currentUser.id ? 'Active' : 'Switch To'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-win-surface border border-win-border rounded-[8px] w-[400px] shadow-lg flex flex-col">
            <div className="px-6 py-4 border-b border-win-border flex justify-between items-center text-lg font-semibold">
              Add New User
              <button onClick={() => setModalOpen(false)} className="text-win-text-sec hover:text-win-text text-xl">&times;</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-xs font-semibold">First Name
                  <input className="win-input" value={formData.first} onChange={e => setFormData({...formData, first: e.target.value})} placeholder="Bob" />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold">Last Name
                  <input className="win-input" value={formData.last} onChange={e => setFormData({...formData, last: e.target.value})} placeholder="Builder" />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs font-semibold">Role
                <select className="win-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="driver">Driver</option>
                  <option value="floor_worker">Floor Worker</option>
                  <option value="foreman">Foreman</option>
                  <option value="sales">Sales</option>
                  <option value="designer">Designer</option>
                  <option value="engineer">Engineer</option>
                  <option value="general_manager">General Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </div>
            <div className="px-6 py-4 flex justify-end gap-2 border-t border-win-border bg-[#fbfbfb] rounded-b-[8px]">
              <button className="win-btn win-btn-default" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="win-btn win-btn-primary" onClick={handleAddUser}>Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
