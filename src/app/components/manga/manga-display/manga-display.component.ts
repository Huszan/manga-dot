import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MangaType } from '../../../types/manga.type';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from '../../../services/data/manga.service';
import { FakeArray } from '../../../utils/fakeArray';

@Component({
  selector: 'app-manga-display',
  templateUrl: './manga-display.component.html',
  styleUrls: ['./manga-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaDisplayComponent implements OnInit {
  manga: MangaType | undefined = undefined;

  fakeArray = FakeArray;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mangaService: MangaService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._initializeManga();
  }

  get mangaId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  private _initializeManga() {
    if (!this.mangaService.selectedManga$.value) {
      this.mangaService.getManga(this.mangaId).subscribe((res) => {
        this.manga = res[0];
        this._cdr.detectChanges();
      });
    } else {
      this.manga = this.mangaService.selectedManga$.value;
      this._cdr.detectChanges();
    }
  }

  onChapterSelect(chapter: number) {
    this.router.navigate(['manga', this.mangaId, chapter]);
  }
}
