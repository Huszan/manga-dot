import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/data/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserType } from '../../../types/user.type';
import { AccountType } from '../../../services/http/auth-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  form!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _auth: AuthService,
    private _snackbar: MatSnackBar,
    private _router: Router
  ) {
    this._initForm();
  }

  private _initForm() {
    this.form = this._fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
        ],
      ],
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

  get name() {
    return this.form.get('name') as FormControl;
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
    const user: UserType = {
      name: this.name.value,
      email: this.email.value,
      password: this.password.value,
      accountType: AccountType.User,
      likes: [],
      isVerified: false,
    };
    this._auth.registerUser(user).subscribe((res) => {
      if (res.status === 'error') {
        this._snackbar.open(
          res.message ? res.message : 'Something went wrong. Try again later.',
          'Close',
          {
            duration: 8000,
          }
        );
      } else {
        this._snackbar.open(res.message ? res.message : 'Success!', 'Close', {
          duration: 8000,
        });
        this.resetForm();
        this._router.navigate(['']);
      }
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }
}
