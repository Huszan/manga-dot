import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MangaType } from '../../../types/manga.type';
import { UserType } from '../../../types/user.type';
import { Subscription } from 'rxjs';
import { MangaService } from '../../../services/data/manga.service';
import { MangaHttpService } from '../../../services/http/manga-http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/data/auth.service';
import { AccountType } from '../../../services/http/auth-http.service';

@Component({
  selector: 'app-manga-cover-tile',
  templateUrl: './manga-cover-tile.component.html',
  styleUrls: ['./manga-cover-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaCoverTileComponent implements OnInit, OnDestroy {
  @Input() manga!: MangaType;
  @Input() size?: number;
  @Output() onRead = new EventEmitter();

  user: UserType | null = null;

  private userSub!: Subscription;

  constructor(
    private _mangaHttpService: MangaHttpService,
    private _snackbar: MatSnackBar,
    private _auth: AuthService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userSub = this._auth.currentUser$.subscribe((user) => {
      this.user = user;
      this._cdr.detectChanges();
    });
  }

  onClickRead(event: any) {
    this.onRead.emit(event);
  }

  onClickRemove() {
    this._mangaHttpService.removeManga(this.manga).subscribe((res) => {
      if (res.message) this._snackbar.open(res.message, '', { duration: 2000 });
    });
  }

  onClickEdit() {
    this._snackbar.open('Not implemented yet', '', { duration: 2000 });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
