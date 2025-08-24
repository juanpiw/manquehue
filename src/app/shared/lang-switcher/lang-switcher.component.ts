import { Component } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  template: `
    <button class="lang" type="button" (click)="toggle()">
      {{ i18n.lang() === 'es' ? 'Esp' : 'Eng' }}
    </button>
  `,
  styles: [`
    .lang{
      background:#f3f4f6; border:1px solid #e5e7eb; border-radius:999px;
      padding:6px 12px; cursor:pointer; font:inherit;
    }
  `]
})
export class LangSwitcherComponent {
  constructor(public i18n: I18nService) {}
  toggle(){ this.i18n.setLang(this.i18n.lang()==='es' ? 'en' : 'es'); }
}
