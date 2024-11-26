import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LikeType } from '../../types/like.type';
import { ServerResponse } from 'src/app/types/server-response.type';
import { AuthService } from '../data/auth.service';
import { generateGenericHeaders } from 'src/app/utils/route.utils';
import { RepositoryFindOptions } from 'src/app/types/repository-find-options.type';
import { ReadProgressService } from '../data/read-progress.service';
import { MangaType } from 'src/app/types/manga.type';

enum MANGA_ROUTE {
  POST = 'manga',
  PUT = 'manga/:mangaId',
  GET_MANGAS = 'manga/:mangaId',
  GET_CHAPTERS = 'manga/:mangaId/chapters',
  GET_PAGES = 'manga/:mangaId/chapters/:chapterId/pages',
  REMOVE = 'manga/:mangaId',
  LIKE = 'manga/like',
}

@Injectable({
  providedIn: 'root',
})
export class MangaHttpService {
  private readonly _domain;

  constructor(
    private http: HttpClient,
    private _authService: AuthService,
    private _readProgressService: ReadProgressService
  ) {
    this._domain = environment.apiUrl;
  }

  private _routeUrl(route: MANGA_ROUTE | string): URL {
    return new URL(this._domain + route);
  }

  getManga(
    id?: number,
    options?: RepositoryFindOptions,
    bigSearch?: string
  ): Observable<ServerResponse> {
    let route = this._routeUrl(
      `${MANGA_ROUTE.GET_MANGAS.replace('/:mangaId', id ? `/${id}` : '')}`
    );
    options = {
      ...options,
      relations: {
        ...options?.relations,
        likes: true,
      },
    };

    const addDate = (res: ServerResponse) => {
      if (res.data && res.data.manga) {
        res.data.manga.addedDate = new Date(res.data.manga.addedDate);
        res.data.manga.lastUpdateDate = new Date(res.data.manga.lastUpdateDate);
      }
      if (!res.data || !res.data.list) return res;
      for (let manga of res.data.list) {
        manga.addedDate = new Date(manga.addedDate);
        manga.lastUpdateDate = new Date(manga.lastUpdateDate);
      }
      return res;
    };

    if (options) route.searchParams.append('options', JSON.stringify(options));
    if (bigSearch) route.searchParams.append('search', bigSearch);

    return this.http.get<ServerResponse>(route.toString()).pipe(
      map((res) => addDate(res)),
      catchError((err) => {
        return of(err.error as ServerResponse);
      })
    ) as Observable<ServerResponse>;
  }

  getMangaChapters(mangaId: number): Observable<ServerResponse> {
    const path = MANGA_ROUTE.GET_CHAPTERS.replace('/:mangaId', `/${mangaId}`);
    return this.http.get<ServerResponse>(this._routeUrl(path).toString()).pipe(
      catchError((err) => {
        return of(err.error as ServerResponse);
      })
    ) as Observable<ServerResponse>;
  }

  getMangaPages(
    mangaId: number,
    chapterId: number
  ): Observable<ServerResponse> {
    const path = MANGA_ROUTE.GET_PAGES.replace(
      '/:mangaId',
      `/${mangaId}`
    ).replace('/:chapterId', `/${chapterId}`);
    return this.http.get<ServerResponse>(this._routeUrl(path).toString()).pipe(
      catchError((err) => {
        return of(err.error as ServerResponse);
      })
    ) as Observable<ServerResponse>;
  }

  postManga(manga: MangaType): Observable<ServerResponse> {
    return this.http
      .post<ServerResponse>(
        this._routeUrl(MANGA_ROUTE.POST).toString(),
        {
          manga,
        },
        {
          headers: generateGenericHeaders(this._authService),
        }
      )
      .pipe(
        catchError((err) => {
          return of(err.error as ServerResponse);
        })
      ) as Observable<ServerResponse>;
  }

  updateManga(manga: MangaType): Observable<ServerResponse> {
    const path = MANGA_ROUTE.PUT.replace('/:mangaId', `/${manga.id}`);
    let headers = generateGenericHeaders(this._authService);
    return this.http
      .put<ServerResponse>(
        this._routeUrl(path).toString(),
        { manga },
        { headers }
      )
      .pipe(
        catchError((err) => {
          return of(err.error as ServerResponse);
        })
      );
  }

  removeManga(manga: any): Observable<ServerResponse> {
    const path = MANGA_ROUTE.REMOVE.replace('/:mangaId', `/${manga.id}`);
    let headers = generateGenericHeaders(this._authService);

    return this.http
      .delete<ServerResponse>(this._routeUrl(path).toString(), {
        headers,
      })
      .pipe(
        catchError((err) => {
          return of(err.error as ServerResponse);
        }),
        tap(() => {
          if (this._readProgressService.isMangaInReadProgress(manga.id))
            this._readProgressService.getProgress();
        })
      ) as Observable<ServerResponse>;
  }

  likeManga(like: LikeType): Observable<ServerResponse> {
    return this.http
      .post<ServerResponse>(this._routeUrl(MANGA_ROUTE.LIKE).toString(), {
        like: like,
      })
      .pipe(
        catchError((err) => {
          return of(err.error as ServerResponse);
        })
      ) as Observable<ServerResponse>;
  }
}
