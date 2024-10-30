import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaCarouselComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() title!: string;
  @Input() titleNav: { link: string; queryParams: any } | undefined;
  @Input() itemsPerPage: ItemPerPage | number = 12;
  @Input() mangaList: MangaType[] = [];
  @Input() useProgress: boolean = false;
  @Input() size: number = 20;

  @ViewChild('carouselWrapperRef') carouselWrapperRef!: ElementRef;
  private resizeObserver!: ResizeObserver;

  fakeArray = fakeArray;

  constructor(
    private mangaService: MangaService,
    private router: Router,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mangaList']) {
      setTimeout(() => {
        this.updateScrollVariables();
        this._cdr.detectChanges();
      }, 0);
    }
  }

  onMangaSelect(index: number) {
    this.mangaService.selectedManga$.next(this.mangaList[index]);
    this.router.navigate(['manga', this.mangaList[index].id]);
  }

  isScrollMaxLeft = true;
  isScrollMaxRight = true;

  onScroll() {
    this.updateScrollVariables();
  }

  updateScrollVariables() {
    if (!this.carouselWrapperRef) return;
    let el = this.carouselWrapperRef.nativeElement as HTMLElement;
    this.isScrollMaxLeft = el.scrollLeft === 0;
    this.isScrollMaxRight = el.scrollWidth <= el.scrollLeft + el.offsetWidth;
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

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.carouselWrapperRef.nativeElement) {
          this.updateScrollVariables();
          this._cdr.markForCheck();
        }
      }
    });
    this.resizeObserver.observe(this.carouselWrapperRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }
}
