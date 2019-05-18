import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditTextComponent } from './dialog-edit-text.component';

describe('DialogEditTextComponent', () => {
  let component: DialogEditTextComponent;
  let fixture: ComponentFixture<DialogEditTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
