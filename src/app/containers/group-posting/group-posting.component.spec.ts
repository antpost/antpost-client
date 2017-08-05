import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPostingComponent } from './group-posting.component';

describe('GroupPostingComponent', () => {
  let component: GroupPostingComponent;
  let fixture: ComponentFixture<GroupPostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
