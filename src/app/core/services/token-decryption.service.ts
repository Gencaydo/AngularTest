import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

declare module 'crypto-js' {
  interface WordArray {
    toString(encoder?: any): string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private static readonly encryptionKey = 'YourStrongEncryptionKey123';

  static decryptToken(token: string): string {
    try {
      const [iv, encryptedData] = token.split(':');
      if (!iv || !encryptedData) {
        throw new Error('Invalid token format');
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(TokenService.encryptionKey), {
        iv: CryptoJS.enc.Base64.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Failed to decrypt token:', error);
      return '';
    }
  }
}