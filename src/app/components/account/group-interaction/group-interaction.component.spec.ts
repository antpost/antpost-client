import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInteractionComponent } from './group-interaction.component';

describe('GroupInteractionComponent', () => {
  let component: GroupInteractionComponent;
  let fixture: ComponentFixture<GroupInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
