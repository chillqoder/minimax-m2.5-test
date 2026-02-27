'use client';

import { useState } from 'react';
import { JsonItem, getCardStatus } from '@/lib/utils';
import { useStore } from '@/store/useStore';

interface CardItemProps {
  item: JsonItem;
}

const statusColors: Record<string, string> = {
  all_valid: 'bg-green-100 text-green-700',
  any_valid: 'bg-teal-100 text-teal-700',
  some_broken: 'bg-yellow-100 text-yellow-700',
  all_broken: 'bg-red-100 text-red-700',
  no_images: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
  all_valid: 'All Valid',
  any_valid: 'Any Valid',
  some_broken: 'Some Broken',
  all_broken: 'All Broken',
  no_images: 'No Images',
};

export function CardItem({ item }: CardItemProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const toggleSelection = useStore(state => state.toggleSelection);
  const setModalItem = useStore(state => state.setModalItem);

  const status = getCardStatus(item);
  const validCount = item.imageCandidates.filter(img => img.status === 'valid').length;
  const brokenCount = item.imageCandidates.filter(img => img.status === 'broken' || img.status === 'timeout').length;
  const totalImages = item.imageCandidates.length;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[280px]">
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => toggleSelection(item.id)}
              className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="font-medium text-gray-800 truncate" title={item.title}>
              {item.title}
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>

        <div className="flex-1 overflow-hidden p-3">
          <div className="flex gap-2 h-full overflow-x-auto pb-2">
            {item.imageCandidates.slice(0, 4).map((img, idx) => (
              <div 
                key={idx} 
                className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
                onClick={() => setSelectedImage(idx)}
              >
                {img.status === 'loading' ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : img.status === 'valid' ? (
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                <div className="absolute bottom-1 right-1">
                  {img.status === 'valid' ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : img.status === 'broken' || img.status === 'timeout' ? (
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {item.imageCandidates.length > 4 && (
              <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center shrink-0 text-sm text-gray-500">
                +{item.imageCandidates.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="px-3 pb-2">
          <div className="text-xs text-gray-500 flex gap-3">
            <span>{totalImages} image{totalImages !== 1 ? 's' : ''}</span>
            {validCount > 0 && <span className="text-green-600">{validCount} valid</span>}
            {brokenCount > 0 && <span className="text-red-600">{brokenCount} broken</span>}
          </div>
        </div>

        <div className="px-3 pb-3 flex gap-2 mt-auto">
          <button
            onClick={() => setModalItem(item)}
            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
          >
            View Full JSON
          </button>
        </div>
      </div>

      {selectedImage !== null && item.imageCandidates[selectedImage] && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Image {selectedImage + 1} of {item.imageCandidates.length}</h3>
              <button onClick={() => setSelectedImage(null)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {item.imageCandidates[selectedImage].status === 'valid' ? (
              <img
                src={item.imageCandidates[selectedImage].url}
                alt=""
                className="max-w-full max-h-[70vh] object-contain"
              />
            ) : (
              <div className="w-96 h-96 bg-red-50 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-red-600">Failed to load image</p>
                </div>
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500 break-all">{item.imageCandidates[selectedImage].url}</p>
          </div>
        </div>
      )}
    </>
  );
}
