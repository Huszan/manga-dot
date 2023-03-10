import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangaBrowseComponent } from './components/manga/manga-browse/manga-browse.component';

const routes: Routes = [
  { title: 'Manga dot | Home', path: 'home', component: MangaBrowseComponent },
  { title: 'Manga dot | Any', path: 'any', component: MangaBrowseComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  get availableRoutes() {
    return routes;
  }

  getTitleDisplay(title: string) {
    return title.replace('Manga dot | ', '');
  }
}
