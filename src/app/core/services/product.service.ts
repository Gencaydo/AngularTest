import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ProductType } from '../models/product-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'api/products'; // API endpoint

  // Örnek ürün tipleri (gerçek API bağlantısı olmadığında kullanılır)
  private mockProductTypes: ProductType[] = [
    { id: 1, name: 'Laptop', price: 12500, category: 'Elektronik', stock: 15 },
    { id: 2, name: 'Akıllı Telefon', price: 8000, category: 'Elektronik', stock: 25 },
    { id: 3, name: 'Bluetooth Kulaklık', price: 750, category: 'Aksesuar', stock: 50 },
    { id: 4, name: 'Kablosuz Mouse', price: 350, category: 'Bilgisayar Donanımı', stock: 30 },
    { id: 5, name: 'Kamera', price: 3500, category: 'Elektronik', stock: 10 },
  ];

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductType[]> {
    // Gerçek API bağlantısı:
    // return this.http.get<ProductType[]>(this.apiUrl);
    
    // Mock veri dönüşü:
    return of(this.mockProductTypes);
  }

  getProductById(id: number): Observable<ProductType> {
    // Gerçek API bağlantısı:
    // return this.http.get<ProductType>(`${this.apiUrl}/${id}`);
    
    // Mock veri dönüşü:
    const productType = this.mockProductTypes.find(p => p.id === id);
    return of(productType as ProductType);
  }

  addProduct(productType: ProductType): Observable<ProductType> {
    // Gerçek API bağlantısı:
    // return this.http.post<ProductType>(this.apiUrl, productType);
    
    // Mock veri dönüşü:
    const newProductType = { ...productType, id: this.mockProductTypes.length + 1 };
    this.mockProductTypes.push(newProductType);
    return of(newProductType);
  }

  updateProduct(productType: ProductType): Observable<ProductType> {
    // Gerçek API bağlantısı:
    // return this.http.put<ProductType>(`${this.apiUrl}/${productType.id}`, productType);
    
    // Mock veri dönüşü:
    const index = this.mockProductTypes.findIndex(p => p.id === productType.id);
    if (index !== -1) {
      this.mockProductTypes[index] = productType;
    }
    return of(productType);
  }

  deleteProduct(id: number): Observable<void> {
    // Gerçek API bağlantısı:
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    
    // Mock veri dönüşü:
    const index = this.mockProductTypes.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProductTypes.splice(index, 1);
    }
    return of(void 0);
  }
} 