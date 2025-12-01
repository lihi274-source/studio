import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  title?: string; // Made title optional
  description: string;
  imageUrl: string;
  imageHint: string;
  details?: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

    