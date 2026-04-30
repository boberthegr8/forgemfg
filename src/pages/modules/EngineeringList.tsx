import { useState } from 'react';
import { HardHat, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function EngineeringList({ title }: { title: string }) {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Truss Layout Review for Lot 42', status: 'pending', priority: 'high', assigned: 'Dave W.', dueDate: '2024-03-20' },
    { id: 2, name: 'Beam sizing for open concept', status: 'in_progress', priority: 'medium', assigned: 'Dave W.', dueDate: '2024-03-22' },
    { id: 3, name: 'Standard profile updates', status: 'completed', priority: 'low', assigned: 'Sarah J.', dueDate: '2024-03-10' }
  ]);

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button className="win-btn win-btn-default flex items-center gap-2">
          Request Engineering
        </button>
      </div>
      
      <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex-1">
        <div className="flex flex-col">
          {tasks.map(t => (
            <div key={t.id} className="flex p-4 border-b border-[#f0f0f0] hover:bg-[#fafafa] items-center gap-4 transition-colors">
              <div>
                {t.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-600" /> : 
                 t.status === 'in_progress' ? <Clock className="w-5 h-5 text-blue-600" /> :
                 <AlertCircle className="w-5 h-5 text-orange-500" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-win-text-sec mt-1">Due: {t.dueDate} • Assigned to: {t.assigned}</div>
              </div>
              <div>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  t.priority === 'high' ? 'bg-[#fde7e9] text-[#d13438]' :
                  t.priority === 'medium' ? 'bg-[#fff4ce] text-[#d83b01]' :
                  'bg-[#f3f3f3] text-win-text-sec'
                }`}>
                  {t.priority}
                </span>
              </div>
              <div className="w-32 text-right">
                <select 
                  className="win-input text-xs py-1"
                  value={t.status}
                  onChange={(e) => setTasks(tasks.map(x => x.id === t.id ? { ...x, status: e.target.value } : x))}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
