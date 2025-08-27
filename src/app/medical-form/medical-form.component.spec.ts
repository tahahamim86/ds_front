
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFormComponent } from './medical-form.component';

describe('MedicalFormComponent', () => {
  let component: MedicalFormComponent;
  let fixture: ComponentFixture<MedicalFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalFormComponent]
    });
    fixture = TestBed.createComponent(MedicalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
