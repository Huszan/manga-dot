import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title?: string;
  desc?: string;
}

export interface ConfirmDialogRes {
  action: 'confirm' | 'cancel';
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  title: string = 'Are you sure?';
  desc: string | undefined;

  constructor(
    private _dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) injectedData: ConfirmDialogData
  ) {
    if (injectedData.title) this.title = injectedData.title;
    if (injectedData.desc) this.desc = injectedData.desc;
  }

  onConfirm() {
    this._dialogRef.close({
      action: 'confirm',
    } as ConfirmDialogRes);
  }

  onCancel() {
    this._dialogRef.close({
      action: 'cancel',
    } as ConfirmDialogRes);
  }
}
