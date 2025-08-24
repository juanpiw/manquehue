import { Injectable, computed, effect, signal } from '@angular/core';
import { ES } from './es';
import { EN } from './en';

type Lang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private storageKey = 'lang';
  private hasWindow = typeof window !== 'undefined';

  // lee lang persistido o 'es'
  private initial = (this.hasWindow ? (localStorage.getItem(this.storageKey) as Lang) : null) || 'es';
  lang = signal<Lang>(this.initial);

  dict = computed(() => (this.lang() === 'es' ? ES : EN));

  constructor() {
    // persistir y actualizar <html lang="">
    effect(() => {
      const l = this.lang();
      if (this.hasWindow) {
        localStorage.setItem(this.storageKey, l);
        document.documentElement.lang = l;
      }
    });
  }

  setLang(l: Lang) { this.lang.set(l); }

  t(path: string, params?: Record<string, any>): string {
    // acceso 'namespace.clave'
    const segs = path.split('.');
    let node: any = this.dict() as any;
    for (const s of segs) node = node?.[s];
    let str = (node ?? path) as string;
    // interpolación básica: {{name}}
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
      }
    }
    return str;
  }
}
