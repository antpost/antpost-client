import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostInteractionComponent } from './post-interaction.component';

describe('PostInteractionComponent', () => {
  let component: PostInteractionComponent;
  let fixture: ComponentFixture<PostInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
