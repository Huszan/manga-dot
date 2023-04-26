import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaChapterComponent } from './manga-chapter.component';

describe('MangaChapterComponent', () => {
  let component: MangaChapterComponent;
  let fixture: ComponentFixture<MangaChapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaChapterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
