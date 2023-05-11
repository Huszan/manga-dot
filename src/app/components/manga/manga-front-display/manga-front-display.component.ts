import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MangaType } from '../../../types/manga.type';
import { environment } from '../../../../environments/environment';
import { MangaHttpService } from '../../../services/http/manga-http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MangaService } from '../../../services/data/manga.service';

@Component({
  selector: 'app-manga-front-display',
  templateUrl: './manga-front-display.component.html',
  styleUrls: ['./manga-front-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaFrontDisplayComponent {
  @Input() manga!: MangaType;
  @Input() size: number = 140;
  @Output() onRead = new EventEmitter();

  constructor(
    private _mangaService: MangaService,
    private _mangaHttpService: MangaHttpService,
    private _snackbar: MatSnackBar
  ) {}

  onClickRead(event: any) {
    this.onRead.emit(event);
  }

  onClickRemove() {
    this._mangaHttpService.removeManga(this.manga).subscribe((res) => {
      if ('success' in res && res.success) {
        this._mangaService.getMangaList();
        this._snackbar.open('Successfully removed manga', 'Ok');
      } else {
        this._snackbar.open('Something went wrong. Try again later.', 'Ok');
      }
    });
  }

  get isProduction() {
    return environment.production;
  }
}
