import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaDisplayComponent } from './manga-display.component';

describe('MangaDisplayComponent', () => {
  let component: MangaDisplayComponent;
  let fixture: ComponentFixture<MangaDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
