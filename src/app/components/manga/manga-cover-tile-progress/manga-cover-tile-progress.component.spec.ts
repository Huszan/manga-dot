import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaCoverTileProgressComponent } from './manga-cover-tile-progress.component';

describe('MangaCoverTileProgressComponent', () => {
  let component: MangaCoverTileProgressComponent;
  let fixture: ComponentFixture<MangaCoverTileProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MangaCoverTileProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MangaCoverTileProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
