import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaFrontDisplayComponent } from './manga-front-display.component';

describe('MangaFrontDisplayComponent', () => {
  let component: MangaFrontDisplayComponent;
  let fixture: ComponentFixture<MangaFrontDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaFrontDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaFrontDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
