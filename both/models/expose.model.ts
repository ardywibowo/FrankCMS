import { CollectionObject } from './collection-object.model';
import { Category } from './artwork.model';

export interface Expose extends CollectionObject {
  description: string;
  category: Category;
  coverArt?: string;
}
