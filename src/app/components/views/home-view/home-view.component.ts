import { Component } from '@angular/core';
import { SortOptions } from '../../manga/manga-browse/manga-browse.component';

export interface MangaBrowseElement {
  title?: string;
  titleNav?: { link: string; queryParams: any };
  canChangeIconSize: boolean;
  canLoadMore: boolean;
  canSearch: boolean;
  canSort: boolean;
  sortBy?: any;
  elementsPerLoad: number;
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
      canChangeIconSize: false,
      canLoadMore: false,
      canSearch: false,
      canSort: false,
      elementsPerLoad: 7,
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
      canChangeIconSize: false,
      canLoadMore: false,
      canSearch: false,
      canSort: false,
      elementsPerLoad: 7,
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
      canChangeIconSize: false,
      canLoadMore: false,
      canSearch: false,
      canSort: false,
      elementsPerLoad: 7,
    },
  ];
}
