import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDocsComponent } from './medical-docs.component';

describe('MedicalDocsComponent', () => {
  let component: MedicalDocsComponent;
  let fixture: ComponentFixture<MedicalDocsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalDocsComponent]
    });
    fixture = TestBed.createComponent(MedicalDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
