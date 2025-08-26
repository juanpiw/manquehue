import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface VideoTransitionState {
  currentSection: number;
  isTransitioning: boolean;
  previousSection?: number;
  transitionProgress: number;
}

@Injectable({
  providedIn: 'root'
})
export class VideoTransitionService {
  private transitionState = new BehaviorSubject<VideoTransitionState>({
    currentSection: 0,
    isTransitioning: false,
    transitionProgress: 0
  });

  private videoElements: HTMLVideoElement[] = [];
  private transitionDuration = 1000; // ms

  constructor() {}

  // Observable para el estado de transición
  getTransitionState(): Observable<VideoTransitionState> {
    return this.transitionState.asObservable();
  }

  // Registrar elementos de video
  registerVideoElements(elements: HTMLVideoElement[]): void {
    this.videoElements = elements;
  }

  // Transición a una nueva sección
  async transitionToSection(targetIndex: number): Promise<void> {
    if (targetIndex < 0 || targetIndex >= this.videoElements.length) {
      console.error('Invalid video section index:', targetIndex);
      return;
    }

    const currentState = this.transitionState.value;
    const currentIndex = currentState.currentSection;

    if (currentIndex === targetIndex) {
      return; // Ya estamos en esa sección
    }

    // Iniciar transición
    this.transitionState.next({
      ...currentState,
      isTransitioning: true,
      previousSection: currentIndex,
      transitionProgress: 0
    });

    try {
      // Pausar video actual
      if (this.videoElements[currentIndex]) {
        this.videoElements[currentIndex].pause();
      }

      // Preparar video objetivo
      const targetVideo = this.videoElements[targetIndex];
      if (targetVideo) {
        targetVideo.currentTime = 0;
        await targetVideo.play();
      }

      // Simular progreso de transición
      await this.simulateTransitionProgress();

      // Completar transición
      this.transitionState.next({
        currentSection: targetIndex,
        isTransitioning: false,
        previousSection: currentIndex,
        transitionProgress: 100
      });

    } catch (error) {
      console.error('Error during video transition:', error);
      this.transitionState.next({
        ...currentState,
        isTransitioning: false,
        transitionProgress: 0
      });
    }
  }

  // Simular progreso de transición
  private async simulateTransitionProgress(): Promise<void> {
    const steps = 20;
    const stepDuration = this.transitionDuration / steps;

    for (let i = 0; i <= steps; i++) {
      const progress = (i / steps) * 100;
      
      this.transitionState.next({
        ...this.transitionState.value,
        transitionProgress: progress
      });

      await this.delay(stepDuration);
    }
  }

  // Pausar todos los videos
  pauseAllVideos(): void {
    this.videoElements.forEach(video => {
      if (video && !video.paused) {
        video.pause();
      }
    });
  }

  // Reanudar video actual
  resumeCurrentVideo(): void {
    const currentIndex = this.transitionState.value.currentSection;
    const currentVideo = this.videoElements[currentIndex];
    
    if (currentVideo && currentVideo.paused) {
      currentVideo.play().catch(error => {
        console.error('Error resuming video:', error);
      });
    }
  }

  // Obtener video actual
  getCurrentVideo(): HTMLVideoElement | null {
    const currentIndex = this.transitionState.value.currentSection;
    return this.videoElements[currentIndex] || null;
  }

  // Obtener índice de sección actual
  getCurrentSectionIndex(): number {
    return this.transitionState.value.currentSection;
  }

  // Verificar si está en transición
  isTransitioning(): boolean {
    return this.transitionState.value.isTransitioning;
  }

  // Configurar duración de transición
  setTransitionDuration(duration: number): void {
    this.transitionDuration = duration;
  }

  // Limpiar recursos
  cleanup(): void {
    this.videoElements.forEach(video => {
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    });
    this.videoElements = [];
  }

  // Utilidad para delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

