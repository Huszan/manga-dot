import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MangaHttpService } from '../../services/http/manga-http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-manga-form',
  templateUrl: './create-manga-form.component.html',
  styleUrls: ['./create-manga-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMangaFormComponent {
  form!: FormGroup;

  lastTestedForm: any | undefined = undefined;
  isLoading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _mangaHttpService: MangaHttpService,
    private _cdr: ChangeDetectorRef,
    private _snackbar: MatSnackBar
  ) {
    this._initForm();
  }

  private _initForm() {
    this.form = this._fb.group({
      name: ['', Validators.required],
      picture: ['', Validators.required],
      authors: this._fb.array([]),
      genres: this._fb.array([]),
      description: [''],
      startingChapter: ['1', Validators.required],
      chapterCount: ['1', Validators.required],
      htmlLocate: this._fb.group({
        positions: this._fb.array([], Validators.required),
        lookedType: [{ value: 'img', disabled: true }, Validators.required],
        lookedAttribute: [
          { value: 'src', disabled: true },
          Validators.required,
        ],
        urls: this._fb.array([], Validators.required),
      }),
    });
    this.addPosition();
    this.addUrl();
  }

  getControlGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  get picture() {
    return this.form.get('picture') as FormControl;
  }

  get authors() {
    return this.form.get('authors') as FormArray;
  }

  newAuthor(): FormGroup {
    return this._fb.group({
      name: '',
    });
  }

  addAuthor() {
    this.authors.push(this.newAuthor());
  }

  removeAuthor(index: number) {
    this.authors.removeAt(index);
  }

  get genres() {
    return this.form.get('genres') as FormArray;
  }

  newGenre(): FormGroup {
    return this._fb.group({
      name: '',
    });
  }

  addGenre() {
    this.genres.push(this.newGenre());
  }

  removeGenre(index: number) {
    this.genres.removeAt(index);
  }

  get description() {
    return this.form.get('description') as FormControl;
  }

  get startingChapter() {
    return this.form.get('startingChapter') as FormControl;
  }

  get chapterCount() {
    return this.form.get('chapterCount') as FormControl;
  }

  get htmlLocate() {
    return this.form.get('htmlLocate') as FormGroup;
  }

  get positions() {
    return this.htmlLocate.get('positions') as FormArray;
  }

  newPosition(): FormGroup {
    return this._fb.group({
      name: ['', Validators.required],
    });
  }

  addPosition() {
    this.positions.push(this.newPosition());
  }

  removePosition(index: number) {
    this.positions.removeAt(index);
  }

  get lookedType() {
    return this.htmlLocate.get('lookedType') as FormControl;
  }

  get lookedAttribute() {
    return this.htmlLocate.get('lookedAttribute') as FormControl;
  }

  get urls() {
    return this.htmlLocate.get('urls') as FormArray;
  }

  newUrl(): FormGroup {
    return this._fb.group({
      name: ['', Validators.required],
    });
  }

  addUrl() {
    this.urls.push(this.newUrl());
  }

  removeUrl(index: number) {
    this.urls.removeAt(index);
  }

  formArrayToArray(formArray: FormArray): any[] {
    const array: any[] = [];
    formArray.controls.forEach((group) => {
      array.push(group.value.name);
    });
    return array;
  }

  get formData() {
    return {
      name: this.name.value,
      authors: this.formArrayToArray(this.authors),
      chapterCount: this.chapterCount.value,
      description: this.description.value,
      genres: this.formArrayToArray(this.genres),
      pic: this.picture.value,
      startingChapter: this.startingChapter.value,
      htmlLocate: {
        positions: this.formArrayToArray(this.positions),
        lookedType: this.lookedType.value,
        lookedAttr: this.lookedAttribute.value,
        urls: this.formArrayToArray(this.urls),
      },
    };
  }

  get isFormValid() {
    return this.form.valid;
  }

  clearForm() {
    this._initForm();
    this.lastTestedForm = undefined;
  }

  onTest() {
    let testedForm = this.formData;
    this.isLoading = true;
    this._mangaHttpService.testMangaForm(testedForm).subscribe((res) => {
      if (!res.success) {
        let message = 'Testing unsuccessful. ';
        if ('failedChapters' in res) {
          message += `Failed on chapters: ${JSON.stringify(
            res.failedChapters
          )}`;
        }
        this._snackbar.open(message, 'Ok');
      } else {
        this.lastTestedForm = testedForm;
        this._snackbar.open(
          'Testing successful. Click submit to add manga to database!',
          'Ok'
        );
      }
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }

  onSubmit() {
    if (!this.lastTestedForm) {
      return;
    }
    this.isLoading = true;
    this._mangaHttpService.postManga(this.lastTestedForm).subscribe((res) => {
      if (res.success) {
        this._snackbar.open('Successfully added manga to database!', 'Ok');
        this.clearForm();
      } else {
        this._snackbar.open('Something went wrong. Try again later', 'Ok');
      }
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }
}
