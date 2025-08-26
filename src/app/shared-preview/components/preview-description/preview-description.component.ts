import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService, AudioData } from '../../services/audio.service';

export interface AudioConfig {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

export interface PreviewDescriptionConfig {
  text: string;
  maxWidth?: string;
  centered?: boolean;
  showBackground?: boolean;
  padding?: 'small' | 'medium' | 'large';
  audio?: AudioConfig;
}

@Component({
  selector: 'app-preview-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-description.component.html',
  styleUrls: ['./preview-description.component.scss']
})
export class PreviewDescriptionComponent implements OnInit, OnDestroy {
  @Input() config: PreviewDescriptionConfig = {
    text: '',
    maxWidth: '800px',
    centered: true,
    showBackground: false,
    padding: 'medium',
    audio: {
      src: '',
      autoplay: false,
      loop: false,
      preload: 'metadata'
    }
  };

  @Input() projectId?: string;
  @Input() sectionId?: string;

  // Audio state
  isPlaying = false;
  isLoading = false;
  hasError = false;
  audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    this.initializeAudio();
    
    // Si no hay audio configurado pero hay projectId, intentar cargar desde API
    if (!this.config.audio?.src && this.projectId) {
      this.loadAudioFromAPI();
    }
  }

  ngOnDestroy(): void {
    this.cleanupAudio();
  }

  private initializeAudio(): void {
    if (this.config.audio?.src) {
      this.audioElement = new Audio(this.config.audio.src);
      this.audioElement.preload = this.config.audio.preload || 'metadata';
      this.audioElement.loop = this.config.audio.loop || false;
      
      // Event listeners
      this.audioElement.addEventListener('loadstart', () => {
        this.isLoading = true;
        this.hasError = false;
      });

      this.audioElement.addEventListener('canplay', () => {
        this.isLoading = false;
        this.hasError = false;
      });

      this.audioElement.addEventListener('play', () => {
        this.isPlaying = true;
      });

      this.audioElement.addEventListener('pause', () => {
        this.isPlaying = false;
      });

      this.audioElement.addEventListener('ended', () => {
        this.isPlaying = false;
      });

      this.audioElement.addEventListener('error', (error) => {
        console.error('Audio error:', error);
        this.isLoading = false;
        this.hasError = true;
        this.isPlaying = false;
      });

      // Autoplay if configured
      if (this.config.audio.autoplay) {
        this.playAudio();
      }
    }
  }

  private cleanupAudio(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  async playAudio(): Promise<void> {
    if (!this.audioElement || this.hasError) {
      return;
    }

    try {
      // Initialize audio context if not exists (for better browser compatibility)
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Play audio
      await this.audioElement.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      this.hasError = true;
      this.isPlaying = false;
    }
  }

  pauseAudio(): void {
    if (this.audioElement && this.isPlaying) {
      this.audioElement.pause();
    }
  }

  toggleAudio(): void {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  // Method to update audio source (useful for API integration)
  updateAudioSource(newSrc: string): void {
    if (this.audioElement) {
      const wasPlaying = this.isPlaying;
      this.audioElement.src = newSrc;
      this.hasError = false;
      
      if (wasPlaying) {
        this.playAudio();
      }
    }
  }



  // Load audio from API using AudioService
  private loadAudioFromAPI(): void {
    if (!this.projectId) {
      console.warn('No projectId provided for audio loading');
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    let audioObservable;
    
    if (this.sectionId) {
      // Cargar audio específico de una sección
      audioObservable = this.audioService.getSectionAudio(this.projectId, this.sectionId);
    } else {
      // Cargar audio de descripción del proyecto
      audioObservable = this.audioService.getProjectDescriptionAudio(this.projectId);
    }

    audioObservable.subscribe({
      next: (audioData: AudioData) => {
        console.log('Audio loaded from API:', audioData);
        this.updateAudioSource(audioData.audioUrl);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading audio from API:', error);
        this.hasError = true;
        this.isLoading = false;
        
        // Fallback: usar datos mock para desarrollo
        this.loadMockAudio();
      }
    });
  }

  // Load mock audio data for development
  private loadMockAudio(): void {
    const mockAudios = this.audioService.getMockAudioData(this.projectId || 'default');
    const mockAudio = this.sectionId 
      ? mockAudios.find(audio => audio.sectionId === this.sectionId)
      : mockAudios.find(audio => audio.sectionId === 'description');
    
    if (mockAudio) {
      console.log('Using mock audio:', mockAudio);
      this.updateAudioSource(mockAudio.audioUrl);
      this.isLoading = false;
    }
  }

  // Get button title based on current state
  getAudioButtonTitle(): string {
    if (this.hasError) {
      return 'Error al cargar audio';
    }
    if (this.isLoading) {
      return 'Cargando audio...';
    }
    if (this.isPlaying) {
      return 'Pausar audio';
    }
    return 'Reproducir audio';
  }
}


