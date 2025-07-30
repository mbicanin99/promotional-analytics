import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HamburgerToggleComponent } from './hamburger-toggle.component';

describe('HamburgerToggleComponent', () => {
  let component: HamburgerToggleComponent;
  let fixture: ComponentFixture<HamburgerToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HamburgerToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HamburgerToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
