import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ReadProgressType } from 'src/app/types/read-progress.type';
import { ServerResponse } from 'src/app/types/server-response.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReadProgressHttpService {
  private readonly _domain;

  constructor(private _http: HttpClient) {
    this._domain = environment.apiUrl;
  }

  get(userId: number, progressId?: number): Observable<ServerResponse> {
    let route = new URL(
      `${this._domain}user/${userId}/progress${
        progressId ? `${progressId}` : ''
      }`
    );

    return this._http.get<ServerResponse>(route.toString()).pipe(
      catchError((err) => {
        return of(err.error as ServerResponse);
      })
    );
  }

  set(progress: ReadProgressType): Observable<ServerResponse> {
    let route = new URL(`${this._domain}user/${progress.userId}/progress`);

    return this._http
      .post<ServerResponse>(route.toString(), { data: progress })
      .pipe(
        catchError((err) => {
          return of(err.error as ServerResponse);
        })
      );
  }

  del(userId: number, progressId: number): Observable<ServerResponse> {
    let route = new URL(`${this._domain}user/${userId}/progress/${progressId}`);

    return this._http.delete<ServerResponse>(route.toString()).pipe(
      catchError((err) => {
        return of(err.error as ServerResponse);
      })
    );
  }
}
