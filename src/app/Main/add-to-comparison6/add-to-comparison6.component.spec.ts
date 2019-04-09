import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToComparison6Component } from './add-to-comparison6.component';

describe('AddToComparison6Component', () => {
  let component: AddToComparison6Component;
  let fixture: ComponentFixture<AddToComparison6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToComparison6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToComparison6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
