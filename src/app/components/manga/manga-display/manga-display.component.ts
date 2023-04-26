import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MangaType } from '../../../types/manga.type';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MangaService } from '../../../services/data/manga.service';
import { FakeArray } from '../../../utils/fakeArray';

@Component({
  selector: 'app-manga-display',
  templateUrl: './manga-display.component.html',
  styleUrls: ['./manga-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaDisplayComponent implements OnInit, OnDestroy {
  manga$ = new BehaviorSubject<MangaType | undefined>(undefined);

  fakeArray = FakeArray;
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mangaService: MangaService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.mangaService.selectedManga$.value) {
      this.mangaService.getManga(this.mangaId);
    }
    let mangaSub = this.mangaService.selectedManga$.subscribe((manga) => {
      this.manga$.next(manga);
      this._cdr.detectChanges();
    });
    this.subscriptions.push(mangaSub);
  }

  get mangaId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  onChapterSelect(chapter: number) {
    this.router.navigate(['manga', this.mangaId, chapter]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => {
      el.unsubscribe();
    });
  }
}
