import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMangaForm } from '../../types/manga-form.type';
import { MangaType } from '../../types/manga.type';

const MANGA_DOMAIN = {
  Production: 'https://personal-website-backend-production.up.railway.app/',
  Development: 'http://localhost:3000/',
};
enum MANGA_ROUTE {
  GET_PAGES = 'getMangaPages',
  TEST_FORM = 'testMangaForm',
  POST = 'createManga',
  GET_MANGAS = 'getMangaList',
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

  private _routeUrl(route: MANGA_ROUTE) {
    return this._domain + route;
  }

  getMangaList(id?: number): Observable<any> {
    let route = this._routeUrl(MANGA_ROUTE.GET_MANGAS);
    if (id != undefined) route += `?id=${id}`;
    return this.http.get(route);
  }

  getMangaPages(manga: MangaType, chapter: number): Observable<any> {
    return this.http.post(this._routeUrl(MANGA_ROUTE.GET_PAGES), {
      idHtmlLocate: manga.htmlLocate.id,
      chapter: chapter,
    });
  }

  testMangaForm(mangaForm: IMangaForm): Observable<any> {
    return this.http.post(this._routeUrl(MANGA_ROUTE.TEST_FORM), mangaForm);
  }

  postManga(mangaForm: IMangaForm): Observable<any> {
    return this.http.post(this._routeUrl(MANGA_ROUTE.POST), mangaForm);
  }
}
