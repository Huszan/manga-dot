import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/data/auth.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss'],
})
export class ActivateAccountComponent implements OnInit {
  code: string | null = null;
  message: string = 'Account is being activated';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _snackbar: MatSnackBar,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this.code = this._code;
    if (!this.code) {
      this._goBackWithMessage('No activation code given');
      this.message = 'No activation code given';
    } else {
      this._auth.activate(this.code).subscribe((res) => {
        this._goBackWithMessage(res.message);
        this.message = res.message;
      });
    }
  }

  private get _code(): string | null {
    return this._activatedRoute.snapshot.queryParamMap.get('code');
  }

  private _goBackWithMessage(message: string) {
    this._router.navigate(['']).then(() => {
      this._snackbar.open(message, 'Close', { duration: 5000 });
    });
  }
}
