import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeToggle } from './mode-toggle';

describe('ModeToggle', () => {
  let component: ModeToggle;
  let fixture: ComponentFixture<ModeToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ModeToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
