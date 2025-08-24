import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-donut',
  standalone: true,
  imports: [NgIf],
  templateUrl: './stat-donut.component.html',
  styleUrl: './stat-donut.component.scss'
})
export class StatDonutComponent {
 @Input() title = 'Total de proyectos';
  @Input() value = 0;
  @Input() max = 10;
  @Input() size = 140;
  @Input() thickness = 12;
  @Input() track = '#d8d8de';
  @Input() bar = '#3b3bff';
  @Input() showFraction = true;

  get r() { const t = Math.max(1, Math.min(this.thickness, 30)); return 50 - t / 2; }
  get c() { return 2 * Math.PI * this.r; }
  get ratio() { return this.max <= 0 ? 0 : Math.max(0, Math.min(1, this.value / this.max)); }
  get dash() { return `${this.c * this.ratio} ${this.c * (1 - this.ratio)}`; }
}
