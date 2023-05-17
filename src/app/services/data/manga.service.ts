import { Injectable, OnInit } from '@angular/core';
import {
  MangaHttpService,
  RepositoryFindOptions,
} from '../http/manga-http.service';
import { BehaviorSubject, catchError, EMPTY, retry, tap } from 'rxjs';
import { MangaType } from '../../types/manga.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LikeType } from '../../types/like.type';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  selectedManga$ = new BehaviorSubject<MangaType | null>(null);

  constructor(private mangaHttp: MangaHttpService) {}

  loadManga(id: number) {
    this.mangaHttp
      .getMangaList({
        where: {
          id: id,
        },
        take: 1,
      })
      .subscribe((res) => {
        if (!res[0]) return;
        this.selectedManga$.next(res[0]);
      });
  }
}
