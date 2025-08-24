import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

export interface ProjectTag {
  id: string;
  name: string;
  status?: 'active' | 'inactive' | 'loading';
  isSelected?: boolean;
}

@Component({
  selector: 'app-project-tag',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './project-tag.component.html',
  styleUrl: './project-tag.component.scss'
})
export class ProjectTagComponent {
  @Input() project!: ProjectTag;
  @Input() disabled: boolean = false;
  @Input() showEdit: boolean = true;
  @Input() showDelete: boolean = true;
  @Input() editTooltip: string = 'common.project_tag_edit';
  @Input() deleteTooltip: string = 'common.project_tag_delete';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'default' | 'outlined' | 'filled' = 'default';
  
  @Output() edit = new EventEmitter<ProjectTag>();
  @Output() delete = new EventEmitter<ProjectTag>();
  @Output() select = new EventEmitter<ProjectTag>();

  onEdit(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      this.edit.emit(this.project);
    }
  }

  onDelete(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      this.delete.emit(this.project);
    }
  }

  onSelect() {
    if (!this.disabled) {
      this.select.emit(this.project);
    }
  }

  getProjectName(): string {
    return this.project.name || 'common.project_tag_unnamed';
  }

  getStatusClass(): string {
    if (this.project.status === 'loading') return 'loading';
    if (this.project.status === 'active') return 'active';
    if (this.project.isSelected) return 'selected';
    return '';
  }
}
