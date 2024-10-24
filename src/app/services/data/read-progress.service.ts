import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, of, switchMap } from 'rxjs';
import { ReadProgressType } from 'src/app/types/read-progress.type';
import { AuthService } from './auth.service';
import { ReadProgressHttpService } from '../http/read-progress-http.service';

@Injectable({
  providedIn: 'root',
})
export class ReadProgressService {
  readProgressList$ = new BehaviorSubject<ReadProgressType[] | null>(null);
  private _progressUpdate$ = new BehaviorSubject<ReadProgressType | null>(null);
  userId: number | undefined;

  constructor(
    private _http: ReadProgressHttpService,
    private _authService: AuthService
  ) {
    this.onSetProgress();
    _authService.currentUser$.subscribe((user) => {
      if (user === null || !user.id) {
        this.userId = undefined;
        this.readProgressList$.next(null);
      } else {
        this.userId = user.id;
        this.getProgress();
      }
    });
  }

  getProgress() {
    if (!this.userId) return;
    this._http.get(this.userId).subscribe((res) => {
      if (!res.data) return;
      this.readProgressList$.next(res.data as ReadProgressType[]);
    });
  }

  updateProgress(progress: ReadProgressType) {
    this._progressUpdate$.next(progress);
  }

  private onSetProgress() {
    this._progressUpdate$
      .pipe(
        debounceTime(3000),
        switchMap((debounceProgress) => {
          if (!debounceProgress) return of(null);
          if (this.isLastProgressGreater(debounceProgress)) return of(null);
          return this._http.set(debounceProgress);
        })
      )
      .subscribe((progress) => {
        if (!progress) return;
        this.getProgress();
      });
  }

  isLastProgressGreater(progress: ReadProgressType) {
    const lastProgress =
      this.readProgressList$.value !== null
        ? this.readProgressList$.value.filter((el) => {
            return el.mangaId === progress.mangaId;
          })
        : [];

    if (lastProgress.length === 0) return false;
    if (lastProgress[0].lastReadChapter < progress.lastReadChapter)
      return false;
    if (lastProgress[0].lastReadPage < progress.lastReadPage) return false;
    return true;
  }
}
