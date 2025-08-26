import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Project {
  id: string;
  name: string;
  active?: boolean;
}

export interface ProjectMenuConfig {
  projects: Project[];
  isOpen: boolean;
  title?: string;
  showCloseButton?: boolean;
  animationDuration?: number;
}

@Component({
  selector: 'app-project-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-menu.component.html',
  styleUrls: ['./project-menu.component.scss']
})
export class ProjectMenuComponent {
  @Input() config: ProjectMenuConfig = {
    projects: [],
    isOpen: false,
    title: 'Proyectos',
    showCloseButton: true,
    animationDuration: 300
  };

  @Output() projectSelect = new EventEmitter<Project>();
  @Output() closeMenu = new EventEmitter<void>();

  onProjectClick(project: Project): void {
    this.projectSelect.emit(project);
  }

  onCloseClick(): void {
    this.closeMenu.emit();
  }

  onOverlayClick(event: Event): void {
    // Only close if clicking the overlay itself, not its children
    if (event.target === event.currentTarget) {
      this.closeMenu.emit();
    }
  }

  trackByProject(index: number, project: Project): string {
    return project.id;
  }
}

