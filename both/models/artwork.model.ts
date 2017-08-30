import { CollectionObject } from './collection-object.model';
import { Album } from './album.model';

export enum Category {
  Photography,
  Sculpture,
  Travels,
  Writing,
  Any
}

export interface Artwork extends CollectionObject {
  name: string;
  description: string;
  category: Category;
  uploadDate: Date;
  albumsIn?: Album[];
  images?: string[];
  files?: string[];

  private: boolean;
}
