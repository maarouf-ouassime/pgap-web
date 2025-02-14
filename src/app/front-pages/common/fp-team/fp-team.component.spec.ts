import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpTeamComponent } from './fp-team.component';

describe('FpTeamComponent', () => {
  let component: FpTeamComponent;
  let fixture: ComponentFixture<FpTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
