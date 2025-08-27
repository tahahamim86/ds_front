import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardiologyDiagnosisComponent } from './cardiology-diagnosis.component';

describe('CardiologyDiagnosisComponent', () => {
  let component: CardiologyDiagnosisComponent;
  let fixture: ComponentFixture<CardiologyDiagnosisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardiologyDiagnosisComponent]
    });
    fixture = TestBed.createComponent(CardiologyDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
