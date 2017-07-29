import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleProgressComponent } from './schedule-progress.component';

describe('ScheduleProgressComponent', () => {
  let component: ScheduleProgressComponent;
  let fixture: ComponentFixture<ScheduleProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
