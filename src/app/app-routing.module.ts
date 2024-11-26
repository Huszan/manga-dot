import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { MangaDisplayComponent } from './components/manga/manga-display/manga-display.component';
import { MangaChapterComponent } from './components/manga/manga-chapter/manga-chapter.component';
import { CreateMangaFormComponent } from './components/manga/create-manga-form/create-manga-form.component';
import { LoginFormComponent } from './components/auth/login-form/login-form.component';
import { RegisterFormComponent } from './components/auth/register-form/register-form.component';
import { ActivateAccountComponent } from './components/auth/activate-account/activate-account.component';
import { HomeViewComponent } from './components/views/home-view/home-view.component';
import { MangaBrowseComponent } from './components/manga/manga-browse/manga-browse.component';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/data/auth.service';
import { UserType } from './types/user.type';
import { BehaviorSubject } from 'rxjs';
import { ContactFormComponent } from './components/views/contact-form/contact-form.component';
import { EditMangaFormComponent } from './components/manga/edit-manga-form/edit-manga-form.component';

const routes: Routes = [
  {
    title: 'Manga dot | Home',
    path: '',
    data: { icon: 'home', sidebarDisplay: 'Home' },
    component: HomeViewComponent,
  },
  {
    title: 'Manga dot | Browse',
    path: 'manga/browse',
    data: { icon: 'manage_search', sidebarDisplay: 'Browse' },
    component: MangaBrowseComponent,
  },
  {
    title: 'Manga dot | Add manga',
    path: 'manga/add',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'mod'], icon: 'add', sidebarDisplay: 'Add manga' },
    component: CreateMangaFormComponent,
  },
  {
    title: 'Manga dot | Edit manga',
    path: 'manga/:id/edit',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'mod'] },
    component: EditMangaFormComponent,
  },
  {
    title: 'Manga dot | Contact',
    path: 'contact',
    data: { icon: 'email', sidebarDisplay: 'Contact' },
    component: ContactFormComponent,
  },
  {
    title: 'Manga dot | Preview',
    path: 'manga/:id',
    component: MangaDisplayComponent,
  },
  {
    title: 'Manga dot | Read',
    path: 'manga/:id/:chapter',
    component: MangaChapterComponent,
  },
  {
    title: 'Manga dot | Login',
    path: 'login',
    component: LoginFormComponent,
  },
  {
    title: 'Manga dot | Register',
    path: 'register',
    component: RegisterFormComponent,
  },
  {
    path: 'activate',
    component: ActivateAccountComponent,
  },
  { title: 'Manga dot | Redirect', path: '**', redirectTo: '' },
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  availableRoutes = new BehaviorSubject<Routes>([]);

  get homeRoute() {
    return this.availableRoutes.value[0];
  }

  constructor(private auth: AuthService) {
    this._collectAvailableRoutes();
    auth.currentUser$.subscribe((user) => {
      this._collectAvailableRoutes(user ? user : undefined);
    });
  }

  private _collectAvailableRoutes(user?: UserType) {
    let currentAvailable: Routes = [];
    routes.forEach((el) => {
      if (el.redirectTo === undefined && el.title != undefined) {
        if (el.data && el.data['roles']) {
          if (el.data['roles'].includes(user?.accountType)) {
            currentAvailable.push(el);
          } else {
            return;
          }
        } else {
          currentAvailable.push(el);
        }
      }
    });
    this.availableRoutes.next(currentAvailable);
  }

  public getTitleDisplay(title: string): string {
    return title.replace('Manga dot | ', '');
  }
}
