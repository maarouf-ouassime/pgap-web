import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.urlServerApi}/users`;

  constructor(private http: HttpClient) {}

  // Récupérer la liste des utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }

  addUser(formData: FormData) {
    return this.http.post<User>(`${this.apiUrl}/`, formData);
  }
}
