import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MangaService } from 'src/app/services/data/manga.service';
import { MangaType } from 'src/app/types/manga.type';
import { fakeArray } from 'src/app/utils/base';
import { ItemPerPage } from '../manga-browse/manga-browse.component';

@Component({
  selector: 'app-manga-carousel',
  templateUrl: './manga-carousel.component.html',
  styleUrls: ['./manga-carousel.component.scss'],
})
export class MangaCarouselComponent implements AfterViewChecked {
  @Input() title!: string;
  @Input() titleNav: { link: string; queryParams: any } | undefined;
  @Input() itemsPerPage: ItemPerPage | number = 12;
  @Input() mangaList: MangaType[] = [];
  @Input() size: number = 20;

  @ViewChild('carouselWrapperRef') carouselWrapperRef!: ElementRef;

  fakeArray = fakeArray;

  constructor(
    private mangaService: MangaService,
    private router: Router,
    private _cdr: ChangeDetectorRef
  ) {}

  onMangaSelect(index: number) {
    this.mangaService.selectedManga$.next(this.mangaList[index]);
    this.router.navigate(['manga', this.mangaList[index].id]);
  }

  isScrollMaxLeft = true;
  isScrollMaxRight = true;

  onScroll() {}

  updateScrollVariables() {
    if (!this.carouselWrapperRef) return;
    let el = this.carouselWrapperRef.nativeElement;
    this.isScrollMaxLeft = el.scrollLeft === 0;
    this.isScrollMaxRight = el.scrollLeft + el.offsetWidth >= el.scrollWidth;
  }

  goNext() {
    if (!this.carouselWrapperRef) return;
    let el = this.carouselWrapperRef.nativeElement;
    el.scrollBy({
      left: el.offsetWidth,
      behavior: 'smooth',
    });
  }

  goPrev() {
    if (!this.carouselWrapperRef) return;
    let el = this.carouselWrapperRef.nativeElement;
    el.scrollBy({
      left: -el.offsetWidth,
      behavior: 'smooth',
    });
  }

  ngAfterViewChecked() {
    this.updateScrollVariables();
    this._cdr.detectChanges();
  }
}
