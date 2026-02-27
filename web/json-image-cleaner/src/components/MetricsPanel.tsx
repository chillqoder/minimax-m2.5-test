'use client';

import { useStore, TabFilter } from '@/store/useStore';

export function MetricsPanel() {
  const getMetrics = useStore(state => state.getMetrics);
  const setActiveTab = useStore(state => state.setActiveTab);

  const metrics = getMetrics();

  const metricItems: { label: string; value: number; tab: TabFilter }[] = [
    { label: 'Total Items', value: metrics.total, tab: 'all' },
    { label: 'No Images', value: metrics.noImages, tab: 'no_images' },
    { label: 'Any Valid', value: metrics.anyValid, tab: 'any_valid' },
    { label: 'All Valid', value: metrics.allValid, tab: 'all_valid' },
    { label: 'Some Broken', value: metrics.someBroken, tab: 'some_broken' },
    { label: 'Selected', value: metrics.selected, tab: 'selected' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {metricItems.map(item => (
        <button
          key={item.tab}
          onClick={() => setActiveTab(item.tab)}
          className="bg-white p-3 rounded-lg border border-gray-200 text-left hover:border-teal-300 hover:shadow-sm transition-all"
        >
          <p className="text-xs text-gray-500 mb-1">{item.label}</p>
          <p className="text-xl font-semibold text-gray-800">{item.value}</p>
        </button>
      ))}
    </div>
  );
}
