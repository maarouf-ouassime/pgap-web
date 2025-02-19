import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpBannerComponent } from './fp-banner.component';

describe('FpBannerComponent', () => {
  let component: FpBannerComponent;
  let fixture: ComponentFixture<FpBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
