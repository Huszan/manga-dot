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
  selector: 'app-manga-cover-list',
  templateUrl: './manga-cover-list.component.html',
  styleUrls: ['./manga-cover-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaCoverListComponent implements OnInit, OnDestroy {
  @Input() manga!: MangaType;
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
      if (res) {
        const message = res.message ? res.message : 'Something went wrong...';
        this._snackbar.open(message, 'Close', {
          duration: 8000,
        });
      }
    });
  }

  onClickEdit() {
    // TODO: Not implemented yet
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
