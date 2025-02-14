import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpFaqComponent } from './fp-faq.component';

describe('FpFaqComponent', () => {
  let component: FpFaqComponent;
  let fixture: ComponentFixture<FpFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpFaqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
