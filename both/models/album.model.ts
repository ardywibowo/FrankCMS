import { CollectionObject } from './collection-object.model';
import { Artwork, Category } from './artwork.model';

export interface Album extends CollectionObject {
  name: string;
  description: string;
  category: Category;
  creationDate: Date;
  artworks?: string[];
  coverArt?: string;
  private: boolean;
}
