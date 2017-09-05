import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeFriendComponent } from './make-friend.component';

describe('MakeFriendComponent', () => {
  let component: MakeFriendComponent;
  let fixture: ComponentFixture<MakeFriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeFriendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
