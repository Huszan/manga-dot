import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MangaService } from '../../../services/data/manga.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IManga } from '../../../types/manga.type';

@Component({
  selector: 'app-manga-browse',
  templateUrl: './manga-browse.component.html',
  styleUrls: ['./manga-browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaBrowseComponent implements OnInit, OnDestroy {
  mangas = new BehaviorSubject<IManga[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);

  chosenManga: IManga | undefined;

  private _subscriptions: Subscription[] = [];

  constructor(private mangaService: MangaService) {}

  ngOnInit(): void {
    let mangaListSub = this.mangaService.displayedMangaList$.subscribe(
      (data) => {
        this.mangas.next(data);
      }
    );
    let loadingSub = this.mangaService.isLoading$.subscribe((data) => {
      this.isLoading.next(data);
    });
    this._subscriptions.push(mangaListSub);
    this._subscriptions.push(loadingSub);
  }

  loadMore() {
    this.mangaService.loadMorePages();
  }

  isEverythingLoaded() {
    return this.mangaService.isEverythingLoaded;
  }

  onSearchInput(event: any) {
    this.mangaService.searchInput = event.target.value;
  }

  onMangaSelect(index: number) {
    this.chosenManga = this.mangaService.displayedMangaList$.value[index];
  }

  ngOnDestroy() {
    this._subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
