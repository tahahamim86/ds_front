import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenmodalComponent } from './tokenmodal.component';

describe('TokenmodalComponent', () => {
  let component: TokenmodalComponent;
  let fixture: ComponentFixture<TokenmodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenmodalComponent]
    });
    fixture = TestBed.createComponent(TokenmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
