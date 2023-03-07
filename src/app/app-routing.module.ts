import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MangaBrowseComponent} from "./components/manga/manga-browse/manga-browse.component";

const routes: Routes = [
  { title: 'home', path: '', component: MangaBrowseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
