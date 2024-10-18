import { Injectable } from '@angular/core';
import { MangaHttpService } from '../http/manga-http.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MangaType } from '../../types/manga.type';
import { Status } from 'src/app/types/status.type';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  selectedManga$ = new BehaviorSubject<MangaType | null>(null);

  constructor(private mangaHttp: MangaHttpService) {}

  requestManga(id: number, callback?: any): Subscription {
    return this.mangaHttp.getManga(id.toString()).subscribe((res) => {
      if (!res || res.status === 'error') {
        return;
      }
      if (res.data && res.data.manga) this.selectedManga$.next(res.data.manga);
      if (callback) callback();
    });
  }

  requestChapters(callback?: any) {
    const manga = this.selectedManga$.value;
    if (!manga || !manga.id) return;
    this.mangaHttp.getMangaChapters(manga.id).subscribe((res) => {
      if (!res.data && !res.data.chapters) return;
      manga.chapters = res.data.chapters;
      this.selectedManga$.next(manga);
      if (callback) callback();
    });
  }

  requestPages(chapter: number, callback?: (status: Status) => void) {
    const manga = this.selectedManga$.value;
    if (!manga || !manga.id || !manga.chapters || !manga.chapters[chapter]) {
      if (callback) callback('error');
      return;
    }

    this.mangaHttp
      .getMangaPages(manga.id, manga.chapters[chapter].id!)
      .subscribe((res) => {
        if (res.status === 'error' || !res.data || !res.data.pages) {
          if (callback) callback(res.status);
          return;
        }
        manga.chapters![chapter].pages = res.data.pages;
        this.selectedManga$.next(manga);
      });

    if (callback) callback('success');
  }
}
