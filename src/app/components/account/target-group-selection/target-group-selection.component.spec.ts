import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetGroupSelectionComponent } from './target-group-selection.component';

describe('TargetGroupSelectionComponent', () => {
  let component: TargetGroupSelectionComponent;
  let fixture: ComponentFixture<TargetGroupSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetGroupSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetGroupSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
