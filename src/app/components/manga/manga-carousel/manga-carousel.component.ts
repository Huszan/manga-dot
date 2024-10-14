import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from 'src/app/services/data/manga.service';
import {
  MangaHttpService,
  RepositoryFindOptions,
} from 'src/app/services/http/manga-http.service';
import { StoreService } from 'src/app/services/store.service';
import { MangaType } from 'src/app/types/manga.type';
import { ItemPerPage, SortData } from '../manga-browse/manga-browse.component';

@Component({
  selector: 'app-manga-carousel',
  templateUrl: './manga-carousel.component.html',
  styleUrls: ['./manga-carousel.component.scss'],
})
export class MangaCarouselComponent {
  @Input() title!: string;
  @Input() titleNav!: { link: string; queryParams: any };
  @Input() sortBy?: SortData;
  @Input() itemsPerPage: ItemPerPage | number = 12;
  @Input() size: number = 20;

  mangaList: MangaType[] = [];
  mangaCount: number | null = null;

  constructor(
    private httpManga: MangaHttpService,
    private mangaService: MangaService,
    private _cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  getElements() {
    this.mangaList = [];
    this._cdr.detectChanges();
    let options: RepositoryFindOptions = {
      where: [],
      take: this.itemsPerPage,
      order: this.sortBy ? this.sortBy : undefined,
    };
    this.httpManga.getMangaList(options).subscribe((res) => {
      this.mangaList = res.list;
      this.mangaCount = res.count;
      this._cdr.detectChanges();
    });
  }

  onMangaSelect(index: number) {
    this.mangaService.selectedManga$.next(this.mangaList[index]);
    this.router.navigate(['manga', this.mangaList[index].id]);
  }

  ngAfterViewInit() {
    this.getElements();
  }
}
