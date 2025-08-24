import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatDonutComponent } from '../../shared/stat-donut/stat-donut.component';
import { TranslatePipe } from '../../i18n/t.pipe';

interface UsageStat {
  title: string;
  value: number;
  max: number;
  color: string;
  description: string;
}

interface ProjectTypeStats {
  type: string;
  count: number;
  percentage: number;
}

interface MonthlyStats {
  month: string;
  projectsCreated: number;
  projectsCompleted: number;
  activeUsers: number;
}

@Component({
  selector: 'app-uso',
  standalone: true,
  imports: [
    CommonModule,
    StatDonutComponent,
    TranslatePipe
  ],
  templateUrl: './uso.component.html',
  styleUrl: './uso.component.scss'
})
export class UsoComponent implements OnInit {
  
  // Estadísticas principales
  mainStats: UsageStat[] = [
    {
      title: 'uso.total_projects',
      value: 156,
      max: 200,
      color: '#3b3bff',
      description: 'uso.total_projects_desc'
    },
    {
      title: 'uso.active_projects',
      value: 89,
      max: 156,
      color: '#10b981',
      description: 'uso.active_projects_desc'
    },
    {
      title: 'uso.completed_projects',
      value: 67,
      max: 156,
      color: '#f59e0b',
      description: 'uso.completed_projects_desc'
    },
    {
      title: 'uso.avg_completion_time',
      value: 12,
      max: 30,
      color: '#ef4444',
      description: 'uso.avg_completion_time_desc'
    }
  ];

  // Estadísticas por tipo de proyecto
  projectTypeStats: ProjectTypeStats[] = [
    { type: 'uso.apartment_projects', count: 89, percentage: 57 },
    { type: 'uso.house_projects', count: 45, percentage: 29 },
    { type: 'uso.field_projects', count: 22, percentage: 14 }
  ];

  // Estadísticas mensuales
  monthlyStats: MonthlyStats[] = [
    { month: 'Ene', projectsCreated: 12, projectsCompleted: 8, activeUsers: 45 },
    { month: 'Feb', projectsCreated: 18, projectsCompleted: 15, activeUsers: 52 },
    { month: 'Mar', projectsCreated: 22, projectsCompleted: 19, activeUsers: 58 },
    { month: 'Abr', projectsCreated: 25, projectsCompleted: 21, activeUsers: 61 },
    { month: 'May', projectsCreated: 28, projectsCompleted: 24, activeUsers: 65 },
    { month: 'Jun', projectsCreated: 31, projectsCompleted: 27, activeUsers: 68 }
  ];

  // Estadísticas de uso de características
  featureUsageStats = {
    audioUploads: 234,
    imageUploads: 892,
    videoUploads: 156,
    pdfUploads: 89,
    totalFeatures: 45,
    averageFeaturesPerProject: 3.2
  };

  // Estadísticas de configuración
  configurationStats = {
    apartmentsConfigured: 445,
    floorsConfigured: 1234,
    bathroomsConfigured: 567,
    roomsConfigured: 890,
    terracesConfigured: 234
  };

  // Estadísticas de contenido
  contentStats = {
    carouselImages: 1234,
    featureDescriptions: 567,
    screenTitles: 156,
    briefDescriptions: 156
  };

  // Métricas de rendimiento
  performanceMetrics = {
    averageLoadTime: 2.3,
    uptime: 99.8,
    errorRate: 0.2,
    userSatisfaction: 4.6
  };

  ngOnInit() {
    // Aquí se podrían cargar datos reales desde un servicio
    console.log('Componente de estadísticas de uso inicializado');
  }

  getTotalProjects(): number {
    return this.mainStats[0].value;
  }

  getActiveProjects(): number {
    return this.mainStats[1].value;
  }

  getCompletionRate(): number {
    return Math.round((this.mainStats[2].value / this.mainStats[0].value) * 100);
  }

  getAverageFeaturesPerProject(): number {
    return this.featureUsageStats.averageFeaturesPerProject;
  }

  getMostUsedFeature(): string {
    const features = [
      { name: 'uso.image_uploads', count: this.featureUsageStats.imageUploads },
      { name: 'uso.audio_uploads', count: this.featureUsageStats.audioUploads },
      { name: 'uso.video_uploads', count: this.featureUsageStats.videoUploads },
      { name: 'uso.pdf_uploads', count: this.featureUsageStats.pdfUploads }
    ];
    
    return features.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    ).name;
  }

  getProjectTypeWithHighestCount(): string {
    return this.projectTypeStats.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    ).type;
  }

  getMonthlyGrowth(): number {
    const current = this.monthlyStats[this.monthlyStats.length - 1];
    const previous = this.monthlyStats[this.monthlyStats.length - 2];
    return Math.round(((current.projectsCreated - previous.projectsCreated) / previous.projectsCreated) * 100);
  }
}
