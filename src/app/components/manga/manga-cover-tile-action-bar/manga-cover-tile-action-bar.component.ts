import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionButton } from 'src/app/types/action-button.type';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogRes,
} from '../../global/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manga-cover-tile-action-bar',
  templateUrl: './manga-cover-tile-action-bar.component.html',
  styleUrls: ['./manga-cover-tile-action-bar.component.scss'],
})
export class MangaCoverTileActionBarComponent {
  @Input() actionButtonList: ActionButton[] | undefined;

  constructor(private _dialog: MatDialog) {}

  useConfirm(dialogData: ConfirmDialogData, cb: () => any) {
    const dialogRef = this._dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData
    >(ConfirmDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((res: ConfirmDialogRes) => {
      if (res.action === 'cancel') return;
      cb();
    });
  }
}
