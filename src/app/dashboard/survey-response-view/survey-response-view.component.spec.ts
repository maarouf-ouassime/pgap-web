import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyResponseViewComponent } from './survey-response-view.component';

describe('SurveyResponseViewComponent', () => {
  let component: SurveyResponseViewComponent;
  let fixture: ComponentFixture<SurveyResponseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyResponseViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyResponseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
