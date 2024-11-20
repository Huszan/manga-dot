import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ServerResponse } from 'src/app/types/server-response.type';
import { environment } from 'src/environments/environment';
import { ScrapMangaType } from 'src/app/types/scrap-manga.type';
import { AuthService } from '../data/auth.service';
import { generateGenericHeaders } from 'src/app/utils/route.utils';

@Injectable({
  providedIn: 'root',
})
export class ScrapperHttpServiceService {
  private readonly _domain;

  constructor(private _http: HttpClient, private _authService: AuthService) {
    this._domain = environment.apiUrl;
  }

  scrapManga(scrapData: ScrapMangaType): Observable<ServerResponse> {
    let route = new URL(`${this._domain}scrapper/manga/`);
    const body = {
      data: scrapData,
    };

    return this._http
      .post<ServerResponse>(route.toString(), body, {
        headers: generateGenericHeaders(this._authService),
      })
      .pipe(
        catchError((err) => {
          return of(err.error as ServerResponse);
        })
      );
  }
}
