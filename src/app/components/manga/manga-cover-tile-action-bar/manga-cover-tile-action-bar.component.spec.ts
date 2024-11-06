import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaCoverTileActionBarComponent } from './manga-cover-tile-action-bar.component';

describe('MangaCoverTileActionBarComponent', () => {
  let component: MangaCoverTileActionBarComponent;
  let fixture: ComponentFixture<MangaCoverTileActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaCoverTileActionBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaCoverTileActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
