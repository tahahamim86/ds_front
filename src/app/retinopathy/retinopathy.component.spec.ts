import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetinopathyComponent } from './retinopathy.component';

describe('RetinopathyComponent', () => {
  let component: RetinopathyComponent;
  let fixture: ComponentFixture<RetinopathyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetinopathyComponent]
    });
    fixture = TestBed.createComponent(RetinopathyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
