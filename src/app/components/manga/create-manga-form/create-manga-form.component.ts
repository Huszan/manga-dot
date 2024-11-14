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
import { MangaHttpService } from '../../../services/http/manga-http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScrapMangaType } from 'src/app/types/scrap-manga.type';
import { ScrapperHttpServiceService } from 'src/app/services/http/scrapper-http-service.service';
import { MangaType } from 'src/app/types/manga.type';
import { ServerResponse } from 'src/app/types/server-response.type';

@Component({
  selector: 'app-create-manga-form',
  templateUrl: './create-manga-form.component.html',
  styleUrls: ['./create-manga-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMangaFormComponent {
  form!: FormGroup;

  lastTestedForm: MangaType | undefined = undefined;
  isLoading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _scrapperHttpService: ScrapperHttpServiceService,
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
      tags: this._fb.array([]),
      description: [''],

      chapterNameLocate: this._fb.group({
        positions: this._fb.array([], Validators.required),
        lookedType: ['a', Validators.required],
        lookedAttribute: ['content', Validators.required],
        urls: this._fb.array([], Validators.required),
      }),

      chapterUrlLocate: this._fb.group({
        positions: this._fb.array([], Validators.required),
        lookedType: ['a', Validators.required],
        lookedAttribute: ['href', Validators.required],
        urls: this._fb.array([], Validators.required),
      }),

      pagesLocate: this._fb.group({
        positions: this._fb.array([], Validators.required),
        lookedType: ['img', Validators.required],
        lookedAttribute: ['src', Validators.required],
        urls: this._fb.array([], Validators.required),
      }),
    });
    this.addPagesLocatePosition('');
    this.addPagesLocateUrl('');
    this.addArrayEntry(
      this.getFormArray(this.chapterNameLocate, 'positions'),
      ''
    );
    this.addArrayEntry(this.getFormArray(this.chapterNameLocate, 'urls'), '');
    this.addArrayEntry(
      this.getFormArray(this.chapterUrlLocate, 'positions'),
      ''
    );
    this.addArrayEntry(this.getFormArray(this.chapterUrlLocate, 'urls'), '');
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

  newAuthor(value?: string): FormGroup {
    return this._fb.group({
      name: value ? value : '',
    });
  }

  addAuthor(value?: string) {
    this.authors.push(this.newAuthor(value));
  }

  removeAuthor(index: number) {
    this.authors.removeAt(index);
  }

  get tags() {
    return this.form.get('tags') as FormArray;
  }

  newTag(value?: string): FormGroup {
    return this._fb.group({
      name: value ? value : '',
    });
  }

  addTag(value?: string) {
    this.tags.push(this.newTag(value));
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  get description() {
    return this.form.get('description') as FormControl;
  }

  get pagesLocate() {
    return this.form.get('pagesLocate') as FormGroup;
  }

  get pagesLocatePositions() {
    return this.pagesLocate.get('positions') as FormArray;
  }

  newPagesLocatePosition(value = ''): FormGroup {
    return this._fb.group({
      name: [value, Validators.required],
    });
  }

  addPagesLocatePosition(value = '') {
    this.pagesLocatePositions.push(this.newPagesLocatePosition(value));
  }

  removePagesLocatePosition(index: number) {
    this.pagesLocatePositions.removeAt(index);
  }

  get pagesLocateLookedType() {
    return this.pagesLocate.get('lookedType') as FormControl;
  }

  get pagesLocateLookedAttribute() {
    return this.pagesLocate.get('lookedAttribute') as FormControl;
  }

  get pagesLocateUrls() {
    return this.pagesLocate.get('urls') as FormArray;
  }

  newPagesLocateUrl(value = ''): FormGroup {
    return this._fb.group({
      name: [value, Validators.required],
    });
  }

  addPagesLocateUrl(value = '') {
    this.pagesLocateUrls.push(this.newPagesLocateUrl(value));
  }

  removePagesLocateUrl(index: number) {
    this.pagesLocateUrls.removeAt(index);
  }

  get chapterNameLocate(): FormGroup {
    return this.form.get('chapterNameLocate') as FormGroup;
  }

  get chapterUrlLocate(): FormGroup {
    return this.form.get('chapterUrlLocate') as FormGroup;
  }

  getFormControl(group: FormGroup, key: string): FormControl {
    return group.get(key) as FormControl;
  }

  getFormArray(group: FormGroup, key: string): FormArray {
    return group.get(key) as FormArray;
  }

  newArrayEntry(value: any): FormGroup {
    return this._fb.group({
      name: [value, Validators.required],
    });
  }

  addArrayEntry(array: FormArray, value: any) {
    array.push(this.newArrayEntry(value));
  }

  removeArrayEntry(array: FormArray, i: number) {
    array.removeAt(i);
  }

  formArrayToArray(formArray: FormArray): any[] {
    const array: any[] = [];
    formArray.controls.forEach((group) => {
      array.push(group.value.name);
    });
    return array;
  }

  get formData(): ScrapMangaType {
    return {
      name: this.name.value,
      authors: this.formArrayToArray(this.authors),
      description: this.description.value,
      tags: this.formArrayToArray(this.tags),
      pic: this.picture.value,

      chaptersScrap: {
        nameLocate: {
          positions: this.formArrayToArray(
            this.getFormArray(this.chapterNameLocate, 'positions')
          ),
          lookedType: this.getFormControl(this.chapterNameLocate, 'lookedType')
            .value,
          lookedAttr: this.getFormControl(
            this.chapterNameLocate,
            'lookedAttribute'
          ).value,
          urls: this.formArrayToArray(
            this.getFormArray(this.chapterNameLocate, 'urls')
          ),
        },
        urlLocate: {
          positions: this.formArrayToArray(
            this.getFormArray(this.chapterUrlLocate, 'positions')
          ),
          lookedType: this.getFormControl(this.chapterUrlLocate, 'lookedType')
            .value,
          lookedAttr: this.getFormControl(
            this.chapterUrlLocate,
            'lookedAttribute'
          ).value,
          urls: this.formArrayToArray(
            this.getFormArray(this.chapterUrlLocate, 'urls')
          ),
        },
      },
      pagesLocate: {
        positions: this.formArrayToArray(this.pagesLocatePositions),
        lookedType: this.pagesLocateLookedType.value,
        lookedAttr: this.pagesLocateLookedAttribute.value,
        urls: this.formArrayToArray(this.pagesLocateUrls),
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
    this.isLoading = true;
    this._scrapperHttpService.scrapManga(this.formData).subscribe((res) => {
      this.isLoading = false;
      this.lastTestedForm = res.data as MangaType;
      this.displayTestSnackbar(res);
      this._cdr.detectChanges();
    });
  }

  displayTestSnackbar(res: ServerResponse) {
    if (res.status === 'success') {
      this._snackbar.open(
        'Testing successful. Click submit to add manga to database!',
        'Close',
        { duration: 8000 }
      );
    } else {
      this._snackbar.open(
        res.message ? res.message : `Testing unsuccessful`,
        'Close'
      );
    }
  }

  onSubmit() {
    if (!this.lastTestedForm) {
      return;
    }
    this.isLoading = true;
    this._mangaHttpService.postManga(this.lastTestedForm).subscribe((res) => {
      if (res.status === 'success') {
        this._snackbar.open('Successfully added manga to database!', 'Close', {
          duration: 8000,
        });
        this.clearForm();
      } else {
        this._snackbar.open(
          res.message ? res.message : 'Something went wrong. Try again later',
          'Close',
          {
            duration: 8000,
          }
        );
      }
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }
}
