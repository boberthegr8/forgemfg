import { useState } from 'react';
import { QuotesPage } from './QuotesPage';
import { DocumentsList } from './modules/DocumentsList';
import { EngineeringList } from './modules/EngineeringList';
import { ProductionList } from './modules/ProductionList';

export function ProductCategoryPage({ title, productType }: { title: string, productType: string }) {
  const [activeTab, setActiveTab] = useState('quotes');

  const tabs = [
    { id: 'quotes', label: 'Quotes' },
    { id: 'documents', label: 'Documents' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'production', label: 'Production Status' }
  ];

  return (
    <div className="flex flex-col h-full bg-win-bg">
      {/* Header & Tabs */}
      <div className="flex-none px-6 pt-6 pb-0 border-b border-win-border bg-white">
        <h1 className="text-xl font-semibold mb-4">{title}</h1>
        <div className="flex gap-6">
          {tabs.map(t => (
             <button 
               key={t.id}
               className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                 activeTab === t.id 
                   ? 'border-win-accent text-win-accent' 
                   : 'border-transparent text-win-text-sec hover:text-win-text hover:border-gray-300'
               }`}
               onClick={() => setActiveTab(t.id)}
             >
               {t.label}
             </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
         {activeTab === 'quotes' && <QuotesPage title={`${title} Quotes`} productFilter={productType} hideHeader={true} />}
         {activeTab === 'documents' && <DocumentsList title={`${title} Documents`} />}
         {activeTab === 'engineering' && <EngineeringList title={`${title} Engineering`} />}
         {activeTab === 'production' && <ProductionList title={`${title} Production`} />}
      </div>
    </div>
  );
}
