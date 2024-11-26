import { Injectable } from '@angular/core';
import { MangaHttpService } from '../http/manga-http.service';
import { BehaviorSubject } from 'rxjs';
import { MangaType } from '../../types/manga.type';
import { ChapterType } from 'src/app/types/chapter.type';
import { PageType } from 'src/app/types/page.type';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  selectedManga$ = new BehaviorSubject<MangaType | null>(null);

  constructor(private mangaHttp: MangaHttpService) {}

  requestManga(mangaId: number): Promise<void> {
    return new Promise((res, rej) => {
      this.selectedManga$.next(null);

      this.mangaHttp.getManga(mangaId).subscribe((serverRes) => {
        if (serverRes.status === 'error' || !serverRes.data.manga) {
          this.selectedManga$.next(null);
          return rej();
        }

        this.selectedManga$.next(serverRes.data.manga as MangaType);
        return res();
      });
    });
  }

  requestChapters(mangaId: number): Promise<void> {
    return new Promise(async (res, rej) => {
      if (!this.selectedManga$.value) await this.requestManga(mangaId);
      const manga = this.selectedManga$.value;
      if (!manga) return rej();
      if (manga.id === mangaId && manga.chapters) return res();
      else {
        this.selectedManga$.next({ ...manga, chapters: undefined });
      }

      this.mangaHttp.getMangaChapters(mangaId).subscribe((serverRes) => {
        if (!serverRes.data && !serverRes.data.chapters) return rej();

        manga.chapters = serverRes.data.chapters as ChapterType[];
        this.selectedManga$.next(manga);
        return res();
      });
    });
  }

  requestPages(mangaId: number, chapterI: number): Promise<void> {
    return new Promise(async (res, rej) => {
      await this.requestChapters(mangaId);
      const manga = this.selectedManga$.value;
      if (
        !manga ||
        !manga.chapters ||
        !manga.chapters[chapterI] ||
        manga.chapters[chapterI].id === undefined
      ) {
        return rej();
      }

      this.mangaHttp
        .getMangaPages(mangaId, manga.chapters[chapterI].id!)
        .subscribe((serverRes) => {
          if (
            serverRes.status === 'error' ||
            !serverRes.data ||
            !serverRes.data.pages
          ) {
            return rej();
          }

          let manga = this.selectedManga$.value;
          if (!manga || !manga.chapters) return rej();
          manga.chapters[chapterI].pages = serverRes.data.pages as PageType[];
          this.selectedManga$.next(manga);
          return res();
        });
    });
  }

  updateLikes(): Promise<void> {
    const manga = this.selectedManga$.value;
    return new Promise((res, rej) => {
      this.mangaHttp.getManga(manga?.id).subscribe((serverRes) => {
        const nextManga = serverRes.data.manga as MangaType;
        if (serverRes.status === 'error' || !serverRes.data.manga) {
          this.selectedManga$.next(null);
          return rej();
        }

        this.selectedManga$.next({
          ...manga,
          likes: nextManga.likes,
        } as MangaType);
        return res();
      });
    });
  }
}
