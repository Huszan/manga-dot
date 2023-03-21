import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangaBrowseComponent } from './components/manga/manga-browse/manga-browse.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { title: 'Manga dot | Home', path: 'home', component: HomeComponent },
  {
    title: 'Manga dot | Add new',
    path: 'add',
    component: MangaBrowseComponent,
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  get homeRoute() {
    return routes[0];
  }

  get availableRoutes() {
    return routes;
  }

  getTitleDisplay(title: string) {
    return title.replace('Manga dot | ', '');
  }
}
