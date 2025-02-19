import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpTestimonialsComponent } from './fp-testimonials.component';

describe('FpTestimonialsComponent', () => {
  let component: FpTestimonialsComponent;
  let fixture: ComponentFixture<FpTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpTestimonialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
