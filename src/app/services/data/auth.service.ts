import { Injectable } from '@angular/core';
import { UserType } from '../../types/user.type';
import { AuthHttpService, AuthLogoutConfig } from '../http/auth-http.service';
import { BehaviorSubject, catchError, of, retry, take, tap } from 'rxjs';
import { StoreItem, StoreService } from '../store.service';
import { ServerResponse } from 'src/app/types/server-response.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = new BehaviorSubject<UserType | null>(null);

  constructor(private _http: AuthHttpService, private store: StoreService) {
    let tokenAuth = this.authByToken();
    if (tokenAuth) {
      tokenAuth.subscribe();
    }
  }

  loginUser(email: string, password: string) {
    return this._http.login(email, password).pipe(
      retry(3),
      take(1),
      catchError((err) => {
        return of(err.error as ServerResponse);
      }),
      tap((res) => {
        if (res.status === 'success' && res.data) {
          this.currentUser$.next(res.data);
          this._setAuthToken();
        }
      })
    );
  }

  authByToken() {
    let token = this.store.getItem(StoreItem.AUTH_TOKEN);
    if (!token) return null;
    return this._http.loginToken(token).pipe(
      retry(3),
      take(1),
      tap((res) => {
        if (res.status === 'success') {
          this.currentUser$.next(res.data);
        } else {
          this.store.removeItem(StoreItem.AUTH_TOKEN);
        }
      }),
      catchError((err) => {
        this.store.removeItem(StoreItem.AUTH_TOKEN);
        return of(err.error as ServerResponse);
      })
    );
  }

  registerUser(user: UserType) {
    return this._http.register(user).pipe(
      retry(3),
      catchError((err) => {
        return of(err.error as ServerResponse);
      })
    );
  }

  logout(config?: AuthLogoutConfig) {
    if (!this.currentUser$.value?.id) return;
    return this._http.logout(this.currentUser$.value?.id, config).pipe(
      retry(3),
      tap((res) => {
        if (res.status === 'success') {
          this.currentUser$.next(null);
          this.store.removeItem(StoreItem.AUTH_TOKEN);
        }
      }),
      catchError((err) => {
        return of(err.error as ServerResponse);
      })
    );
  }

  activate(code: string) {
    return this._http.activate(code).pipe(
      catchError((err) => {
        return of(err.error as ServerResponse);
      })
    );
  }

  resend(email: string, url: string) {
    return this._http.resend(email, url).pipe(
      catchError((err) => {
        return of(err.error as ServerResponse);
      })
    );
  }

  forgotPassword(email: string, password: string) {
    return this._http.forgotPassword(email, password).pipe(
      catchError((err) => {
        return of(err.error as ServerResponse);
      })
    );
  }

  initialize(): Promise<void> {
    return new Promise((res) => {
      let tokenAuth = this.authByToken();
      if (tokenAuth) {
        tokenAuth.subscribe(() => {
          res();
        });
      } else {
        res();
      }
    });
  }

  private _setAuthToken() {
    if (!this.currentUser$.value || !this.currentUser$.value?.authToken) return;
    this.store.setItem(
      StoreItem.AUTH_TOKEN,
      this.currentUser$.value?.authToken
    );
  }
}
