import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MangaType } from '../../types/manga.type';

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

  getMangaList(id?: number): Observable<any> {
    let route = this._routeUrl(MANGA_ROUTE.GET_MANGAS);
    if (id) {
      route.searchParams.set('id', String(id));
    }
    return this.http.get(route.toString());
  }

  getMangaPages(manga: MangaType, chapter: number): Observable<any> {
    return this.http.post(this._routeUrl(MANGA_ROUTE.GET_PAGES).toString(), {
      manga: manga,
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
}
