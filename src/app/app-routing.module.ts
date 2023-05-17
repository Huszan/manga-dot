import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangaDisplayComponent } from './components/manga/manga-display/manga-display.component';
import { MangaChapterComponent } from './components/manga/manga-chapter/manga-chapter.component';
import { CreateMangaFormComponent } from './components/manga/create-manga-form/create-manga-form.component';
import { LoginFormComponent } from './components/auth/login-form/login-form.component';
import { RegisterFormComponent } from './components/auth/register-form/register-form.component';
import { ActivateAccountComponent } from './components/auth/activate-account/activate-account.component';
import { HomeViewComponent } from './components/views/home-view/home-view.component';
import { MangaBrowseComponent } from './components/manga/manga-browse/manga-browse.component';

const routes: Routes = [
  {
    title: 'Manga dot | Home',
    path: '',
    pathMatch: 'full',
    component: HomeViewComponent,
  },
  {
    title: 'Manga dot | Browse',
    path: 'manga/browse',
    pathMatch: 'full',
    component: MangaBrowseComponent,
  },
  {
    title: 'Manga dot | Add new',
    path: 'manga/add',
    pathMatch: 'full',
    component: CreateMangaFormComponent,
  },
  {
    path: 'manga/:id',
    component: MangaDisplayComponent,
  },
  {
    path: 'manga/:id/:chapter',
    component: MangaChapterComponent,
  },
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: 'register',
    component: RegisterFormComponent,
  },
  {
    path: 'activate',
    component: ActivateAccountComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  availableRoutes: Routes = [];

  get homeRoute() {
    return this.availableRoutes[0];
  }

  constructor() {
    this._collectAvailableRoutes();
  }

  private _collectAvailableRoutes() {
    routes.forEach((el) => {
      if (el.redirectTo === undefined && el.title != undefined) {
        this.availableRoutes.push(el);
      }
    });
  }

  public getTitleDisplay(title: string): string {
    return title.replace('Manga dot | ', '');
  }
}
