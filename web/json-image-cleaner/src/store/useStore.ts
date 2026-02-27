import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  JsonItem, 
  ImageStatus, 
  findAllStrings, 
  isLikelyImageUrl, 
  validateImage, 
  getCardStatus, 
  getDisplayTitle,
  parseJsonInput 
} from '@/lib/utils';

export type TabFilter = 'all' | 'all_valid' | 'any_valid' | 'some_broken' | 'all_broken' | 'no_images' | 'selected';

interface StoreState {
  items: JsonItem[];
  activeTab: TabFilter;
  isLoading: boolean;
  validationProgress: { current: number; total: number };
  urlCache: Map<string, ImageStatus>;
  modalItem: JsonItem | null;
  
  setItems: (items: JsonItem[]) => void;
  setActiveTab: (tab: TabFilter) => void;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
  invertSelection: () => void;
  updateItemImageStatus: (id: string, index: number, status: ImageStatus) => void;
  setValidationProgress: (current: number, total: number) => void;
  setModalItem: (item: JsonItem | null) => void;
  loadJsonFromFile: (file: File) => Promise<void>;
  rescanImages: () => Promise<void>;
  getFilteredItems: () => JsonItem[];
  getMetrics: () => Record<string, number>;
}

const CONCURRENT_LIMIT = 8;

async function validateImagesWithConcurrency(
  items: JsonItem[],
  updateProgress: (current: number, total: number) => void,
  urlCache: Map<string, ImageStatus>,
  setItems: (items: JsonItem[]) => void
): Promise<void> {
  const allUrls: { itemId: string; index: number; url: string }[] = [];
  
  items.forEach(item => {
    item.imageCandidates.forEach((img, idx) => {
      if (!urlCache.has(img.url)) {
        allUrls.push({ itemId: item.id, index: idx, url: img.url });
      } else {
        img.status = urlCache.get(img.url)!;
      }
    });
  });

  const total = allUrls.length;
  let completed = 0;
  let index = 0;

  async function processQueue() {
    while (index < allUrls.length) {
      const batch = allUrls.slice(index, index + CONCURRENT_LIMIT);
      index += CONCURRENT_LIMIT;

      await Promise.all(
        batch.map(async ({ itemId, index: imgIndex, url }) => {
          let status: ImageStatus;
          
          if (urlCache.has(url)) {
            status = urlCache.get(url)!;
          } else {
            status = await validateImage(url);
            urlCache.set(url, status);
          }
          
          const item = items.find(i => i.id === itemId);
          if (item) {
            item.imageCandidates[imgIndex].status = status;
          }
          
          completed++;
          updateProgress(completed, total);
        })
      );
      
      setItems([...items]);
    }
  }

  await processQueue();
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      activeTab: 'all',
      isLoading: false,
      validationProgress: { current: 0, total: 0 },
      urlCache: new Map<string, ImageStatus>(),
      modalItem: null,

      setItems: (items) => set({ items }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      toggleSelection: (id) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, selected: !item.selected } : item
        )
      })),

      selectAll: (ids) => set((state) => ({
        items: state.items.map(item =>
          ids.includes(item.id) ? { ...item, selected: true } : item
        )
      })),

      deselectAll: () => set((state) => ({
        items: state.items.map(item => ({ ...item, selected: false }))
      })),

      invertSelection: () => set((state) => ({
        items: state.items.map(item => ({ ...item, selected: !item.selected }))
      })),

      updateItemImageStatus: (id, index, status) => set((state) => ({
        items: state.items.map(item => {
          if (item.id !== id) return item;
          const newCandidates = [...item.imageCandidates];
          newCandidates[index] = { ...newCandidates[index], status };
          return { ...item, imageCandidates: newCandidates };
        })
      })),

      setValidationProgress: (current, total) => set({
        validationProgress: { current, total }
      }),

      setModalItem: (item) => set({ modalItem: item }),

      loadJsonFromFile: async (file) => {
        const { urlCache } = get();
        urlCache.clear();
        
        set({ isLoading: true, items: [], validationProgress: { current: 0, total: 0 } });
        
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          const arrayData = parseJsonInput(data);
          
          const items: JsonItem[] = arrayData.map((item, idx) => {
            const strings = findAllStrings(item);
            const urls = strings
              .map(s => s.value)
              .filter(isLikelyImageUrl);
            
            const uniqueUrls = [...new Set(urls)];
            
            return {
              id: `item-${idx}`,
              index: idx,
              original: item,
              title: getDisplayTitle(item) || `#${idx}`,
              imageCandidates: uniqueUrls.map(url => ({ url, status: 'loading' as ImageStatus })),
              selected: false
            };
          });

          const totalImages = items.reduce((acc, item) => acc + item.imageCandidates.length, 0);
          set({ items, validationProgress: { current: 0, total: totalImages } });

          await validateImagesWithConcurrency(
            items,
            (current, total) => get().setValidationProgress(current, total),
            urlCache,
            (newItems) => set({ items: newItems })
          );

          set({ 
            items: [...items],
            isLoading: false,
            validationProgress: { current: totalImages, total: totalImages }
          });

        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      rescanImages: async () => {
        const { items, urlCache, setValidationProgress, setItems } = get();
        
        urlCache.clear();
        
        items.forEach(item => {
          item.imageCandidates.forEach(img => {
            img.status = 'loading';
          });
        });

        set({ items: [...items] });

        await validateImagesWithConcurrency(
          items,
          setValidationProgress,
          urlCache,
          (newItems) => set({ items: newItems })
        );
      },

      getFilteredItems: () => {
        const { items, activeTab } = get();
        
        if (activeTab === 'selected') {
          return items.filter(item => item.selected);
        }

        return items.filter(item => {
          const status = getCardStatus(item);
          return status === activeTab || activeTab === 'all';
        });
      },

      getMetrics: () => {
        const { items } = get();
        
        const total = items.length;
        const noImages = items.filter(i => getCardStatus(i) === 'no_images').length;
        const anyValid = items.filter(i => {
          const status = getCardStatus(i);
          return status === 'any_valid' || status === 'all_valid';
        }).length;
        const allValid = items.filter(i => getCardStatus(i) === 'all_valid').length;
        const someBroken = items.filter(i => {
          const status = getCardStatus(i);
          return status === 'some_broken' || status === 'all_broken';
        }).length;
        const selected = items.filter(i => i.selected).length;

        return { total, noImages, anyValid, allValid, someBroken, selected };
      }
    }),
    {
      name: 'json-image-cleaner-storage',
      partialize: (state) => ({ urlCache: Array.from(state.urlCache.entries()) }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.urlCache = new Map(state.urlCache as unknown as [string, ImageStatus][]);
        }
      }
    }
  )
);
