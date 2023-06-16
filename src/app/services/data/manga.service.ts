import { Injectable, OnInit } from '@angular/core';
import {
  MangaHttpService,
  RepositoryFindOptions,
} from '../http/manga-http.service';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  retry,
  Subscription,
  tap,
} from 'rxjs';
import { MangaType } from '../../types/manga.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LikeType } from '../../types/like.type';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  selectedManga$ = new BehaviorSubject<MangaType | null>(null);

  constructor(private mangaHttp: MangaHttpService) {}

  requestManga(id: number, callback?: any): Subscription {
    return this.mangaHttp
      .getMangaList({
        where: [
          {
            element: 'manga.id',
            value: id,
          },
        ],
        take: 1,
      })
      .subscribe((res) => {
        if (!res.list[0]) return;
        this.selectedManga$.next(res.list[0]);
        if (callback) callback();
      });
  }

  requestChapters(callback?: any) {
    const manga = this.selectedManga$.value;
    if (!manga || !manga.id) return;
    this.mangaHttp.getMangaChapters(manga.id).subscribe((chapters) => {
      if (!chapters || chapters.length <= 0) return;
      manga.chapters = chapters;
      this.selectedManga$.next(manga);
      if (callback) callback();
    });
  }

  requestPages(chapter: number, callback?: any) {
    const manga = this.selectedManga$.value;
    if (!manga || !manga.id || !manga.chapters || !manga.chapters[chapter])
      return;
    this.mangaHttp
      .getMangaPages(manga.id, manga.chapters[chapter].id!)
      .subscribe((pages) => {
        if (!pages || pages.length <= 0) return;
        manga.chapters![chapter].pages = pages;
        this.selectedManga$.next(manga);
        if (callback) callback();
      });
  }
}
