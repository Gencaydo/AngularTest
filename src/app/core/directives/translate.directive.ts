import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../services/language.service';

@Directive({
  selector: '[appTranslate]',
  standalone: true
})
export class TranslateDirective implements OnInit, OnChanges, OnDestroy {
  @Input('appTranslate') key: string = '';
  @Input('translateParams') params: Record<string, string> = {};
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private el: ElementRef,
    private languageService: LanguageService
  ) {}
  
  ngOnInit(): void {
    // Subscribe to language changes
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateTranslation();
      });
      
    // Initial translation
    this.updateTranslation();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['key'] || changes['params']) {
      this.updateTranslation();
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private updateTranslation(): void {
    if (this.key) {
      const translatedText = this.languageService.getTranslation(this.key, this.params);
      this.el.nativeElement.textContent = translatedText;
    }
  }
} 