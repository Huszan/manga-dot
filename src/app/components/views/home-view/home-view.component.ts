import { Component, HostListener } from '@angular/core';
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
  isMobile = window.innerWidth < 800;

  @HostListener('window:resize', [`$event`])
  onWindowResize(event: any) {
    this.isMobile = event.target.innerWidth < 800;
  }

  browseElements = {
    new: {
      title: 'New titles',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '2',
        },
      },
      sortBy: SortOptions[2].value,
      options: { all: false },
      itemsPerPage: 63,
    },
    popular: {
      title: 'Popular',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '0',
        },
      },
      sortBy: SortOptions[0].value,
      options: { all: false },
      itemsPerPage: 63,
    },
    bestRated: {
      title: 'Best rated',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '5',
        },
      },
      sortBy: SortOptions[5].value,
      options: { all: false },
      itemsPerPage: 63,
    },
  }
}
