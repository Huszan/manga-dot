import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaSearchBarComponent } from './manga-search-bar.component';

describe('MangaSearchBarComponent', () => {
  let component: MangaSearchBarComponent;
  let fixture: ComponentFixture<MangaSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
