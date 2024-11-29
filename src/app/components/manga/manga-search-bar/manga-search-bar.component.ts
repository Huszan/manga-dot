import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-manga-search-bar',
  templateUrl: './manga-search-bar.component.html',
  styleUrls: ['./manga-search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaSearchBarComponent {
  @ViewChild('navAnchor') navAnchor!: MatAnchor;
  searchString: string = '';

  constructor() {}

  searchValueChange(event: any) {
    this.searchString = event.target.value;
  }

  get queryParams() {
    return { search: this.searchString };
  }

  get route() {
    return ['/manga/browse'];
  }

  onEnter() {
    this.navAnchor._elementRef.nativeElement.click();
    this.clearSearchInput();
  }

  clearSearchInput() {
    this.searchString = '';
  }
}
