import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupAndLoginComponent } from './signup-and-login.component';

describe('SignupAndLoginComponent', () => {
  let component: SignupAndLoginComponent;
  let fixture: ComponentFixture<SignupAndLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupAndLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupAndLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
