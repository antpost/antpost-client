import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFriendsSearchingComponent } from './account-friends-searching.component';

describe('AccountFriendsSearchingComponent', () => {
  let component: AccountFriendsSearchingComponent;
  let fixture: ComponentFixture<AccountFriendsSearchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountFriendsSearchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountFriendsSearchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
