import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaCoverTileProgressBarComponent } from './manga-cover-tile-progress-bar.component';

describe('MangaCoverTileProgressBarComponent', () => {
  let component: MangaCoverTileProgressBarComponent;
  let fixture: ComponentFixture<MangaCoverTileProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaCoverTileProgressBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaCoverTileProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
