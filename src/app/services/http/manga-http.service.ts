import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MangaType } from '../../types/manga.type';
import { LikeType } from '../../types/like.type';
import { ChapterType } from '../../types/chapter.type';

const MANGA_DOMAIN = {
  Production: 'https://personal-website-backend-production.up.railway.app/',
  Development: 'http://localhost:3000/',
};
enum MANGA_ROUTE {
  GET_PAGES = 'getMangaPages',
  TEST_FORM = 'testMangaForm',
  TEST_CHAPTER = 'testMangaChapter',
  POST = 'createManga',
  GET_MANGAS = 'getMangaList',
  REMOVE = 'removeManga',
  LIKE = 'likeManga',
}
export interface RepositoryFindOptions {
  where?: {
    element: string;
    value: string | number;
    specialType?: 'like';
  }[];
  skip?: number;
  take?: number;
  order?: { element: string; sort: 'ASC' | 'DESC' };
}

@Injectable({
  providedIn: 'root',
})
export class MangaHttpService {
  private readonly _domain;

  constructor(private http: HttpClient) {
    if (environment.production) {
      this._domain = MANGA_DOMAIN.Production;
    } else {
      this._domain = MANGA_DOMAIN.Development;
    }
  }

  private _routeUrl(route: MANGA_ROUTE): URL {
    return new URL(this._domain + route);
  }

  getMangaList(
    options?: RepositoryFindOptions,
    bigSearch?: string
  ): Observable<{ list: MangaType[]; count: number }> {
    let route = this._routeUrl(MANGA_ROUTE.GET_MANGAS);
    return this.http
      .post(route.toString(), {
        options: options,
        bigSearch: bigSearch,
      })
      .pipe(
        map((response: any) => {
          for (let manga of response.list) {
            manga.addedDate = new Date(manga.addedDate);
            manga.lastUpdateDate = new Date(manga.lastUpdateDate);
          }
          return response;
        })
      );
  }

  getMangaPages(mangaId: number, chapter: ChapterType): Observable<any> {
    return this.http.post(this._routeUrl(MANGA_ROUTE.GET_PAGES).toString(), {
      mangaId: mangaId,
      chapter: chapter,
    });
  }

  testMangaForm(mangaForm: any, testId?: number | undefined): Observable<any> {
    return this.http.post(this._routeUrl(MANGA_ROUTE.TEST_FORM).toString(), {
      manga: mangaForm,
      testId: testId,
    });
  }

  testMangaChapter(mangaForm: any, chapter: number): Observable<any> {
    return this.http.post(this._routeUrl(MANGA_ROUTE.TEST_CHAPTER).toString(), {
      manga: mangaForm,
      chapter: chapter,
    });
  }

  postManga(mangaForm: any): Observable<any> {
    return this.http.post(this._routeUrl(MANGA_ROUTE.POST).toString(), {
      manga: mangaForm,
    });
  }

  removeManga(manga: any): Observable<any> {
    return this.http.post(this._routeUrl(MANGA_ROUTE.REMOVE).toString(), {
      manga: manga,
    });
  }

  likeManga(like: LikeType): Observable<any> {
    return this.http.post(this._routeUrl(MANGA_ROUTE.LIKE).toString(), {
      like: like,
    });
  }
}
