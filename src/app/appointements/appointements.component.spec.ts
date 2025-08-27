import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointementsComponent } from './appointements.component';

describe('AppointementsComponent', () => {
  let component: AppointementsComponent;
  let fixture: ComponentFixture<AppointementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointementsComponent]
    });
    fixture = TestBed.createComponent(AppointementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
