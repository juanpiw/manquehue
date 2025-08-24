import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

export interface ProjectType {
  id: string;
  label: string;
  labelKey: string;
}

@Component({
  selector: 'app-project-type-selector',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './project-type-selector.component.html',
  styleUrl: './project-type-selector.component.scss'
})
export class ProjectTypeSelectorComponent {
  @Input() title: string = 'Tipo de proyecto';
  @Input() titleKey: string = 'common.project_type';
  @Input() selectedType: string = 'house';
  @Input() showTitle: boolean = true;
  @Input() disabled: boolean = false;
  
  @Output() typeChange = new EventEmitter<string>();
  @Output() typeSelect = new EventEmitter<ProjectType>();

  projectTypes: ProjectType[] = [
    {
      id: 'house',
      label: 'Casa',
      labelKey: 'common.project_type_house'
    },
    {
      id: 'apartment',
      label: 'Departamento',
      labelKey: 'common.project_type_apartment'
    },
    {
      id: 'field',
      label: 'Cancha/Áreas Libres',
      labelKey: 'common.project_type_field'
    }
  ];

  onTypeSelect(type: ProjectType) {
    if (this.disabled) return;
    
    this.selectedType = type.id;
    this.typeChange.emit(type.id);
    this.typeSelect.emit(type);
  }

  isSelected(type: ProjectType): boolean {
    return this.selectedType === type.id;
  }

  getTitle(): string {
    return this.titleKey || this.title;
  }
}

