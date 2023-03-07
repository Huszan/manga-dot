import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaBrowseComponent } from './manga-browse.component';

describe('MangaBrowseComponent', () => {
  let component: MangaBrowseComponent;
  let fixture: ComponentFixture<MangaBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaBrowseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
