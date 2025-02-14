import { Component, OnInit } from '@angular/core';
import { Model } from 'survey-core';
import { ActivatedRoute } from '@angular/router';
import { SurveyViewerWrapperModule } from "../survey-viewer.module";
import { NgIf } from "@angular/common";
import { SurveyService } from '../../../services/survey.service';
import { SurveyResponseService } from "../../../services/survey-response.service";

@Component({
  selector: 'app-survey-response-view',
  standalone: true,
  imports: [SurveyViewerWrapperModule, NgIf],
  template: `
    <div *ngIf="surveyModel">
      <h2>{{ surveyTitle }}</h2>
      <survey [model]="surveyModel"></survey>
    </div>
  `
})
export class SurveyResponseViewComponent implements OnInit {
  surveyModel!: Model;
  surveyTitle = '';

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
    private responseService: SurveyResponseService
  ) {}

  ngOnInit() {
    const responseId = this.route.snapshot.params['id'];
    this.responseService.getResponseById(responseId).subscribe({
      next: (response: any) => {
        console.log('Réponse chargée:', response);
        const surveyId = response.data.survey.id;
        const formResponse = JSON.parse(response.data.formResponse);
        this.surveyService.getSurvey(surveyId).subscribe({
          next: (survey: any) => {
            this.surveyTitle = survey.data.title;
            this.initializeSurveyModel(survey.data.form, formResponse);
          },
          error: (err) => console.error('Erreur de chargement du sondage:', err)
        });
      },
      error: (err) => console.error('Erreur de chargement de la réponse:', err)
    });
  }

  private initializeSurveyModel(surveyJson: any, responseData: any) {
    this.surveyModel = new Model(surveyJson);
    this.surveyModel.data = responseData;
    this.surveyModel.mode = 'display';
    this.configureFileRendering();
  }

  private configureFileRendering() {
    this.surveyModel.onAfterRenderQuestion.add((_, options) => {
      if (options.question.getType() === 'file') {
        const files = options.question.value;
        const container = options.htmlElement;
        if (files?.length) {
          container.innerHTML = '';

          // Ajouter un bouton pour tout télécharger si plusieurs fichiers
          if (files.length > 1) {
            const downloadAllButton = this.createDownloadAllButton(files);
            container.appendChild(downloadAllButton);
          }

          files.forEach((file: any) => {
            const fileContainer = document.createElement('div');
            fileContainer.style.marginBottom = '20px';

            // Créer l'élément de fichier (image ou lien)
            const element = this.createFileElement(file);
            fileContainer.appendChild(element);

            // Ajouter le bouton de téléchargement pour chaque fichier
            const downloadButton = this.createDownloadButton(file);
            fileContainer.appendChild(downloadButton);

            container.appendChild(fileContainer);
          });
        }
      }
    });
  }

  private createFileElement(file: any): HTMLElement {
    const url = file.content;
    const isImage = this.isImageUrl(url);
    if (isImage) {
      const container = document.createElement('div');
      const img = this.createImageElement(url);
      container.appendChild(img);
      return container;
    } else {
      return this.createDownloadLink(url, file.name);
    }
  }

  private isImageUrl(url: string): boolean {
    return /\.(jpe?g|png|gif|bmp|webp)$/i.test(url);
  }

  private createImageElement(url: string): HTMLElement {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Image téléchargée';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '300px';
    img.style.margin = '10px 0';
    img.style.borderRadius = '4px';
    img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    img.style.cursor = 'pointer';

    // Ajouter la possibilité de cliquer sur l'image pour l'ouvrir dans un nouvel onglet
    img.onclick = () => window.open(url, '_blank');

    return img;
  }

  private createDownloadLink(url: string, filename: string): HTMLElement {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = filename;
    link.target = '_blank';
    link.style.display = 'flex';
    link.style.alignItems = 'center';
    link.style.margin = '8px 0';
    link.style.padding = '8px';
    link.style.border = '1px solid #ddd';
    link.style.borderRadius = '4px';
    link.style.textDecoration = 'none';
    link.style.color = '#2196F3';

    const icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.textContent = 'insert_drive_file';
    icon.style.marginRight = '8px';

    link.prepend(icon);
    return link;
  }

  private createDownloadButton(file: any): HTMLElement {
    const button = document.createElement('button');
    button.textContent = 'Télécharger';
    button.style.backgroundColor = '#2196F3';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '8px 16px';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.marginTop = '8px';
    button.style.display = 'block';

    button.onclick = () => this.downloadFile(file.content, file.name);

    return button;
  }


  private createDownloadAllButton(files: any[]): HTMLElement {
    const button = document.createElement('button');
    button.textContent = 'Télécharger tous les fichiers';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.marginBottom = '20px';
    button.style.display = 'block';
    button.style.width = '100%';

    button.onclick = () => {
      files.forEach((file, index) => {
        setTimeout(() => {
          this.downloadFile(file.content, file.name);
        }, index * 500); // 500ms entre chaque téléchargement
      });
    };

    return button;
  }


  private downloadFile(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
