import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaCarouselComponent } from './manga-carousel.component';

describe('MangaCarouselComponent', () => {
  let component: MangaCarouselComponent;
  let fixture: ComponentFixture<MangaCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaCarouselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
