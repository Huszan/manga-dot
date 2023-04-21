import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangaBrowseComponent } from './components/manga/manga-browse/manga-browse.component';
import { HomeComponent } from './components/home/home.component';
import { MangaDisplayComponent } from './components/manga/manga-display/manga-display.component';

const routes: Routes = [
  { title: 'Manga dot | Home', path: 'home', component: HomeComponent },
  {
    title: 'Manga dot | Add new',
    path: 'add',
    component: MangaBrowseComponent,
  },
  {
    path: 'manga/:id',
    component: MangaDisplayComponent,
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
        el.title = this._getTitleDisplay(String(el.title));
        this.availableRoutes.push(el);
      }
    });
  }

  private _getTitleDisplay(title: string): string {
    return title.replace('Manga dot | ', '');
  }
}
