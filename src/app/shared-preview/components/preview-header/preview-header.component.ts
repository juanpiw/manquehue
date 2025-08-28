import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMenuComponent, ProjectMenuConfig, Project } from '../project-menu/project-menu.component';

export interface PreviewHeaderConfig {
  logo?: string;
  title?: string;
  showMenu?: boolean;
  menuItems?: string[];
  projects?: Project[];
}

@Component({
  selector: 'app-preview-header',
  standalone: true,
  imports: [CommonModule, ProjectMenuComponent],
  templateUrl: './preview-header.component.html',
  styleUrls: ['./preview-header.component.scss']
})
export class PreviewHeaderComponent implements OnInit, OnDestroy {
  @Input() config: PreviewHeaderConfig = {
    logo: '',
    title: 'DashManqué',
    showMenu: false,
    menuItems: []
  };

  @Output() menuToggle = new EventEmitter<void>();
  @Output() logoClick = new EventEmitter<void>();
  @Output() projectSelect = new EventEmitter<Project>();

  // Project Menu State
  isProjectMenuOpen = false;

  // Scroll behavior state
  isHeaderVisible = true;
  lastScrollY = 0;
  scrollThreshold = 50; // Minimum scroll distance to trigger hide/show

  // Project Menu Configuration
  projectMenuConfig: ProjectMenuConfig = {
    projects: [],
    isOpen: false,
    title: 'Proyectos',
    showCloseButton: true,
    animationDuration: 300
  };

  onMenuToggle(): void {
    // Update project menu config with current projects
    this.projectMenuConfig.projects = this.config.projects || [];
    this.isProjectMenuOpen = true;
    this.projectMenuConfig.isOpen = true;
    this.menuToggle.emit();
  }

  onLogoClick(): void {
    this.logoClick.emit();
  }

  onProjectSelect(project: Project): void {
    this.isProjectMenuOpen = false;
    this.projectMenuConfig.isOpen = false;
    this.projectSelect.emit(project);
  }

  onProjectMenuClose(): void {
    this.isProjectMenuOpen = false;
    this.projectMenuConfig.isOpen = false;
  }

  ngOnInit(): void {
    this.lastScrollY = window.scrollY;
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const currentScrollY = window.scrollY;
    
    // Header visible only at the very top
    if (currentScrollY <= 0) {
      this.isHeaderVisible = true;
    } else {
      this.isHeaderVisible = false;
    }
    
    this.lastScrollY = currentScrollY;
  }
}

