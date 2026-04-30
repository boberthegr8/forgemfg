import { useState } from 'react';
import { FileText, Download, Upload, Trash2, FileUp } from 'lucide-react';

export function DocumentsList({ title }: { title: string }) {
  const [docs, setDocs] = useState([
    { id: 1, name: 'Architectural_Plans_v2.pdf', size: '4.2 MB', date: '2024-03-15', uploader: 'John Doe' },
    { id: 2, name: 'Site_Measurements.xlsx', size: '156 KB', date: '2024-03-14', uploader: 'Mike Smith' }
  ]);

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button className="win-btn win-btn-default flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>
      
      <div className="bg-win-surface border border-win-border rounded-[4px] shadow-sm flex-1">
        <div className="flex bg-[#fafafa] border-b border-win-border text-xs font-semibold text-win-text-sec uppercase tracking-wider">
          <div className="flex-[2] p-4">File Name</div>
          <div className="flex-1 p-4">Uploaded By</div>
          <div className="flex-1 p-4">Date</div>
          <div className="w-24 p-4">Size</div>
          <div className="w-24 p-4 text-center">Actions</div>
        </div>
        <div className="flex flex-col">
          {docs.length === 0 ? (
            <div className="p-8 text-center text-win-text-sec flex flex-col items-center">
              <FileUp className="w-8 h-8 mb-2 opacity-50" />
              <p>No documents uploaded yet.</p>
            </div>
          ) : (
            docs.map(d => (
              <div key={d.id} className="flex border-b border-[#f0f0f0] hover:bg-[#fafafa] items-center text-sm transition-colors">
                <div className="flex-[2] p-4 flex items-center gap-2 font-medium">
                  <FileText className="w-4 h-4 text-win-accent" />
                  {d.name}
                </div>
                <div className="flex-1 p-4 text-win-text-sec">{d.uploader}</div>
                <div className="flex-1 p-4 text-win-text-sec">{d.date}</div>
                <div className="w-24 p-4 text-win-text-sec text-xs">{d.size}</div>
                <div className="w-24 p-4 flex justify-center gap-3">
                  <button className="text-win-text-sec hover:text-win-accent" title="Download"><Download className="w-4 h-4" /></button>
                  <button className="text-win-text-sec hover:text-[#d13438]" title="Delete" onClick={() => setDocs(docs.filter(x => x.id !== d.id))}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
