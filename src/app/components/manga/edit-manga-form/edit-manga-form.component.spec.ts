import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMangaFormComponent } from './edit-manga-form.component';

describe('EditMangaFormComponent', () => {
  let component: EditMangaFormComponent;
  let fixture: ComponentFixture<EditMangaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMangaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMangaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
