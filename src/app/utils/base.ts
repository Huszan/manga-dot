import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogRes,
} from '../components/global/confirm-dialog/confirm-dialog.component';

export function fakeArray(length: number): number[] {
  return Array.from({ length }, (_, index) => index + 1);
}

export function useConfirmDialog(
  dialog: MatDialog,
  dialogData: ConfirmDialogData,
  cb: () => any
) {
  const dialogRef = dialog.open<ConfirmDialogComponent, ConfirmDialogData>(
    ConfirmDialogComponent,
    {
      data: dialogData,
    }
  );

  dialogRef.afterClosed().subscribe((res: ConfirmDialogRes) => {
    if (res.action === 'cancel') return;
    cb();
  });
}

export function isImageCashed(imagePath: string) {
  const img = new Image();
  img.src = imagePath;
  return img.complete && img.naturalWidth > 0;
}

export function loadImage(imagePath: string): Promise<string | null> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      res(imagePath);
    };
    img.onerror = () => {
      res(null);
    };
    img.src = imagePath;
  });
}
