import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAccountsComponent } from './store-accounts.component';

describe('StoreAccountsComponent', () => {
  let component: StoreAccountsComponent;
  let fixture: ComponentFixture<StoreAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
