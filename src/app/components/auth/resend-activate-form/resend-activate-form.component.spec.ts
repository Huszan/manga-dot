import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendActivateFormComponent } from './resend-activate-form.component';

describe('ResendActivateFormComponent', () => {
  let component: ResendActivateFormComponent;
  let fixture: ComponentFixture<ResendActivateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendActivateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendActivateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
