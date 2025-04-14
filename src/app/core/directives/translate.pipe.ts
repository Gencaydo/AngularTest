import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Impure pipe to update when language changes
})
export class TranslatePipe implements PipeTransform {
  constructor(private languageService: LanguageService) {}
  
  transform(key: string, params: Record<string, string> = {}): string {
    return this.languageService.getTranslation(key, params);
  }
} 