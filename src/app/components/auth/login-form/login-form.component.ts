import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/data/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ResendActivateFormComponent } from '../resend-activate-form/resend-activate-form.component';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  form!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _auth: AuthService,
    private _snackbar: MatSnackBar,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    this._initAuthCheck();
    this._initForm();
  }

  private _initForm() {
    this.form = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  private _initAuthCheck() {
    let authCheck = this._auth.authByToken();
    if (!authCheck) return;
    authCheck.subscribe((res) => {
      let user = res.data;
      if (user) {
        this._router.navigate(['']).then(() => {
          this._snackbar.open(
            'You are already logged in. Go and read some mangas!',
            'Yay',
            { duration: 5000 }
          );
        });
      }
    });
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  resetForm() {
    this._initForm();
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.isLoading = true;
    this._auth
      .loginUser(this.email.value, this.password.value)
      .subscribe((res) => {
        if (res.status === 0) {
          this._snackbar.open(res.message, 'Close', {
            duration: 8000,
          });
        } else {
          this._snackbar.open(res.message, 'Close', {
            duration: 8000,
          });
          this.resetForm();
          this._router.navigate(['']);
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      });
  }

  openResendDialog() {
    const dialogRef = this._dialog.open(ResendActivateFormComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.message) {
        this._snackbar.open(res.message, 'Close', {
          duration: 8000,
        });
      }
    });
  }

  openForgotPasswordDialog() {
    const dialogRef = this._dialog.open(ForgotPasswordDialogComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.message) {
        this._snackbar.open(res.message, 'Close', {
          duration: 8000,
        });
      }
    });
  }
}
