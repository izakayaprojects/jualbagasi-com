import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDestinationComponent } from './create-destination.component';

describe('CreateDestinationComponent', () => {
  let component: CreateDestinationComponent;
  let fixture: ComponentFixture<CreateDestinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDestinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
