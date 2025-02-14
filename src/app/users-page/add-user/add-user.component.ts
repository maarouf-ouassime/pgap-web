import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxEditorModule } from 'ngx-editor';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [RouterLink, NgxEditorModule, FileUploadModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public themeService: CustomizerSettingsService
  ) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required], // Prénom
      lastname: ['', Validators.required], // Nom
      email: ['', [Validators.required, Validators.email]], // Email
      phone: ['', Validators.required], // Téléphone
      job: ['', Validators.required], // Poste
      company: ['', Validators.required], // Entreprise
      country: ['', Validators.required], // Pays
      password: ['', [Validators.required, Validators.minLength(6)]], // Mot de passe
      photo: [''], // Photo de profil
    });

    this.themeService.isToggled$.subscribe((isToggled) => {
      console.log('Mode sombre activé:', isToggled);
    });
  }

  // Méthode pour gérer l’upload de fichier
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.userForm.patchValue({ photo: file });
    }
  }
  goBack() {
    window.history.back();
  }
  // Méthode pour soumettre le formulaire
  onSubmit() {
    if (this.userForm.valid) {
      const formData = new FormData();
      Object.keys(this.userForm.value).forEach((key) => {
        const value = this.userForm.value[key];
        if (value) {
          formData.append(key, value);
        }
      });

      this.http
        .post(`${environment.urlServerApi}/auth/signup`, formData)
        .subscribe({
          next: (response) =>
            console.log('Utilisateur créé avec succès', response),
          error: (error) =>
            console.error("Erreur lors de l'inscription", error),
        });
    } else {
      console.log('Formulaire invalide');
      Object.keys(this.userForm.controls).forEach((controlName) => {
        const control = this.userForm.get(controlName);
        if (control?.invalid) {
          console.log(`${controlName} is invalid`, control.errors);
        }
      });
    }
  }
}
