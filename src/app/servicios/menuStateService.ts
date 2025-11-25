// menu-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private componentToShow = new BehaviorSubject<string>('resumen');
  private menuCompactState = new BehaviorSubject<boolean>(false);

  currentComponent = this.componentToShow.asObservable();
  menuCompact$ = this.menuCompactState.asObservable();

  constructor() { }

  changeComponent(componentName: string) {
    this.componentToShow.next(componentName);
  }

  getCurrentComponent(): string {
    return this.componentToShow.value;
  }

  setMenuCompact(state: boolean) {
    this.menuCompactState.next(state);
  }

  getMenuCompact(): boolean {
    return this.menuCompactState.value;
  }
}