import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/app/types/server-response.type';

enum ROUTE {
  SEND_MAIL = 'sendMailMangaDot',
}

export type ContactInfo = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class ContactHttpService {
  private readonly _domain;

  constructor(private http: HttpClient) {
    this._domain = environment.apiUrl;
  }

  private _routeUrl(route: ROUTE): URL {
    return new URL(this._domain + route);
  }

  sendMail(info: ContactInfo): Observable<ServerResponse> {
    return this.http.post(this._routeUrl(ROUTE.SEND_MAIL).toString(), {
      info: info,
    }) as Observable<ServerResponse>;
  }
}
