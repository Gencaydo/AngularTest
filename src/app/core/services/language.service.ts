import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type LanguageCode = 'tr' | 'en';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'app_language';
  
  readonly languages: Language[] = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];
  
  private languageSubject: BehaviorSubject<LanguageCode>;
  
  constructor() {
    // Get saved language from localStorage or default to Turkish
    const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY) as LanguageCode;
    const defaultLanguage: LanguageCode = savedLanguage || 'tr';
    
    this.languageSubject = new BehaviorSubject<LanguageCode>(defaultLanguage);
  }
  
  get currentLanguage$(): Observable<LanguageCode> {
    return this.languageSubject.asObservable();
  }
  
  get currentLanguage(): LanguageCode {
    return this.languageSubject.getValue();
  }
  
  get currentLanguageObj(): Language {
    return this.languages.find(lang => lang.code === this.currentLanguage) || this.languages[0];
  }
  
  setLanguage(languageCode: LanguageCode): void {
    localStorage.setItem(this.LANGUAGE_KEY, languageCode);
    this.languageSubject.next(languageCode);
  }
  
  getTranslation(key: string, params: Record<string, string> = {}): string {
    const translations = this.getTranslations();
    let translation = translations[key] || key;
    
    // Replace parameters in the translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  }
  
  private getTranslations(): Record<string, string> {
    return this.currentLanguage === 'tr' ? this.getTurkishTranslations() : this.getEnglishTranslations();
  }
  
  private getTurkishTranslations(): Record<string, string> {
    return {
      // Common
      'language': 'Dil',
      'login': 'Giriş',
      'logout': 'Çıkış',
      'register': 'Kayıt Ol',
      'profile': 'Profil',
      'home': 'Ana Sayfa',
      'save': 'Kaydet',
      'cancel': 'İptal',
      'clear': 'Temizle',
      'add': 'Ekle',
      'delete': 'Sil',
      'edit': 'Düzenle',
      'search': 'Ara',
      'filter': 'Filtrele',
      
      // Navigation
      'product_sales': 'Ürün Satışları',
      'periodic_report': 'Dönemsel Rapor',
      
      // Product Sales
      'product_sales_operations': 'Ürün Satış İşlemleri',
      'product_sales_description': 'Ürün satışlarını ekleyebilir ve yönetebilirsiniz.',
      'add_new_sale': 'Yeni Satış Ekle',
      'product': 'Ürün',
      'product_type': 'Ürün Tipi',
      'quantity': 'Miktar',
      'unit_price': 'Birim Fiyat',
      'total_amount': 'Toplam Tutar',
      'payment_method': 'Ödeme Yöntemi',
      'sale_date': 'Satış Tarihi',
      'shift': 'Vardiya',
      'cashier': 'Kasiyer',
      'select_product': 'Ürün Seçin',
      'select_product_type': 'Ürün Tipi Seçin',
      'select_payment_method': 'Ödeme Yöntemi Seçin',
      'select_shift': 'Vardiya Seçin',
      'select_cashier': 'Kasiyer Seçin',
      'add_sale': 'Satış Ekle',
      'sales_statistics': 'Satış İstatistikleri',
      'total_sales': 'Toplam Satışlar',
      'total_revenue': 'Toplam Gelir',
      
      // Periodic Report
      'periodic_report_filter': 'Dönemsel Rapor Filtresi',
      'periodic_report_description': 'Rapor kriterleri belirleyerek dönemsel raporları görüntüleyebilirsiniz.',
      'report_type': 'Rapor Tipi',
      'start_date': 'Başlangıç Tarihi',
      'end_date': 'Bitiş Tarihi',
      'include_all_branches': 'Tüm Şubeleri Dahil Et',
      'view_report': 'Raporu Görüntüle',
      'report_results': 'Rapor Sonuçları',
      
      // Profile
      'first_name': 'Ad',
      'last_name': 'Soyad',
      'email': 'E-posta',
      'mobile_phone': 'Cep Telefonu',
      'account_statistics': 'Hesap İstatistikleri',
      'member_since': 'Üyelik Başlangıcı',
      'last_updated': 'Son Güncelleme',
      'profile_updated': 'Profiliniz güncellendi',
      'success': 'Başarılı',
      
      // Validation Messages
      'required': 'Bu alan zorunludur',
      'please_select_product': 'Lütfen bir ürün seçin',
      'please_select_product_type': 'Lütfen bir ürün tipi seçin',
      'please_enter_valid_quantity': 'Geçerli bir miktar girin',
      'please_select_payment_method': 'Ödeme yöntemi seçin',
      'please_select_date': 'Tarih seçin',
      'please_select_shift': 'Vardiya seçin',
      'please_select_cashier': 'Kasiyer seçin'
    };
  }
  
  private getEnglishTranslations(): Record<string, string> {
    return {
      // Common
      'language': 'Language',
      'login': 'Login',
      'logout': 'Logout',
      'register': 'Register',
      'profile': 'Profile',
      'home': 'Home',
      'save': 'Save',
      'cancel': 'Cancel',
      'clear': 'Clear',
      'add': 'Add',
      'delete': 'Delete',
      'edit': 'Edit',
      'search': 'Search',
      'filter': 'Filter',
      
      // Navigation
      'product_sales': 'Product Sales',
      'periodic_report': 'Periodic Report',
      
      // Product Sales
      'product_sales_operations': 'Product Sales Operations',
      'product_sales_description': 'You can add and manage product sales.',
      'add_new_sale': 'Add New Sale',
      'product': 'Product',
      'product_type': 'Product Type',
      'quantity': 'Quantity',
      'unit_price': 'Unit Price',
      'total_amount': 'Total Amount',
      'payment_method': 'Payment Method',
      'sale_date': 'Sale Date',
      'shift': 'Shift',
      'cashier': 'Cashier',
      'select_product': 'Select Product',
      'select_product_type': 'Select Product Type',
      'select_payment_method': 'Select Payment Method',
      'select_shift': 'Select Shift',
      'select_cashier': 'Select Cashier',
      'add_sale': 'Add Sale',
      'sales_statistics': 'Sales Statistics',
      'total_sales': 'Total Sales',
      'total_revenue': 'Total Revenue',
      
      // Periodic Report
      'periodic_report_filter': 'Periodic Report Filter',
      'periodic_report_description': 'You can view periodic reports by setting report criteria.',
      'report_type': 'Report Type',
      'start_date': 'Start Date',
      'end_date': 'End Date',
      'include_all_branches': 'Include All Branches',
      'view_report': 'View Report',
      'report_results': 'Report Results',
      
      // Profile
      'first_name': 'First Name',
      'last_name': 'Last Name',
      'email': 'Email',
      'mobile_phone': 'Mobile Phone',
      'account_statistics': 'Account Statistics',
      'member_since': 'Member Since',
      'last_updated': 'Last Updated',
      'profile_updated': 'Your profile has been updated',
      'success': 'Success',
      
      // Validation Messages
      'required': 'This field is required',
      'please_select_product': 'Please select a product',
      'please_select_product_type': 'Please select a product type',
      'please_enter_valid_quantity': 'Please enter a valid quantity',
      'please_select_payment_method': 'Please select a payment method',
      'please_select_date': 'Please select a date',
      'please_select_shift': 'Please select a shift',
      'please_select_cashier': 'Please select a cashier'
    };
  }
} 