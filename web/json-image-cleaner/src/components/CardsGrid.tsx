'use client';

import { useStore } from '@/store/useStore';
import { CardItem } from './CardItem';

export function CardsGrid() {
  const getFilteredItems = useStore(state => state.getFilteredItems);
  const validationProgress = useStore(state => state.validationProgress);

  const items = getFilteredItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      {validationProgress.total > 0 && validationProgress.current < validationProgress.total && (
        <div className="mb-4 px-4 py-2 bg-teal-50 rounded-lg">
          <div className="flex justify-between text-sm text-teal-700 mb-1">
            <span>Validating images...</span>
            <span>{validationProgress.current} / {validationProgress.total}</span>
          </div>
          <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${(validationProgress.current / validationProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <CardItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
