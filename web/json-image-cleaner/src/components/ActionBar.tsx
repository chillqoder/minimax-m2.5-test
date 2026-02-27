'use client';

import { useStore } from '@/store/useStore';
import { getCardStatus } from '@/lib/utils';
import { format } from 'date-fns';

export function ActionBar() {
  const items = useStore(state => state.items);
  const getFilteredItems = useStore(state => state.getFilteredItems);
  const selectAll = useStore(state => state.selectAll);
  const deselectAll = useStore(state => state.deselectAll);
  const invertSelection = useStore(state => state.invertSelection);
  const rescanImages = useStore(state => state.rescanImages);

  const filteredItems = getFilteredItems();
  const selectedCount = items.filter(i => i.selected).length;

  const handleSelectAllOnTab = () => {
    selectAll(filteredItems.map(i => i.id));
  };

  const handleSelectAnyValid = () => {
    const anyValidIds = items
      .filter(i => {
        const status = getCardStatus(i);
        return status === 'any_valid' || status === 'all_valid';
      })
      .map(i => i.id);
    selectAll(anyValidIds);
  };

  const handleSelectAllValid = () => {
    const allValidIds = items
      .filter(i => getCardStatus(i) === 'all_valid')
      .map(i => i.id);
    selectAll(allValidIds);
  };

  const handleExport = () => {
    const selectedItems = items.filter(i => i.selected);
    const exportData = selectedItems.map(i => i.original);
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `json-image-cleaner-${format(new Date(), 'yyyyMMdd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    const selectedItems = items.filter(i => i.selected);
    const exportData = selectedItems.map(i => i.original);
    
    await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    alert('Copied to clipboard!');
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleSelectAllOnTab}
          disabled={filteredItems.length === 0}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Select all on current tab
        </button>
        <button
          onClick={handleSelectAnyValid}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Select all with any valid
        </button>
        <button
          onClick={handleSelectAllValid}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Select all with only valid
        </button>
        <button
          onClick={deselectAll}
          disabled={selectedCount === 0}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Deselect all
        </button>
        <button
          onClick={invertSelection}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Invert selection
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={handleExport}
          disabled={selectedCount === 0}
          className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download JSON ({selectedCount} selected)
        </button>
        <button
          onClick={handleCopyToClipboard}
          disabled={selectedCount === 0}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy to clipboard
        </button>
        <button
          onClick={() => rescanImages()}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Re-scan images
        </button>
      </div>
    </div>
  );
}
