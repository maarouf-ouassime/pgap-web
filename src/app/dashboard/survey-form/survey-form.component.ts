import { Component, OnInit } from '@angular/core';
import { Model } from 'survey-core';
import { ActivatedRoute } from '@angular/router';
import { SurveyViewerWrapperModule } from "../survey-viewer.module";
import {NgForOf, NgIf} from "@angular/common";
import { SurveyService } from '../../../services/survey.service';
import { SurveyResponseService, SurveyResponse } from "../../../services/survey-response.service";
import { FileStorageService } from "../../../services/file-storage.service";

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [SurveyViewerWrapperModule, NgIf, NgForOf],
  template: `
    <div *ngIf="surveyModel" class="survey-container">
      <h2>{{ surveyTitle }}</h2>
      <div class="language-selector">
        <label for="language-select">Select Language:</label>
        <select
          id="language-select"
          [value]="currentLocale"
          (change)="onLanguageChange($event)">
          <option *ngFor="let locale of availableLocales" [value]="locale">
            {{ getLanguageName(locale) }}
          </option>
        </select>
      </div>
      <survey [model]="surveyModel"></survey>
    </div>
  `,
  styles: [`
    .survey-container {
      padding: 20px;
    }
    .language-selector {
      margin-bottom: 20px;
    }
    select {
      margin-left: 10px;
      padding: 5px;
    }
  `]
})
export class SurveyFormComponent implements OnInit {
  surveyModel!: Model;
  surveyTitle = '';
  currentLocale = 'fr';
  availableLocales = ["en", "de", "es", "fr", "it", "ar"];

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
    private responseService: SurveyResponseService,
    private fileStorageService: FileStorageService
  ) {}

  ngOnInit() {
    const surveyId = this.route.snapshot.params['id'];

    this.surveyService.getSurvey(surveyId).subscribe({
      next: (survey: any) => {
        this.surveyTitle = survey.data.title;
        const surveyJson = JSON.parse(survey.data.form);

        // Initialize survey model with multilingual support
        this.surveyModel = new Model(surveyJson);
        this.surveyModel.locale = this.currentLocale;

        // Configure file upload handling
        this.setupFileUpload();

        // Configure form submission handling
        this.setupFormSubmission(surveyId);
      },
      error: (err) => console.error("Error loading survey:", err)
    });
  }

  private setupFileUpload() {
    this.surveyModel.onUploadFiles.add((_, options) => {
      if (options.files.length === 0) {
        console.warn("No files selected");
        return;
      }

      this.fileStorageService.uploadMultipleFiles(options.files, "survey").subscribe({
        next: (fileUrls: string[]) => {
          const fileNames = fileUrls.map(url => ({ name: this.extractFilenameFromUrl(url) }));

          options.callback("success", options.files.map((file, index) => ({
            file: file,
            content: `http://localhost:4455/api/v1/files/download/survey/${fileNames[index].name}`
          })));
        },
        error: (err) => {
          console.error("File upload error:", err);
          options.callback("error");
        }
      });
    });
  }

  private setupFormSubmission(surveyId: string) {
    this.surveyModel.onComplete.add((sender) => {
      const response: SurveyResponse = {
        remplisseur: 'User',
        formResponse: JSON.stringify(sender.data),
        survey: { id: parseInt(surveyId) },
      };

      this.responseService.submitResponse(response).subscribe({
        next: () => alert('Response submitted successfully!'),
        error: (err) => console.error("Error submitting response:", err)
      });
    });
  }

  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.currentLocale = select.value;
    this.surveyModel.locale = this.currentLocale;
  }

  getLanguageName(locale: string): string {
    const languages: { [key: string]: string } = {
      'en': 'English',
      'fr': 'Français',
      'de': 'Deutsch',
      'es': 'Español',
      'it': 'Italiano',
      'ar': 'العربية'
    };
    return languages[locale] || locale;
  }

  private extractFilenameFromUrl(url: string): string {
    const match = url.match(/\/([^/]+)$/);
    return match ? match[1] : 'unnamed-file';
  }
}
