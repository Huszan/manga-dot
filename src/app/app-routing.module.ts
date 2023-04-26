import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangaBrowseComponent } from './components/manga/manga-browse/manga-browse.component';
import { HomeComponent } from './components/home/home.component';
import { MangaDisplayComponent } from './components/manga/manga-display/manga-display.component';
import { MangaChapterComponent } from './components/manga/manga-chapter/manga-chapter.component';
import { CreateMangaFormComponent } from './components/create-manga-form/create-manga-form.component';

const routes: Routes = [
  { title: 'Manga dot | Browse', path: 'home', component: HomeComponent },
  {
    title: 'Manga dot | Add new',
    path: 'add',
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
  { path: '**', redirectTo: 'home' },
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
