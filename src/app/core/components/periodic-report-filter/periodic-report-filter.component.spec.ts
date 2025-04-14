import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicReportFilterComponent } from './periodic-report-filter.component';

describe('PeriodicReportFilterComponent', () => {
  let component: PeriodicReportFilterComponent;
  let fixture: ComponentFixture<PeriodicReportFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodicReportFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodicReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
