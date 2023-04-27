import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MangaBrowseComponent } from './components/manga/manga-browse/manga-browse.component';
import { MangaService } from './services/data/manga.service';
import { MangaHttpService } from './services/http/manga-http.service';
import { HttpClientModule } from '@angular/common/http';
import { MangaFrontDisplayComponent } from './components/manga/manga-front-display/manga-front-display.component';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from './components/nav/navbar/navbar.component';
import { SidenavComponent } from './components/nav/sidenav/sidenav.component';
import { HomeComponent } from './components/home/home.component';
import { MangaDisplayComponent } from './components/manga/manga-display/manga-display.component';
import { MangaChapterComponent } from './components/manga/manga-chapter/manga-chapter.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CreateMangaFormComponent } from './components/create-manga-form/create-manga-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullScreenLoaderComponent } from './components/global/full-screen-loader/full-screen-loader.component';

@NgModule({
  declarations: [
    AppComponent,
    MangaBrowseComponent,
    MangaFrontDisplayComponent,
    NavbarComponent,
    SidenavComponent,
    HomeComponent,
    MangaDisplayComponent,
    MangaChapterComponent,
    CreateMangaFormComponent,
    FullScreenLoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    HttpClientModule,
    MatCardModule,
    DragDropModule,
    MatListModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  providers: [MangaService, MangaHttpService],
  bootstrap: [AppComponent],
})
export class AppModule {}
