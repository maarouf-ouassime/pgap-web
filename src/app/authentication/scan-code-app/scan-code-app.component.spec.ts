import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanCodeAppComponent } from './scan-code-app.component';

describe('ScanCodeAppComponent', () => {
  let component: ScanCodeAppComponent;
  let fixture: ComponentFixture<ScanCodeAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanCodeAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanCodeAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
