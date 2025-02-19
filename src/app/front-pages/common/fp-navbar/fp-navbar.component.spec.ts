import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpNavbarComponent } from './fp-navbar.component';

describe('FpNavbarComponent', () => {
  let component: FpNavbarComponent;
  let fixture: ComponentFixture<FpNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
