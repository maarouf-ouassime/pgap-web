import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TRANSLATIONS } from './translations';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translate = inject(TranslateService);

  constructor() {
    const savedLang = localStorage.getItem('lang') || 'en';

    // Charger les traductions en mémoire
    this.translate.setTranslation('en', TRANSLATIONS.en);
    this.translate.setTranslation('fr', TRANSLATIONS.fr);

    // Définir la langue par défaut
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
