import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAccountsFormComponent } from './store-accounts-form.component';

describe('StoreAccountsFormComponent', () => {
  let component: StoreAccountsFormComponent;
  let fixture: ComponentFixture<StoreAccountsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAccountsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAccountsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
