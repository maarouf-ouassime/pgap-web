import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../environments/environment";
import {ApiResponse} from "../app/models/api-responce-model";
import {Survey} from "./survey.service";

export interface SurveyResponse {
  remplisseur: string;
  formResponse: string;
  survey: { id: number };
}

@Injectable({
  providedIn: 'root'
})
export class SurveyResponseService {
  httpOptions;
  header = {
    'Content-Type': 'application/json',
  };

  constructor(private http: HttpClient) {
    this.httpOptions = new HttpHeaders(this.header);
  }

  submitResponse(response: SurveyResponse): Observable<ApiResponse<SurveyResponse>> {
    return this.http.post<ApiResponse<SurveyResponse>>(`${environment.urlServerApi}/survey-response/`, response,{headers: this.httpOptions});
  }
  getResponseById(id: number): Observable<ApiResponse<SurveyResponse>> {
    return this.http.get<ApiResponse<SurveyResponse>>(`${environment.urlServerApi}/survey-response/${id}`,{headers: this.httpOptions});
  }
  uploadFile(file: File): Observable<{ fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fileName: string }>(`${environment.urlServerApi}/survey-response/upload`, formData);
  }
}
