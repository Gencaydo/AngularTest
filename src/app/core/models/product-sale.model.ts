import { ProductType } from './product-type';

export interface ProductSale {
  id: number;
  productType: ProductType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  saleDate: Date;
  period: string;
  cashier: string;
}

export enum Period {
  DAILY = 'Günlük',
  WEEKLY = 'Haftalık',
  MONTHLY = 'Aylık',
  YEARLY = 'Yıllık'
} 