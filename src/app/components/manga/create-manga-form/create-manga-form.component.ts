import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
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
import { HtmlLocateType } from 'src/app/types/html-locate.type';
import { exportJsonFile, importJsonFile } from 'src/app/utils/fm.utils';
import {
  SessionStoreService,
  StoreItem,
} from 'src/app/services/session-store.service';

@Component({
  selector: 'app-create-manga-form',
  templateUrl: './create-manga-form.component.html',
  styleUrls: ['./create-manga-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMangaFormComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  form!: FormGroup;

  lastTestedForm: MangaType | undefined = undefined;
  isLoading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _scrapperHttpService: ScrapperHttpServiceService,
    private _mangaHttpService: MangaHttpService,
    private _sessionStoreService: SessionStoreService,
    private _cdr: ChangeDetectorRef,
    private _snackbar: MatSnackBar
  ) {
    const lastData = _sessionStoreService.getItem(StoreItem.MANGA_FORM_DATA);
    this._initForm(lastData);
    this.form.valueChanges.subscribe(() => {
      _sessionStoreService.setItem(StoreItem.MANGA_FORM_DATA, this.formData);
    });
  }

  private _initForm(lastData?: ScrapMangaType) {
    this.form = this._fb.group({
      name: [lastData ? lastData.name : '', Validators.required],
      picture: [lastData ? lastData.pic : '', Validators.required],
      authors: this._fb.array([]),
      tags: this._fb.array([]),
      description: [lastData ? lastData.description : ''],
      beforeUrl: [lastData ? lastData.beforeUrl : ''],

      chapterNameLocate: this._fb.group({
        positions: this._fb.array([], Validators.required),
        lookedType: [
          lastData ? lastData.chaptersScrap.nameLocate.lookedType : 'a',
          Validators.required,
        ],
        lookedAttribute: [
          lastData ? lastData.chaptersScrap.nameLocate.lookedAttr : 'content',
          Validators.required,
        ],
        urls: this._fb.array([], Validators.required),
      }),

      chapterUrlLocate: this._fb.group({
        positions: this._fb.array([], Validators.required),
        lookedType: [
          lastData ? lastData.chaptersScrap.urlLocate.lookedType : 'a',
          Validators.required,
        ],
        lookedAttribute: [
          lastData ? lastData.chaptersScrap.urlLocate.lookedAttr : 'href',
          Validators.required,
        ],
        urls: this._fb.array([], Validators.required),
      }),

      pagesLocate: this._fb.group({
        positions: this._fb.array([], Validators.required),
        lookedType: [
          lastData ? lastData.pagesLocate.lookedType : 'img',
          Validators.required,
        ],
        lookedAttribute: [
          lastData ? lastData.pagesLocate.lookedAttr : 'src',
          Validators.required,
        ],
        urls: this._fb.array([], Validators.required),
      }),
    });
    this.loadArray(this.authors, lastData?.authors);
    this.loadArray(this.tags, lastData?.tags);
    this.loadArray(
      this.getFormArray(this.pagesLocate, 'positions'),
      lastData?.pagesLocate.positions
    );
    this.loadArray(
      this.getFormArray(this.pagesLocate, 'urls'),
      lastData?.pagesLocate.urls
    );
    this.loadArray(
      this.getFormArray(this.chapterNameLocate, 'positions'),
      lastData?.chaptersScrap.nameLocate.positions
    );
    this.loadArray(
      this.getFormArray(this.chapterNameLocate, 'urls'),
      lastData?.chaptersScrap.nameLocate.urls
    );
    this.loadArray(
      this.getFormArray(this.chapterUrlLocate, 'positions'),
      lastData?.chaptersScrap.urlLocate.positions
    );
    this.loadArray(
      this.getFormArray(this.chapterUrlLocate, 'urls'),
      lastData?.chaptersScrap.urlLocate.urls
    );
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  loadArray(array: FormArray, lastArray?: Array<any>) {
    if (lastArray) {
      lastArray.forEach((el) => this.addArrayEntry(array, el));
    } else if (this.hasValidator(array, Validators.required)) {
      this.addArrayEntry(array, '');
    }
  }

  hasValidator(
    control: AbstractControl | null,
    validator: any
  ): boolean | null {
    if (!control || !control.validator) return false;

    const validatorFn = control.validator({} as AbstractControl);
    return validatorFn && validatorFn.hasOwnProperty(validator.name);
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

  get tags() {
    return this.form.get('tags') as FormArray;
  }

  get description() {
    return this.form.get('description') as FormControl;
  }

  get beforeUrl() {
    return this.form.get('beforeUrl') as FormControl;
  }

  get pagesLocate() {
    return this.form.get('pagesLocate') as FormGroup;
  }

  get pagesLocatePositions() {
    return this.pagesLocate.get('positions') as FormArray;
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
      beforeUrl: this.beforeUrl.value,
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
    this._sessionStoreService.removeItem(StoreItem.MANGA_FORM_DATA);
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

  importData(data: ScrapMangaType) {
    this.name.setValue(data.name);
    this.picture.setValue(data.pic);
    data.authors.forEach((author) => this.addArrayEntry(this.authors, author));
    data.tags.forEach((tag) => this.addArrayEntry(this.tags, tag));
    this.description.setValue(data.description);
    this.beforeUrl.setValue(data.beforeUrl);
    this.importLocate(data.pagesLocate, this.pagesLocate);
    this.importLocate(data.chaptersScrap.nameLocate, this.chapterNameLocate);
    this.importLocate(data.chaptersScrap.urlLocate, this.chapterUrlLocate);
  }

  importLocate(data: HtmlLocateType, group: FormGroup) {
    this.getFormControl(group, 'lookedType').setValue(data.lookedType);
    this.getFormControl(group, 'lookedAttribute').setValue(data.lookedAttr);
    this.getFormArray(group, 'positions').clear();
    data.positions.forEach((pos) =>
      this.addArrayEntry(this.getFormArray(group, 'positions'), pos)
    );
    this.getFormArray(group, 'urls').clear();
    data.urls.forEach((url) =>
      this.addArrayEntry(this.getFormArray(group, 'urls'), url)
    );
  }

  onImport(e: Event) {
    importJsonFile(e, (res: ScrapMangaType | null) => {
      if (res === null) return;
      this.importData(res);
    });
  }

  onExport() {
    exportJsonFile(this.formData, 'manga-data');
  }
}
