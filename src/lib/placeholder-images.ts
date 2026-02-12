import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  title?: string;
  title_es?: string;
  title_en?: string;
  title_ca?: string;
  description: string;
  description_es?: string;
  description_en?: string;
  description_ca?: string;
  imageUrl: string;
  imageHint: string;
  images?: string[];
  details?: string;
  details_es?: string;
  details_en?: string;
  details_ca?: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages as ImagePlaceholder[];

/**
 * Helper to get a localized property from an ImagePlaceholder
 */
export function getLocalized(item: ImagePlaceholder, property: 'title' | 'description' | 'details', locale: string): string {
  const key = `${property}_${locale}` as keyof ImagePlaceholder;
  const value = item[key];
  if (typeof value === 'string') return value;
  
  // Fallback to default property (usually Catalan)
  const defaultVal = item[property];
  return typeof defaultVal === 'string' ? defaultVal : '';
}
