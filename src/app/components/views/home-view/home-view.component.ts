import { Component, HostListener } from '@angular/core';
import {
  ItemPerPage,
  SortOptions,
} from '../../manga/manga-browse/manga-browse.component';
import { RepositoryFindOptions } from 'src/app/types/repository-find-options.type';
import { MangaHttpService } from 'src/app/services/http/manga-http.service';
import { ServerResponse } from 'src/app/types/server-response.type';
import { ReadProgressService } from 'src/app/services/data/read-progress.service';
import { MangaType } from 'src/app/types/manga.type';

export interface MangaBrowseElement {
  title: string;
  titleNav?: { link: string; queryParams: any };
  mangaList: MangaType[];
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

  readMangaList: MangaType[] = [];

  constructor(
    private _mangaHttpService: MangaHttpService,
    private _readProgressService: ReadProgressService
  ) {
    for (let [key, val] of Object.entries(this.browseElements)) {
      this.fetchManga(
        {
          take: val.itemsPerPage,
          order: val.sortBy,
        },
        (res) => {
          this.browseElements[key].mangaList = res.data.list;
        }
      );
    }

    _readProgressService.readProgressList$.subscribe((list) => {
      if (!list || list.length === 0) return;
      this.readMangaList = list
        .map((el) => {
          if (!el.manga) return el.manga;
          el.manga.addedDate = new Date(el.manga.addedDate);
          el.manga.lastUpdateDate = new Date(el.manga.lastUpdateDate);
          return el.manga;
        })
        .filter((el) => el !== undefined) as MangaType[];
    });
  }

  browseElements: { [key: string]: MangaBrowseElement } = {
    new: {
      title: 'New titles',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '2',
        },
      },
      mangaList: [],
      sortBy: SortOptions[2].value,
      itemsPerPage: 24,
    },
    popular: {
      title: 'Popular',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '0',
        },
      },
      mangaList: [],
      sortBy: SortOptions[0].value,
      itemsPerPage: 24,
    },
    bestRated: {
      title: 'Best rated',
      titleNav: {
        link: 'manga/browse',
        queryParams: {
          sort: '5',
        },
      },
      mangaList: [],
      sortBy: SortOptions[5].value,
      itemsPerPage: 24,
    },
  };

  fetchManga(
    options: RepositoryFindOptions,
    next?: (res: ServerResponse) => void
  ) {
    return this._mangaHttpService
      .getManga(undefined, options)
      .subscribe((res) => {
        if (next) next(res);
      });
  }
}
