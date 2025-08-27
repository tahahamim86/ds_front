
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespiratoryDiagnosisComponent } from './respiratory-diagnosis.component';

describe('RespiratoryDiagnosisComponent', () => {
  let component: RespiratoryDiagnosisComponent;
  let fixture: ComponentFixture<RespiratoryDiagnosisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RespiratoryDiagnosisComponent]
    });
    fixture = TestBed.createComponent(RespiratoryDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
