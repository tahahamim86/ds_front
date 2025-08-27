import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattechComponent } from './chattech.component';

describe('ChattechComponent', () => {
  let component: ChattechComponent;
  let fixture: ComponentFixture<ChattechComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChattechComponent]
    });
    fixture = TestBed.createComponent(ChattechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
