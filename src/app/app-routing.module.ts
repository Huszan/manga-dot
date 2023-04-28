import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangaBrowseComponent } from './components/manga/manga-browse/manga-browse.component';
import { MangaDisplayComponent } from './components/manga/manga-display/manga-display.component';
import { MangaChapterComponent } from './components/manga/manga-chapter/manga-chapter.component';
import { CreateMangaFormComponent } from './components/manga/create-manga-form/create-manga-form.component';

const routes: Routes = [
  {
    title: 'Manga dot | Browse',
    path: '',
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
