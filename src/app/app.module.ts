import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from './components/nav/navbar/navbar.component';
import { SidenavComponent } from './components/nav/sidenav/sidenav.component';
import { MangaDisplayComponent } from './components/manga/manga-display/manga-display.component';
import { MangaChapterComponent } from './components/manga/manga-chapter/manga-chapter.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CreateMangaFormComponent } from './components/manga/create-manga-form/create-manga-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FullScreenLoaderComponent } from './components/global/full-screen-loader/full-screen-loader.component';
import { MatSliderModule } from '@angular/material/slider';
import { LoginFormComponent } from './components/auth/login-form/login-form.component';
import { RegisterFormComponent } from './components/auth/register-form/register-form.component';
import { ActivateAccountComponent } from './components/auth/activate-account/activate-account.component';
import { ResendActivateFormComponent } from './components/auth/resend-activate-form/resend-activate-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ForgotPasswordDialogComponent } from './components/auth/forgot-password-dialog/forgot-password-dialog.component';
import { HomeViewComponent } from './components/views/home-view/home-view.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthGuard } from './services/auth-guard.service';
import { MangaCoverListComponent } from './components/manga/manga-cover-list/manga-cover-list.component';
import { MangaCoverTileComponent } from './components/manga/manga-cover-tile/manga-cover-tile.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MangaSearchBarComponent } from './components/manga/manga-search-bar/manga-search-bar.component';
import { ContactFormComponent } from './components/views/contact-form/contact-form.component';
import { FooterComponent } from './components/nav/footer/footer.component';
import { MangaCarouselComponent } from './components/manga/manga-carousel/manga-carousel.component';
import { InViewDirective } from './directives/in-view.directive';
import { ReadMoreComponent } from './components/global/read-more/read-more.component';
import { MangaCoverTileProgressComponent } from './components/manga/manga-cover-tile-progress/manga-cover-tile-progress.component';
import { AuthService } from './services/data/auth.service';
import { ConfirmDialogComponent } from './components/global/confirm-dialog/confirm-dialog.component';
import { MangaCoverTileActionBarComponent } from './components/manga/manga-cover-tile-action-bar/manga-cover-tile-action-bar.component';
import { MangaCoverTileProgressBarComponent } from './components/manga/manga-cover-tile-progress-bar/manga-cover-tile-progress-bar.component';
import { ExpendableContentDirective } from './directives/expendable-content.directive';
import { EditMangaFormComponent } from './components/manga/edit-manga-form/edit-manga-form.component';
import { ImageContainerComponent } from './components/global/image-container/image-container.component';
import { HorizontalScrollDirective } from './directives/horizontal-scroll.directive';

function initializeApp(authService: AuthService) {
  return () => authService.initialize();
}

@NgModule({
  declarations: [
    AppComponent,
    MangaBrowseComponent,
    NavbarComponent,
    SidenavComponent,
    MangaDisplayComponent,
    MangaChapterComponent,
    CreateMangaFormComponent,
    EditMangaFormComponent,
    FullScreenLoaderComponent,
    LoginFormComponent,
    RegisterFormComponent,
    ActivateAccountComponent,
    ResendActivateFormComponent,
    ForgotPasswordDialogComponent,
    HomeViewComponent,
    MangaCoverListComponent,
    MangaCoverTileComponent,
    MangaSearchBarComponent,
    ContactFormComponent,
    FooterComponent,
    MangaCarouselComponent,
    InViewDirective,
    ReadMoreComponent,
    MangaCoverTileProgressComponent,
    ConfirmDialogComponent,
    MangaCoverTileActionBarComponent,
    MangaCoverTileProgressBarComponent,
    ExpendableContentDirective,
    ImageContainerComponent,
    HorizontalScrollDirective,
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
    MatSliderModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatPaginatorModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [
    MangaService,
    MangaHttpService,
    AuthGuard,
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
