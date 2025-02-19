import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontPagesComponent } from './front-pages.component';

describe('FrontPagesComponent', () => {
  let component: FrontPagesComponent;
  let fixture: ComponentFixture<FrontPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
