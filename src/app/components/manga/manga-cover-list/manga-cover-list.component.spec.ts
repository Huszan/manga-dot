import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaCoverListComponent } from './manga-cover-list.component';

describe('MangaCoverListComponent', () => {
  let component: MangaCoverListComponent;
  let fixture: ComponentFixture<MangaCoverListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaCoverListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaCoverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
