import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpKeyFeaturesComponent } from './fp-key-features.component';

describe('FpKeyFeaturesComponent', () => {
  let component: FpKeyFeaturesComponent;
  let fixture: ComponentFixture<FpKeyFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpKeyFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpKeyFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
