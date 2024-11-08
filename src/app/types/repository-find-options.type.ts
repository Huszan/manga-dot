import { SortData } from '../components/manga/manga-browse/manga-browse.component';

export interface RepositoryWhere {
  element: string;
  value: string | number | Array<string | number>;
  specialType?: 'like';
}

export interface RepositoryFindOptions {
  where?: RepositoryWhere[];
  skip?: number;
  take?: number;
  order?: SortData;
}