'use client';

import { useStore, TabFilter } from '@/store/useStore';
import { getCardStatus } from '@/lib/utils';

const tabs: { key: TabFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'all_valid', label: 'All Valid' },
  { key: 'any_valid', label: 'Any Valid' },
  { key: 'some_broken', label: 'Some Broken' },
  { key: 'all_broken', label: 'All Broken' },
  { key: 'no_images', label: 'No Images' },
  { key: 'selected', label: 'Selected' },
];

export function TabsBar() {
  const activeTab = useStore(state => state.activeTab);
  const setActiveTab = useStore(state => state.setActiveTab);
  const items = useStore(state => state.items);

  const getCount = (tab: TabFilter): number => {
    if (tab === 'selected') {
      return items.filter(i => i.selected).length;
    }
    if (tab === 'all') {
      return items.length;
    }
    return items.filter(i => getCardStatus(i) === tab).length;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${activeTab === tab.key 
              ? 'bg-teal-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {tab.label}
          <span className="ml-1.5 text-xs opacity-75">({getCount(tab.key)})</span>
        </button>
      ))}
    </div>
  );
}
