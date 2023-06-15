import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ContactHttpService,
  ContactInfo,
} from '../../../services/http/contact-http.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  form!: FormGroup;
  isLoading: boolean = false;

  availableSubjects = [
    'General message',
    'Report missing chapters/pages',
    'Report incorrect data',
    'Report not responding image',
    'Report a bug',
    'Other report',
    'New manga request',
    'Update manga request',
    'Feature request',
    'Other request',
    'Lost account',
  ];

  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _snackbar: MatSnackBar,
    private contactHttpService: ContactHttpService
  ) {
    this.initForm();
  }

  private initForm() {
    this.form = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  get subject() {
    return this.form.get('subject') as FormControl;
  }

  get message() {
    return this.form.get('message') as FormControl;
  }

  resetForm() {
    this.form.reset();
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.isLoading = true;
    const info: ContactInfo = {
      name: this.name.value,
      email: this.email.value,
      subject: this.subject.value,
      message: this.message.value,
    };
    this.contactHttpService.sendMail(info).subscribe((res) => {
      if (res.accepted.length > 0)
        this._snackbar.open('Email sent successfully!', '', { duration: 3000 });
      else
        this._snackbar.open('Something went wrong. Try again later', '', {
          duration: 5000,
        });
      this.resetForm();
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }
}
