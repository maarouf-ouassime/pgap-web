import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from "../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  httpClient: HttpClient;
  httpOptions;
  url;

  header = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
    'Access-Control-Allow-Origin': environment.originUrl
  };

  constructor(private http: HttpClient) {
    this.httpClient = http;
    this.httpOptions = new HttpHeaders(this.header);
    this.url = environment.urlServerApi;
  }

  // CRUD Operations:
  // --------------------------------------------------
  // Create method generic: objectT is the object to save.
  // --------------------------------------------------

  save<T>(collection: string, objectT: T[]): Observable<any> {
    return this.http.post(`${this.url}/${collection}/`, objectT, {headers: this.httpOptions});
  }

  // ---------------------------------------------------
  // Update method generic: objectT is the object to update.
  // ---------------------------------------------------

  update<T>(collection: string, objectT: T): Observable<any> {
    // @ts-ignore
    return this.http.put(`${this.url}/${collection}/${objectT.id}`, JSON.stringify(objectT), {headers: this.httpOptions});
  }

  // ---------------------------------------------------
  // Delete method generic: objectT is the object to remove.
  // ---------------------------------------------------

  remove<T>(collection: string, objectT: T): Observable<any> {
    // @ts-ignore
    return this.http.delete(`${this.url}/${collection}/${objectT.id}`, {headers: this.httpOptions});
  }

  removeAll<T>(collection: string): Observable<any> {
    return this.http.delete(`${this.url}/${collection}`, {headers: this.httpOptions});
  }

  // ---------------------------------------------------
  // GetAll, Get one element method generic
  // ---------------------------------------------------
  findAll<T>(collection: string): Observable<any> {
    return this.http.get<T[]>(`${this.url}/${collection}/`, {headers: this.httpOptions});
  }

  findById<T>(collection: string, id: string): Observable<any> {
    return this.http.get<T>(`${this.url}/${collection}/${id}`, {headers: this.httpOptions});
  }
}
