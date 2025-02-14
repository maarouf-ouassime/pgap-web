import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common'; // <-- Import nécessaire
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  totalUsers: number = 0;
  constructor(private usersService: UserService) {}

  ngOnInit() {
    this.getAllUsers();
  }

  fetchUsers() {
    this.usersService.getAllUsers().subscribe((response: any) => {
      this.users = response.data; // Ensure this matches your API response structure
      this.totalUsers = response.total; // Adjust according to your API response
    });
  }
  getAllUsers() {
    this.usersService.getAllUsers().subscribe(
      (data) => {
        console.log('Données reçues:', data);
        this.users = data;
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des utilisateurs:',
          error
        );
      }
    );
  }
  getUserPhoto(photo: string | null): string {
    if (!photo) {
      return 'assets/default-user.jpg'; // Image par défaut si aucune photo n'est disponible
    }
    return `http://localhost:4455/uploads/${photo}`; // Ajuste l'URL selon ton backend
  }
}
