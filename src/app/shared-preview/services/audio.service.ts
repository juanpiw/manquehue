import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface AudioData {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration?: number;
  projectId?: string;
  sectionId?: string;
}

export interface AudioResponse {
  success: boolean;
  data: AudioData[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private apiUrl = 'https://api.example.com/audio'; // Cambiar por tu URL real

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los audios de un proyecto específico
   */
  getProjectAudios(projectId: string): Observable<AudioData[]> {
    return this.http.get<AudioResponse>(`${this.apiUrl}/project/${projectId}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene el audio de una sección específica
   */
  getSectionAudio(projectId: string, sectionId: string): Observable<AudioData> {
    return this.http.get<AudioResponse>(`${this.apiUrl}/project/${projectId}/section/${sectionId}`)
      .pipe(
        map(response => response.data[0]),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene el audio de descripción del proyecto
   */
  getProjectDescriptionAudio(projectId: string): Observable<AudioData> {
    return this.http.get<AudioResponse>(`${this.apiUrl}/project/${projectId}/description`)
      .pipe(
        map(response => response.data[0]),
        catchError(this.handleError)
      );
  }

  /**
   * Sube un nuevo archivo de audio
   */
  uploadAudio(file: File, projectId: string, sectionId?: string): Observable<AudioData> {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('projectId', projectId);
    if (sectionId) {
      formData.append('sectionId', sectionId);
    }

    return this.http.post<AudioResponse>(`${this.apiUrl}/upload`, formData)
      .pipe(
        map(response => response.data[0]),
        catchError(this.handleError)
      );
  }

  /**
   * Elimina un audio específico
   */
  deleteAudio(audioId: string): Observable<boolean> {
    return this.http.delete<AudioResponse>(`${this.apiUrl}/${audioId}`)
      .pipe(
        map(response => response.success),
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza la información de un audio
   */
  updateAudio(audioId: string, audioData: Partial<AudioData>): Observable<AudioData> {
    return this.http.put<AudioResponse>(`${this.apiUrl}/${audioId}`, audioData)
      .pipe(
        map(response => response.data[0]),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene la URL de streaming de audio (para archivos grandes)
   */
  getStreamingUrl(audioId: string): Observable<string> {
    return this.http.get<{streamingUrl: string}>(`${this.apiUrl}/${audioId}/stream`)
      .pipe(
        map(response => response.streamingUrl),
        catchError(this.handleError)
      );
  }

  /**
   * Verifica si un archivo de audio existe y es accesible
   */
  checkAudioAvailability(audioUrl: string): Observable<boolean> {
    return this.http.head(audioUrl)
      .pipe(
        map(() => true),
        catchError(() => new Observable<boolean>(observer => observer.next(false)))
      );
  }

  /**
   * Obtiene metadatos del archivo de audio
   */
  getAudioMetadata(audioUrl: string): Observable<{
    duration: number;
    format: string;
    size: number;
  }> {
    return this.http.get<{
      duration: number;
      format: string;
      size: number;
    }>(`${this.apiUrl}/metadata`, { params: { url: audioUrl } })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Manejo de errores centralizado
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    
    console.error('AudioService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Método para simular datos de audio (para desarrollo)
   */
  getMockAudioData(projectId: string): AudioData[] {
    return [
      {
        id: '1',
        title: 'Descripción del Proyecto',
        description: 'Audio descriptivo del proyecto Mirador del Golf',
        audioUrl: 'assets/audio/project-description.mp3',
        duration: 45,
        projectId: projectId,
        sectionId: 'description'
      },
      {
        id: '2',
        title: 'Características del Apartamento',
        description: 'Detalles de las características del apartamento',
        audioUrl: 'assets/audio/apartment-features.mp3',
        duration: 30,
        projectId: projectId,
        sectionId: 'features'
      },
      {
        id: '3',
        title: 'Equipamiento',
        description: 'Información sobre el equipamiento disponible',
        audioUrl: 'assets/audio/equipment.mp3',
        duration: 25,
        projectId: projectId,
        sectionId: 'equipment'
      }
    ];
  }
}
