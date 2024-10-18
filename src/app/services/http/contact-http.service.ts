import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/app/types/server-response.type';

const DOMAIN = {
  Production: 'https://personal-website-backend-production.up.railway.app/',
  Development: 'http://localhost:3000/',
};
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
    if (environment.production) {
      this._domain = DOMAIN.Production;
    } else {
      this._domain = DOMAIN.Development;
    }
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
