// menu-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private componentToShow = new BehaviorSubject<string>('resumen');

  currentComponent = this.componentToShow.asObservable();

  constructor() { }

  changeComponent(componentName: string) {
    this.componentToShow.next(componentName);
  }

  getCurrentComponent(): string {
    return this.componentToShow.value;
  }
}