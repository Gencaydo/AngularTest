import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductType } from '../../models/product-type';
import { ProductService } from '../../services/product.service';
import { ProductSale } from '../../models/product-sale.model';
import { TranslateDirective } from '../../directives/translate.directive';
import { TranslatePipe } from '../../directives/translate.pipe';

interface PeriodReport {
  period: string;
  totalSales: number;
  cashSales: number;
  creditCardSales: number;
  totalAmount: number;
  cashAmount: number;
  creditCardAmount: number;
}

@Component({
  selector: 'app-product-sales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateDirective, TranslatePipe],
  templateUrl: './product-sales.component.html',
  styleUrls: ['./product-sales.component.scss']
})
export class ProductSalesComponent implements OnInit, OnDestroy {
  salesForm: FormGroup;
  filterForm: FormGroup;
  
  sales: ProductSale[] = [];
  filteredSales: ProductSale[] = [];
  productTypes: ProductType[] = [];
  
  periods: string[] = ['Sabah', 'Öğle', 'Akşam', 'Gece'];
  cashiers: string[] = ['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Çelik'];
  paymentMethods: string[] = ['Nakit', 'Kredi Kartı', 'Banka Kartı', 'Havale/EFT'];
  
  showPeriodReport: boolean = false;
  periodReport: ProductSale[] = [];
  selectedPeriod: string = '';
  
  // Statistics for the stats card
  get totalSales(): number {
    return this.sales.length;
  }
  
  get totalRevenue(): number {
    return this.sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  }
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.salesForm = this.fb.group({
      productType: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [{ value: 0, disabled: true }],
      totalPrice: [{ value: 0, disabled: true }],
      paymentMethod: ['Nakit', Validators.required],
      saleDate: [new Date(), Validators.required],
      period: ['', Validators.required],
      cashier: ['', Validators.required]
    });

    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      period: [''],
      cashier: [''],
      paymentMethod: ['']
    });
  }

  ngOnInit(): void {
    this.loadProductTypes();
    
    // Subscribe to form value changes to calculate total price
    this.subscriptions.add(
      this.salesForm.valueChanges.subscribe(() => {
        this.calculateTotal();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProductTypes(): void {
    this.productService.getProducts().subscribe({
      next: (productTypes: ProductType[]) => {
        this.productTypes = productTypes;
        if (productTypes.length > 0) {
          this.salesForm.patchValue({
            productType: productTypes[0]
          });
        }
      },
      error: (err: any) => {
        console.error('Error loading product types', err);
      }
    });
  }

  onProductChange(): void {
    const selectedProductType = this.salesForm.get('productType')?.value;
    if (selectedProductType) {
      this.salesForm.patchValue({
        unitPrice: selectedProductType.price
      });
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    const quantity = this.salesForm.get('quantity')?.value || 0;
    const unitPrice = this.salesForm.get('unitPrice')?.value || 0;
    this.salesForm.patchValue({
      totalPrice: quantity * unitPrice
    }, { emitEvent: false });
  }
  
  addSale(): void {
    if (this.salesForm.invalid) {
      return;
    }
    
    const formValues = this.salesForm.getRawValue();
    const newSale: ProductSale = {
      id: this.sales.length > 0 ? Math.max(...this.sales.map(sale => sale.id)) + 1 : 1,
      productType: formValues.productType,
      quantity: formValues.quantity,
      unitPrice: formValues.unitPrice,
      totalPrice: formValues.totalPrice,
      paymentMethod: formValues.paymentMethod,
      saleDate: formValues.saleDate,
      period: formValues.period,
      cashier: formValues.cashier
    };
    
    this.sales.push(newSale);
    this.resetForm();
    this.applyFilter();
  }
  
  resetForm(): void {
    this.salesForm.reset({
      quantity: 1,
      paymentMethod: 'Nakit',
      saleDate: new Date()
    });
    
    // Ürün tipi seçimi varsa, ilk ürün tipini seç
    if (this.productTypes.length > 0) {
      this.salesForm.patchValue({
        productType: this.productTypes[0]
      });
      this.onProductChange();
    }
  }
  
  deleteSale(index: number): void {
    this.sales.splice(index, 1);
    this.applyFilter();
  }
  
  // Filtreleme işlemleri
  applyFilter(): void {
    // Tüm filtreleri al
    const filters = this.filterForm.value;
    
    // Tüm satışları filtreleme
    const filteredSales = this.sales.filter(sale => {
      // Tarih filtresi
      if (filters.startDate && new Date(sale.saleDate) < new Date(filters.startDate)) {
        return false;
      }
      
      if (filters.endDate && new Date(sale.saleDate) > new Date(filters.endDate)) {
        return false;
      }
      
      // Dönem filtresi
      if (filters.period && sale.period !== filters.period) {
        return false;
      }
      
      // Kasiyer filtresi
      if (filters.cashier && sale.cashier !== filters.cashier) {
        return false;
      }
      
      // Ödeme yöntemi filtresi
      if (filters.paymentMethod && sale.paymentMethod !== filters.paymentMethod) {
        return false;
      }
      
      return true;
    });
    
    // Filtrelenmiş satışları dönemlik rapor olarak tanımla
    this.periodReport = filteredSales;
    this.showPeriodReport = true;
    
    // Seçilen dönem bilgisini ayarla
    if (filters.period) {
      this.selectedPeriod = filters.period;
    } else if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate).toLocaleDateString();
      const end = new Date(filters.endDate).toLocaleDateString();
      this.selectedPeriod = `${start} - ${end}`;
    } else {
      this.selectedPeriod = 'Tüm Satışlar';
    }
  }

  resetFilter(): void {
    this.filterForm.reset();
  }

  closePeriodReport(): void {
    this.showPeriodReport = false;
  }

  // Rapor özeti hesaplama
  getTotalSales(): number {
    return this.periodReport.length;
  }

  getTotalAmount(): number {
    return this.periodReport.reduce((sum, sale) => sum + sale.totalPrice, 0);
  }

  getTotalQuantity(): number {
    return this.periodReport.reduce((sum, sale) => sum + sale.quantity, 0);
  }

  // Para formatı
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
  }
}

