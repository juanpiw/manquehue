import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface VideoSection {
  id: string;
  videoSrc: string;
  title?: string;
  description?: string;
  active: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface VideoBackgroundConfig {
  sections: VideoSection[];
  currentSection: number;
  transitionDuration?: number;
  showOverlay?: boolean;
  overlayOpacity?: number;
}

@Component({
  selector: 'app-video-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-background.component.html',
  styleUrls: ['./video-background.component.scss']
})
export class VideoBackgroundComponent implements OnInit, OnDestroy {
  @Input() config: VideoBackgroundConfig = {
    sections: [],
    currentSection: 0,
    transitionDuration: 1000,
    showOverlay: true,
    overlayOpacity: 0.3
  };

  @Output() sectionChange = new EventEmitter<number>();
  @Output() videoReady = new EventEmitter<string>();
  @Output() videoError = new EventEmitter<string>();

  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;

  private videoElements: HTMLVideoElement[] = [];
  private currentVideoIndex = 0;

  ngOnInit(): void {
    this.initializeVideos();
  }

  ngOnDestroy(): void {
    this.cleanupVideos();
  }

  private initializeVideos(): void {
    // Initialize video elements after view is initialized
    setTimeout(() => {
      this.setupVideoElements();
    }, 100);
  }

  private setupVideoElements(): void {
    const videoContainers = document.querySelectorAll('.video-section');
    
    videoContainers.forEach((container, index) => {
      const video = container.querySelector('video') as HTMLVideoElement;
      if (video) {
        this.videoElements[index] = video;
        this.setupVideoEventListeners(video, index);
      }
    });

    // Start with first video
    this.playVideo(0);
  }

  private setupVideoEventListeners(video: HTMLVideoElement, index: number): void {
    video.addEventListener('loadeddata', () => {
      this.videoReady.emit(`Video ${index} loaded`);
    });

    video.addEventListener('error', () => {
      this.videoError.emit(`Error loading video ${index}`);
    });

    video.addEventListener('ended', () => {
      if (video.loop) {
        video.currentTime = 0;
        video.play();
      }
    });
  }

  playVideo(index: number): void {
    if (index < 0 || index >= this.videoElements.length) return;

    // Pause all videos
    this.videoElements.forEach((video, i) => {
      if (video) {
        video.pause();
        video.style.opacity = '0';
      }
    });

    // Play selected video
    const targetVideo = this.videoElements[index];
    if (targetVideo) {
      targetVideo.currentTime = 0;
      targetVideo.play().then(() => {
        targetVideo.style.opacity = '1';
        this.currentVideoIndex = index;
        this.sectionChange.emit(index);
      }).catch(error => {
        console.error('Error playing video:', error);
        this.videoError.emit(`Error playing video ${index}`);
      });
    }
  }

  pauseAllVideos(): void {
    this.videoElements.forEach(video => {
      if (video) {
        video.pause();
      }
    });
  }

  resumeAllVideos(): void {
    this.videoElements.forEach(video => {
      if (video && !video.paused) {
        video.play();
      }
    });
  }

  onSectionClick(index: number): void {
    this.playVideo(index);
  }

  getCurrentVideo(): HTMLVideoElement | null {
    return this.videoElements[this.currentVideoIndex] || null;
  }

  private cleanupVideos(): void {
    this.videoElements.forEach(video => {
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    });
  }

  trackBySection(index: number, section: VideoSection): string {
    return section.id;
  }
}

