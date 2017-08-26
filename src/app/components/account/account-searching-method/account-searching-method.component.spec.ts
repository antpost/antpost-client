import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSearchingMethodComponent } from './account-searching-method.component';

describe('AccountSearchingMethodComponent', () => {
  let component: AccountSearchingMethodComponent;
  let fixture: ComponentFixture<AccountSearchingMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSearchingMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSearchingMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
