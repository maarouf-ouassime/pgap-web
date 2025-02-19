import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpWidgetsComponent } from './fp-widgets.component';

describe('FpWidgetsComponent', () => {
  let component: FpWidgetsComponent;
  let fixture: ComponentFixture<FpWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpWidgetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
