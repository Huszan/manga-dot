import { Injectable } from '@angular/core';
import { UserType } from '../../types/user.type';
import { AuthHttpService } from '../http/auth-http.service';
import {
  BehaviorSubject,
  Observable,
  retry,
  Subscription,
  take,
  tap,
} from 'rxjs';
import { StoreItem, StoreService } from '../store.service';

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
      tap((res) => {
        if (res.status === 1 && res.data) {
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
        if (res.status === 1) {
          this.currentUser$.next(res.data);
        }
      })
    );
  }

  registerUser(user: UserType) {
    return this._http.register(user).pipe(retry(3));
  }

  logout() {
    if (!this.currentUser$.value?.id) return;
    return this._http.logout(this.currentUser$.value?.id).pipe(
      retry(3),
      tap((res) => {
        if (res.status === 1) {
          this.currentUser$.next(null);
          this.store.removeItem(StoreItem.AUTH_TOKEN);
        }
      })
    );
  }

  activate(code: string) {
    return this._http.activate(code);
  }

  resend(email: string, url: string) {
    return this._http.resend(email, url);
  }

  forgotPassword(email: string, password: string) {
    return this._http.forgotPassword(email, password);
  }

  private _setAuthToken() {
    if (!this.currentUser$.value || !this.currentUser$.value?.authToken) return;
    this.store.setItem(
      StoreItem.AUTH_TOKEN,
      this.currentUser$.value?.authToken
    );
  }
}
