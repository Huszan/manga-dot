import { SortData } from '../components/manga/manga-browse/manga-browse.component';

export interface RepositoryFindOptions {
  where?: {
    element: string;
    value: string | number;
    specialType?: 'like';
  }[];
  skip?: number;
  take?: number;
  order?: SortData;
}
