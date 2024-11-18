import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserType } from '../../types/user.type';
import { ServerResponse } from 'src/app/types/server-response.type';

export enum AccountType {
  User = 'user',
  Administrator = 'admin',
  Moderator = 'mod',
}

enum ROUTE {
  LOGIN = 'login',
  TOKEN_LOGIN = 'login/token',
  LOGOUT = 'logout',
  REGISTER = 'register',
  ACTIVATE = 'activate',
  RESEND = 'resendActivation',
  FORGOT_PASSWORD = 'forgotPassword',
}

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  private readonly _domain;

  constructor(private http: HttpClient) {
    this._domain = environment.apiUrl;
  }

  private _routeUrl(route: ROUTE): URL {
    return new URL(this._domain + route);
  }

  register(user: UserType): Observable<ServerResponse> {
    return this.http.post(this._routeUrl(ROUTE.REGISTER).toString(), {
      user: user,
      activateUrl: document.URL.replace('register', 'activate'),
    }) as Observable<ServerResponse>;
  }

  login(email: string, password: string): Observable<ServerResponse> {
    return this.http.post(this._routeUrl(ROUTE.LOGIN).toString(), {
      email: email,
      password: password,
    }) as Observable<ServerResponse>;
  }

  loginToken(authToken: string): Observable<ServerResponse> {
    return this.http.post(this._routeUrl(ROUTE.TOKEN_LOGIN).toString(), {
      token: authToken,
    }) as Observable<ServerResponse>;
  }

  logout(id: number): Observable<ServerResponse> {
    return this.http.post(this._routeUrl(ROUTE.LOGOUT).toString(), {
      id: id,
    }) as Observable<ServerResponse>;
  }

  activate(code: string): Observable<ServerResponse> {
    return this.http.post(this._routeUrl(ROUTE.ACTIVATE).toString(), {
      code: code,
    }) as Observable<ServerResponse>;
  }

  resend(email: string, activateUrl: string): Observable<ServerResponse> {
    return this.http.post(this._routeUrl(ROUTE.RESEND).toString(), {
      email: email,
      activateUrl: activateUrl,
    }) as Observable<ServerResponse>;
  }

  forgotPassword(email: string, password: string): Observable<ServerResponse> {
    return this.http.post(this._routeUrl(ROUTE.FORGOT_PASSWORD).toString(), {
      email: email,
      newPassword: password,
    }) as Observable<ServerResponse>;
  }
}
