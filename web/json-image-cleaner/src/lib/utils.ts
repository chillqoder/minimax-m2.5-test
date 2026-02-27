export interface StringWithPath {
  value: string;
  path: string;
}

export function findAllStrings(obj: unknown, path = ''): StringWithPath[] {
  const results: StringWithPath[] = [];

  if (obj === null || obj === undefined) {
    return results;
  }

  if (typeof obj === 'string') {
    results.push({ value: obj, path });
    return results;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      results.push(...findAllStrings(item, `${path}[${index}]`));
    });
    return results;
  }

  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const newPath = path ? `${path}.${key}` : key;
      results.push(...findAllStrings((obj as Record<string, unknown>)[key], newPath));
    }
  }

  return results;
}

export function isLikelyImageUrl(url: string): boolean {
  const hasHttp = /^https?:\/\//i.test(url);
  const hasImageExt = /\.(jpe?g|png|gif|webp|avif|bmp)(\?.*)?$/i.test(url);
  return hasHttp && (hasImageExt || url.length < 200);
}

export type ImageStatus = 'valid' | 'broken' | 'loading' | 'timeout';

export async function validateImage(
  url: string,
  timeoutMs = 8000
): Promise<ImageStatus> {
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;

    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        resolve('timeout');
      }
    }, timeoutMs);

    img.onload = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve('valid');
      }
    };

    img.onerror = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve('broken');
      }
    };

    img.src = url;
  });
}

export type CardStatus = 'all_valid' | 'any_valid' | 'all_broken' | 'some_broken' | 'no_images';

export interface ImageCandidate {
  url: string;
  status: ImageStatus;
}

export interface JsonItem {
  id: string;
  index: number;
  original: unknown;
  title: string;
  imageCandidates: ImageCandidate[];
  selected: boolean;
}

export function getCardStatus(item: JsonItem): CardStatus {
  const totalImages = item.imageCandidates.length;
  
  if (totalImages === 0) {
    return 'no_images';
  }

  const validCount = item.imageCandidates.filter(img => img.status === 'valid').length;
  const brokenCount = item.imageCandidates.filter(img => img.status === 'broken' || img.status === 'timeout').length;

  if (validCount === totalImages) {
    return 'all_valid';
  }
  if (brokenCount === totalImages) {
    return 'all_broken';
  }
  if (validCount > 0) {
    return 'any_valid';
  }
  return 'some_broken';
}

export function getDisplayTitle(item: unknown): string {
  if (item && typeof item === 'object') {
    const obj = item as Record<string, unknown>;
    if (typeof obj.title === 'string') return obj.title;
    if (typeof obj.name === 'string') return obj.name;
    if (typeof obj.id === 'string') return obj.id;
    if (typeof obj.id === 'number') return String(obj.id);
  }
  return '';
}

export function parseJsonInput(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const arrayKeys = Object.keys(obj).filter(key => Array.isArray(obj[key]));
    
    if (arrayKeys.length === 1) {
      return obj[arrayKeys[0]] as unknown[];
    }
  }

  throw new Error('Unable to parse JSON. Please provide an array or an object containing an array.');
}
