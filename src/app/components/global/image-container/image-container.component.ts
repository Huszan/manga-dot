import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isImageCashed, loadImage } from 'src/app/utils/base';

@Component({
  selector: 'app-image-container',
  templateUrl: './image-container.component.html',
  styleUrls: ['./image-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageContainerComponent implements OnInit {
  @Input() primaryUrl?: string;
  @Input() fallbackUrl!: string;

  imageUrl = new BehaviorSubject<string | undefined>(undefined);
  isCached = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.primaryUrl) {
      this.loadPrimary();
    } else {
      this.loadFallback();
    }
  }

  get imageClass() {
    return this.isCached ? '' : 'fade-in'; // Apply animation only if not cached
  }

  loadPrimary() {
    if (isImageCashed(this.primaryUrl!)) {
      this.imageUrl.next(this.primaryUrl!);
      this.isCached = true;
      this.cdr.detectChanges();
      return;
    }
    loadImage(this.primaryUrl!).then((url) => {
      if (url) {
        this.imageUrl.next(url);
        this.cdr.detectChanges();
      } else {
        this.loadFallback();
      }
    });
  }

  loadFallback() {
    if (isImageCashed(this.fallbackUrl)) {
      this.imageUrl.next(this.fallbackUrl);
      this.isCached = true;
      this.cdr.detectChanges();
      return;
    }
    loadImage(this.fallbackUrl).then((url) => {
      this.imageUrl.next(url ? url : '');
      this.cdr.detectChanges();
    });
  }
}
