import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSelectionComponent } from './account-selection.component';

describe('AccountSelectionComponent', () => {
  let component: AccountSelectionComponent;
  let fixture: ComponentFixture<AccountSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
