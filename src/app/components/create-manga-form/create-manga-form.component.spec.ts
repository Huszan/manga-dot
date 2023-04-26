import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMangaFormComponent } from './create-manga-form.component';

describe('CreateMangaFormComponent', () => {
  let component: CreateMangaFormComponent;
  let fixture: ComponentFixture<CreateMangaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMangaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMangaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
