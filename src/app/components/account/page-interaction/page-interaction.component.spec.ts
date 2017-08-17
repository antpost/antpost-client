import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInteractionComponent } from './page-interaction.component';

describe('PageInteractionComponent', () => {
  let component: PageInteractionComponent;
  let fixture: ComponentFixture<PageInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
