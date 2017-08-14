import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendSelectionComponent } from './friend-selection.component';

describe('FriendSelectionComponent', () => {
  let component: FriendSelectionComponent;
  let fixture: ComponentFixture<FriendSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
