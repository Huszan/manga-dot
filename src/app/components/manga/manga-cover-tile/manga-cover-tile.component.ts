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
  isMouseMoved = false;

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

  onClickRead(e: MouseEvent) {
    if (this.isMouseMoved) {
      e.preventDefault();
      return;
    }
    this._mangaService.selectedManga$.next(this.manga);
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      event.preventDefault();
    }
    this.isMouseMoved = false;

    const mouseMoveListener = () => {
      this.isMouseMoved = true;
      this._cdr.detectChanges();
      window.removeEventListener('mousemove', mouseMoveListener);
    };

    window.addEventListener('mousemove', mouseMoveListener);

    const mouseUpListener = () => {
      window.removeEventListener('mousemove', mouseMoveListener);
      window.removeEventListener('mouseup', mouseUpListener);
    };

    window.addEventListener('mouseup', mouseUpListener);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
