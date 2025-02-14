import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../environments/environment";
import {ApiResponse} from "../app/models/api-responce-model";

export interface Survey {
  id?: number;
  title: string;
  form: string;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  httpOptions;
  header = {
    'Content-Type': 'application/json',
  };

  constructor(private http: HttpClient) {
    this.httpOptions = new HttpHeaders(this.header);
  }

  // createSurvey(survey: Survey): Observable<ApiResponse<Survey>> {
  //   return this.http.post<ApiResponse<Survey>>(`${environment.urlServerApi}/survey/`, survey, {headers: this.httpOptions});
  // }

  createSurvey(survey: Survey): Observable<ApiResponse<Survey>> {
    return this.http.post<ApiResponse<Survey>>(
      `${environment.urlServerApi}/survey/`,
      JSON.stringify(survey), // Conversion explicite en chaîne
      {
        headers: this.httpOptions.set('Content-Type', 'application/json')
      }
    );
  }

  getSurvey(id: number): Observable<ApiResponse<Survey>> {
    return this.http.get<ApiResponse<Survey>>(`${environment.urlServerApi}/survey/${id}`,{headers: this.httpOptions});
  }
}
