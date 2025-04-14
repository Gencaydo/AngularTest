import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Language, LanguageCode, LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../directives/translate.pipe';
import { TranslateDirective } from '../../directives/translate.directive';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateDirective, ClickOutsideDirective],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  isDropdownOpen = false;
  languages: Language[] = [];
  currentLanguage: Language;
  
  constructor(private languageService: LanguageService) {
    this.languages = this.languageService.languages;
    this.currentLanguage = this.languageService.currentLanguageObj;
  }
  
  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(code => {
      this.currentLanguage = this.languageService.languages.find(lang => lang.code === code) || this.languages[0];
    });
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
  
  changeLanguage(code: LanguageCode): void {
    this.languageService.setLanguage(code);
    this.closeDropdown();
  }
} 