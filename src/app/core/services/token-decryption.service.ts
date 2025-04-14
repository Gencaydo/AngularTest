import { Injectable } from '@angular/core';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';
import { mode, pad } from 'crypto-js';

interface WordArray {
  toString(encoder?: any): string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private static readonly encryptionKey = 'doyouwannacreateaspecialky190219';

  static decryptToken(token: string): string {
    try {
      const [iv, encryptedData] = token.split(':');
      if (!iv || !encryptedData) {
        throw new Error('Invalid token format');
      }

      const bytes = AES.decrypt(encryptedData, Utf8.parse(TokenService.encryptionKey), {
        iv: Base64.parse(iv),
        mode: mode.CBC,
        padding: pad.Pkcs7
      });

      return bytes.toString(Utf8);
    } catch (error) {
      console.error('Failed to decrypt token:', error);
      return '';
    }
  }
}