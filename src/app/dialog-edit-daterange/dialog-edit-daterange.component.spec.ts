import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditDaterangeComponent } from './dialog-edit-daterange.component';

describe('DialogEditDaterangeComponent', () => {
  let component: DialogEditDaterangeComponent;
  let fixture: ComponentFixture<DialogEditDaterangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditDaterangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditDaterangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
