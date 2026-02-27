'use client';

import { useStore } from '@/store/useStore';
import { UploadPanel, CardsGrid, TabsBar, MetricsPanel, ActionBar, ModalViewer } from '@/components';

export default function Home() {
  const items = useStore(state => state.items);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-800">JSON Image Cleaner</h1>
          <p className="text-sm text-gray-500 mt-1">Upload a JSON file to detect and validate image URLs</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {items.length === 0 ? (
          <UploadPanel />
        ) : (
          <>
            <TabsBar />
            <MetricsPanel />
            <ActionBar />
            <CardsGrid />
          </>
        )}
      </main>

      <ModalViewer />
    </div>
  );
}
