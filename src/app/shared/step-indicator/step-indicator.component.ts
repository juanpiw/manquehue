import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

export interface Step {
  id: number;
  title: string;
  description?: string;
  completed?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './step-indicator.component.html',
  styleUrl: './step-indicator.component.scss'
})
export class StepIndicatorComponent {
  @Input() title: string = 'common.step_title';
  @Input() steps: Step[] = [];
  @Input() currentStep: number = 1;
  @Input() showTitle: boolean = true;
  @Input() clickable: boolean = true;
  @Input() maxSteps: number = 5;

  @Output() stepChange = new EventEmitter<number>();
  @Output() stepClick = new EventEmitter<Step>();

  constructor() {
    // Inicializar pasos por defecto si no se proporcionan
    if (this.steps.length === 0) {
      this.steps = this.generateDefaultSteps();
    }
  }

  ngOnInit() {
    // Asegurar que los pasos estén inicializados
    if (this.steps.length === 0) {
      this.steps = this.generateDefaultSteps();
    }
  }

  private generateDefaultSteps(): Step[] {
    const steps: Step[] = [];
    for (let i = 1; i <= this.maxSteps; i++) {
      steps.push({
        id: i,
        title: `common.step_${i}`,
        completed: i < this.currentStep,
        disabled: i > this.currentStep
      });
    }
    return steps;
  }

  onStepClick(step: Step) {
    if (!this.clickable || step.disabled) {
      return;
    }

    this.currentStep = step.id;
    this.updateStepsState();
    this.stepClick.emit(step);
    this.stepChange.emit(step.id);
  }

  private updateStepsState() {
    this.steps.forEach(step => {
      step.completed = step.id < this.currentStep;
      step.disabled = step.id > this.currentStep;
    });
  }

  isStepActive(step: Step): boolean {
    return step.id === this.currentStep;
  }

  isStepCompleted(step: Step): boolean {
    return step.completed || false;
  }

  isStepDisabled(step: Step): boolean {
    return step.disabled || false;
  }

  // Métodos públicos para control externo
  goToStep(stepNumber: number) {
    if (stepNumber >= 1 && stepNumber <= this.steps.length) {
      this.currentStep = stepNumber;
      this.updateStepsState();
      this.stepChange.emit(stepNumber);
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length) {
      this.goToStep(this.currentStep + 1);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  }

  completeStep(stepNumber: number) {
    const step = this.steps.find(s => s.id === stepNumber);
    if (step) {
      step.completed = true;
    }
  }

  trackByStepId(index: number, step: Step): number {
    return step.id;
  }
}
