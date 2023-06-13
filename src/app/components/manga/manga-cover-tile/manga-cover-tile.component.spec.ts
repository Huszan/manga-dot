import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaCoverTileComponent } from './manga-cover-tile.component';

describe('MangaCoverTileComponent', () => {
  let component: MangaCoverTileComponent;
  let fixture: ComponentFixture<MangaCoverTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaCoverTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaCoverTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
