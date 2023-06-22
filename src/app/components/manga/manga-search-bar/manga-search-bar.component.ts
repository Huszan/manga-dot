import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-manga-search-bar',
  templateUrl: './manga-search-bar.component.html',
  styleUrls: ['./manga-search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaSearchBarComponent {
  searchString: string = '';

  constructor(private router: Router) {}

  searchValueChange(event: any) {
    this.searchString = event.target.value;
  }

  onSearch() {
    if (this.searchString.length <= 0) return;
    // Forces refresh on manga browse
    const dummyUrl = '/';
    const queryParams = { search: this.searchString };
    const navigationExtras: NavigationExtras = {
      queryParams,
      queryParamsHandling: 'merge',
    };
    this.router.navigateByUrl(dummyUrl).then(() => {
      this.router.navigate(['/manga/browse'], navigationExtras).then(() => {
        this.searchString = '';
      });
    });
  }
}
