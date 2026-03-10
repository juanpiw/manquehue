import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '../../i18n/t.pipe';

@Component({
  selector: 'app-live-preview',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslatePipe],
  templateUrl: './live-preview.component.html',
  styleUrl: './live-preview.component.scss'
})
export class LivePreviewComponent implements OnInit {
  
  previewData: any = {
    title: 'common.preview_live_title',
    description: 'common.preview_live_description',
    status: 'active',
    lastUpdate: new Date()
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('Live Preview Component initialized');
  }

  updatePreview(data: any) {
    this.previewData = { ...this.previewData, ...data };
    this.previewData.lastUpdate = new Date();
  }

  getStatusClass(): string {
    return this.previewData.status === 'active' ? 'status-active' : 'status-inactive';
  }

  getFormattedDate(): string {
    return this.previewData.lastUpdate.toLocaleString();
  }

  getStatusText(): string {
    return this.previewData.status === 'active' ? 'common.preview_status_active' : 'common.preview_status_inactive';
  }

  goToDashboard(): void {
    this.router.navigateByUrl('/dash');
  }
}
