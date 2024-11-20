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
import { Router } from '@angular/router';

@Component({
  selector: 'app-manga-cover-list',
  templateUrl: './manga-cover-list.component.html',
  styleUrls: ['./manga-cover-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaCoverListComponent implements OnInit, OnDestroy {
  @Input() manga!: MangaType;

  user: UserType | null = null;

  private userSub!: Subscription;

  constructor(
    private _mangaService: MangaService,
    private _mangaHttpService: MangaHttpService,
    private _snackbar: MatSnackBar,
    private _auth: AuthService,
    private _cdr: ChangeDetectorRef,
    private _router: Router
  ) {}

  get imageUrl(): string {
    return this.manga!.imagePath ? this.manga!.imagePath : this.manga!.pic;
  }

  ngOnInit() {
    this.userSub = this._auth.currentUser$.subscribe((user) => {
      this.user = user;
      this._cdr.detectChanges();
    });
  }

  onClickRead() {
    this._mangaService.selectedManga$.next(this.manga);
    this._router.navigate(['manga', this.manga.id]);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
