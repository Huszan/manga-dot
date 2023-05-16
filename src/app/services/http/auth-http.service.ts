import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserType } from '../../types/user.type';

export enum AccountType {
  User = 'user',
  Administrator = 'admin',
  Moderator = 'mod',
}

const DOMAIN = {
  Production: 'https://personal-website-backend-production.up.railway.app/',
  Development: 'http://localhost:3000/',
};
enum ROUTE {
  LOGIN = 'login',
  TOKEN_LOGIN = 'login/token',
  LOGOUT = 'logout',
  REGISTER = 'register',
}

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
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

  register(user: UserType): Observable<any> {
    return this.http.post(this._routeUrl(ROUTE.REGISTER).toString(), {
      user: user,
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this._routeUrl(ROUTE.LOGIN).toString(), {
      email: email,
      password: password,
    });
  }

  loginToken(authToken: string): Observable<any> {
    return this.http.post(this._routeUrl(ROUTE.TOKEN_LOGIN).toString(), {
      token: authToken,
    });
  }

  logout(id: number): Observable<any> {
    return this.http.post(this._routeUrl(ROUTE.LOGOUT).toString(), {
      id: id,
    });
  }
}