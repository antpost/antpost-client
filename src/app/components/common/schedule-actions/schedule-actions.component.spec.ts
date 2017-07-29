import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleActionsComponent } from './schedule-actions.component';

describe('ScheduleActionsComponent', () => {
  let component: ScheduleActionsComponent;
  let fixture: ComponentFixture<ScheduleActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
