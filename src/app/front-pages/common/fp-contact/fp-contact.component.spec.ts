import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpContactComponent } from './fp-contact.component';

describe('FpContactComponent', () => {
  let component: FpContactComponent;
  let fixture: ComponentFixture<FpContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
