import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type LandingFeatureResource = {
  fileId: number | null;
  displayName: string;
  originalName: string;
  url: string;
  type: 'image' | 'video';
  pending: boolean;
};

@Component({
  selector: 'app-landing-feature-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing-feature-manager.component.html',
  styleUrl: './landing-feature-manager.component.scss'
})
export class LandingFeatureManagerComponent {
  @Input() items: LandingFeatureResource[] = [];
  @Output() rename = new EventEmitter<LandingFeatureResource>();
  @Output() remove = new EventEmitter<LandingFeatureResource>();
}
