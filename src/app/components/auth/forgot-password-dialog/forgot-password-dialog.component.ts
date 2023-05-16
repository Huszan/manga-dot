import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../services/data/auth.service';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss'],
})
export class ForgotPasswordDialogComponent {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private _fb: FormBuilder,
    private _auth: AuthService
  ) {
    this._initForm();
  }

  private _initForm() {
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
        ],
      ],
    });
  }

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  onSubmit() {
    if (!this.form.valid) return;
    this._auth
      .forgotPassword(this.email.value, this.password.value)
      .subscribe((res) => {
        this.dialogRef.close(res);
      });
  }
}
