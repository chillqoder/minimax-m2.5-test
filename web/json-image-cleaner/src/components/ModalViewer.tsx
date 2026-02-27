'use client';

import { useStore } from '@/store/useStore';

export function ModalViewer() {
  const modalItem = useStore(state => state.modalItem);
  const setModalItem = useStore(state => state.setModalItem);

  if (!modalItem) {
    return null;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(modalItem.original, null, 2));
    alert('Copied to clipboard!');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={() => setModalItem(null)}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">{modalItem.title}</h2>
          <button 
            onClick={() => setModalItem(null)}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <pre className="text-sm font-mono whitespace-pre-wrap break-all">
            {JSON.stringify(modalItem.original, null, 2)}
          </pre>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy to clipboard
          </button>
          <button
            onClick={() => setModalItem(null)}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
