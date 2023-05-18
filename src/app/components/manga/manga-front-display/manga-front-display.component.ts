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
import { MangaHttpService } from '../../../services/http/manga-http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MangaService } from '../../../services/data/manga.service';
import { AuthService } from '../../../services/data/auth.service';
import { UserType } from '../../../types/user.type';
import { Subscription } from 'rxjs';
import { AccountType } from '../../../services/http/auth-http.service';

@Component({
  selector: 'app-manga-front-display',
  templateUrl: './manga-front-display.component.html',
  styleUrls: ['./manga-front-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaFrontDisplayComponent implements OnInit, OnDestroy {
  @Input() manga!: MangaType;
  @Input() size?: number;
  @Output() onRead = new EventEmitter();

  user: UserType | null = null;

  private userSub!: Subscription;

  constructor(
    private _mangaService: MangaService,
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
    if (this.user?.accountType === AccountType.User) {
      this._snackbar.open(
        "You don't have rights to perform this action",
        'Close',
        {
          duration: 8000,
        }
      );
      return;
    }
    this._mangaHttpService.removeManga(this.manga).subscribe((res) => {
      if ('success' in res && res.success) {
        this._snackbar.open('Successfully removed manga', 'Close', {
          duration: 8000,
        });
      } else {
        this._snackbar.open('Something went wrong. Try again later.', 'Close', {
          duration: 8000,
        });
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
