import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWDocComponent } from './chat-w-doc.component';

describe('ChatWDocComponent', () => {
  let component: ChatWDocComponent;
  let fixture: ComponentFixture<ChatWDocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatWDocComponent]
    });
    fixture = TestBed.createComponent(ChatWDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
