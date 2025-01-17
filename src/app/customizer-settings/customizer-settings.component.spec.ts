import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizerSettingsComponent } from './customizer-settings.component';

describe('CustomizerSettingsComponent', () => {
  let component: CustomizerSettingsComponent;
  let fixture: ComponentFixture<CustomizerSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizerSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
