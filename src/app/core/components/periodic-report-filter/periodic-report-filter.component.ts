import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter, faCalendar, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TranslateDirective } from '../../directives/translate.directive';
import { TranslatePipe } from '../../directives/translate.pipe';

@Component({
  selector: 'app-periodic-report-filter',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    FontAwesomeModule,
    TranslateDirective,
    TranslatePipe
  ],
  templateUrl: './periodic-report-filter.component.html',
  styleUrls: ['./periodic-report-filter.component.scss']
})
export class PeriodicReportFilterComponent implements OnInit {
  faFilter = faFilter;
  faCalendar = faCalendar;
  faSearch = faSearch;

  filterForm: FormGroup;
  reportTypes = [
    { id: 1, name: 'Satış Raporu' },
    { id: 2, name: 'Stok Raporu' },
    { id: 3, name: 'Müşteri Raporu' },
    { id: 4, name: 'Finans Raporu' }
  ];

  constructor() {
    this.filterForm = new FormGroup({
      reportType: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      includeAllBranches: new FormControl(false)
    });
  }

  ngOnInit(): void {
    // Set default dates
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.filterForm.patchValue({
      startDate: this.formatDate(firstDayOfMonth),
      endDate: this.formatDate(today)
    });
  }

  onSubmit(): void {
    if (this.filterForm.valid) {
      const formData = this.filterForm.value;
      console.log('Generating report with filters:', formData);
      // Here you would typically call a service to generate the report
    } else {
      this.filterForm.markAllAsTouched();
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
