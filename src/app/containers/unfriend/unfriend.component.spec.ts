import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfriendComponent } from './unfriend.component';

describe('UnfriendComponent', () => {
  let component: UnfriendComponent;
  let fixture: ComponentFixture<UnfriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfriendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
