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
  tags?: number[];
  itemsPerPage: ItemPerPage;
}

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
})
export class HomeViewComponent {
  browseElementsBasic: MangaBrowseElement[] = [
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
      itemsPerPage: 18,
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
      itemsPerPage: 18,
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
      itemsPerPage: 18,
    },
  ];
  browseElementsGenre: MangaBrowseElement[] = [
    {
      title: 'Action',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '2',
          tags: '0',
        },
      },
      sortBy: SortOptions[2].value,
      tags: [0],
      options: { all: false },
      itemsPerPage: 18,
    },
    {
      title: 'Fantasy',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '2',
          tags: '2',
        },
      },
      sortBy: SortOptions[2].value,
      tags: [2],
      options: { all: false },
      itemsPerPage: 18,
    },
    {
      title: 'Romance',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '2',
          tags: '4',
        },
      },
      sortBy: SortOptions[2].value,
      tags: [4],
      options: { all: false },
      itemsPerPage: 18,
    },
    {
      title: 'Comedy',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '2',
          tags: '6',
        },
      },
      sortBy: SortOptions[2].value,
      tags: [6],
      options: { all: false },
      itemsPerPage: 18,
    },
  ];
}
