import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MangaType } from '../../../types/manga.type';
import { UserType } from '../../../types/user.type';
import { Subscription } from 'rxjs';
import { MangaService } from '../../../services/data/manga.service';
import { AuthService } from '../../../services/data/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manga-cover-tile',
  templateUrl: './manga-cover-tile.component.html',
  styleUrls: ['./manga-cover-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaCoverTileComponent implements OnInit, OnDestroy {
  @Input() manga!: MangaType;
  @Input() size?: number;

  user: UserType | null = null;
  imageUrl?: string;

  private userSub!: Subscription;

  constructor(
    private _mangaService: MangaService,
    private _auth: AuthService,
    private _cdr: ChangeDetectorRef,
    private _router: Router
  ) {}

  ngOnInit() {
    this.userSub = this._auth.currentUser$.subscribe((user) => {
      this.user = user;
      this._cdr.detectChanges();
    });
  }

  onClickRead() {
    this._mangaService.selectedManga$.next(this.manga);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
