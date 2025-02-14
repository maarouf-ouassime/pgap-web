import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileStorageService {
  private baseUrl = `${environment.urlServerApi}/files`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File, subFolder: string): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('subFolder', subFolder);

    return this.http.post<string>(`${this.baseUrl}/upload`, formData);
  }

  uploadMultipleFiles(files: File[], subFolder: string): Observable<string[]> {
    const formData: FormData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('subFolder', subFolder);

    return this.http.post<string[]>(`${this.baseUrl}/upload-multiple`, formData);
  }

  downloadFile(subFolder: string, fileName: string): Observable<Blob> {
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    return this.http.get(`${this.baseUrl}/download/${subFolder}/${fileName}`, {
      headers,
      responseType: 'blob',
    });
  }

  /**
   * Obtenir l'URL directe d'un fichier pour le télécharger ou le visualiser
   */
  getFileUrl(subFolder: string, fileName: string): string {
    return `${this.baseUrl}/download/${subFolder}/${fileName}`;
  }

  /**
   * Obtenir l'URL directe d'un fichier pour la visualisation dans le navigateur
   */
  getFileViewUrl(subFolder: string, fileName: string): string {
    return `${this.baseUrl}/view/${subFolder}/${fileName}`;
  }
}
