import { Injectable } from '@angular/core';
import { UserType } from '../../types/user.type';
import { AuthHttpService } from '../http/auth-http.service';
import { BehaviorSubject, retry, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = new BehaviorSubject<UserType | null>(null);

  constructor(private _http: AuthHttpService) {
    let token = localStorage.getItem('authToken');
    if (token) {
      this._loginByToken(token).subscribe();
    }
  }

  loginUser(email: string, password: string) {
    return this._http.login(email, password).pipe(
      retry(3),
      take(1),
      tap((res) => {
        if (res.status === 1) {
          this.currentUser$.next(res.data);
          this._setAuthToken();
        }
      })
    );
  }

  private _loginByToken(token: string) {
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
          this._removeAuthToken();
        }
      })
    );
  }

  activate(code: string) {
    return this._http.activate(code);
  }

  private _setAuthToken() {
    if (!this.currentUser$.value) return;
    localStorage.setItem(
      'authToken',
      String(this.currentUser$!.value.authToken)
    );
  }

  private _removeAuthToken() {
    localStorage.removeItem('authToken');
  }
}
