import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
export interface ProjectItem {
  id: string | number;
  name: string;
}
@Component({
  selector: 'app-projects-created',
  standalone: true,
  imports: [NgIf,NgForOf],
  templateUrl: './projects-created.component.html',
  styleUrl: './projects-created.component.scss'
})
export class ProjectsCreatedComponent {
@Input() title = 'Proyectos creados';
  @Input() items: ProjectItem[] = [];
  @Input() loading = false;
  @Input() limit: number | null = null;
  @Output() open = new EventEmitter<ProjectItem>();

  skeletons = [1, 2, 3, 4];

  get visibleItems(): ProjectItem[] {
    const src = this.items ?? [];
    return this.limit ? src.slice(0, this.limit) : src;
  }

  trackById(index: number, p: ProjectItem) {
    return p?.id ?? index; // clave única estable
  }
}
