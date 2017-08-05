import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupJoiningComponent } from './group-joining.component';

describe('GroupJoiningComponent', () => {
  let component: GroupJoiningComponent;
  let fixture: ComponentFixture<GroupJoiningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupJoiningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupJoiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
