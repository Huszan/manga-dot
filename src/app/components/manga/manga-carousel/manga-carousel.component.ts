import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MangaService } from 'src/app/services/data/manga.service';
import { MangaType } from 'src/app/types/manga.type';
import { fakeArray } from 'src/app/utils/base';
import { ItemPerPage } from '../manga-browse/manga-browse.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manga-carousel',
  templateUrl: './manga-carousel.component.html',
  styleUrls: ['./manga-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaCarouselComponent implements OnChanges {
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

  onScroll() {}

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
}
