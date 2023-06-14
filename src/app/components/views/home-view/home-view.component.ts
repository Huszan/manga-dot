import { Component } from '@angular/core';
import {
  ItemPerPage,
  MangaBrowseOptions,
  SortOptions,
} from '../../manga/manga-browse/manga-browse.component';

export interface MangaBrowseElement {
  title?: string;
  titleNav?: { link: string; queryParams: any };
  options: MangaBrowseOptions;
  sortBy?: any;
  itemsPerPage: ItemPerPage;
}

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
})
export class HomeViewComponent {
  browseElements: MangaBrowseElement[] = [
    {
      title: 'New titles',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '2',
        },
      },
      sortBy: SortOptions[2].value,
      options: { all: false },
      itemsPerPage: 12,
    },
    {
      title: 'Popular',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '0',
        },
      },
      sortBy: SortOptions[0].value,
      options: { all: false },
      itemsPerPage: 12,
    },
    {
      title: 'Best rated',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '5',
        },
      },
      sortBy: SortOptions[5].value,
      options: { all: false },
      itemsPerPage: 12,
    },
  ];
}
