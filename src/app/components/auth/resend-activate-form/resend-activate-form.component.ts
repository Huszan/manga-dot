import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/data/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-resend-activate-form',
  templateUrl: './resend-activate-form.component.html',
  styleUrls: ['./resend-activate-form.component.scss'],
})
export class ResendActivateFormComponent {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ResendActivateFormComponent>,
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router
  ) {
    this._initForm();
  }

  private _initForm() {
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.form.get('email')!;
  }

  get activateUrl() {
    return document.URL.replace(this._router.url, '/activate');
  }

  onSubmit() {
    if (!this.email.value) return;
    this._auth.resend(this.email.value, this.activateUrl).subscribe((res) => {
      this.dialogRef.close(res);
    });
  }
}
