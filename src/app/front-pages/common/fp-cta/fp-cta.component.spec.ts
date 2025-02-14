import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpCtaComponent } from './fp-cta.component';

describe('FpCtaComponent', () => {
  let component: FpCtaComponent;
  let fixture: ComponentFixture<FpCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpCtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
