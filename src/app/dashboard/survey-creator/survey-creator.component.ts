import { Component, OnInit } from '@angular/core';
import { setLicenseKey } from 'survey-core';
import { SurveyCreatorModel } from 'survey-creator-core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SurveyCreatorModule } from "survey-creator-angular";
import { SurveyService } from "../../../services/survey.service";
import "survey-creator-core/survey-creator-core.i18n.js";
import { surveyLocalization } from "survey-core";
import "survey-core/survey.i18n.js";
import {QuillComponent} from "./quil/quil.component";


function applyHtml(_, options) {
  let str = options.text;
  if (str.indexOf("<p>") === 0) {
    // Remove root paragraphs <p></p>
    str = str.substring(3);
    str = str.substring(0, str.length - 4);
  }
  // Set HTML markup to render
  options.html = str;
}


@Component({
  selector: 'app-survey-creator',
  standalone: true,
  imports: [
    SurveyCreatorModule,
    ReactiveFormsModule
  ],
  template: `
    <survey-creator [model]="creator"></survey-creator>
  `,
  styleUrls: ['./survey-creator.component.scss']
})
export class SurveyCreatorComponent implements OnInit {
  creator!: SurveyCreatorModel;
  surveyForm: FormGroup;
  static declaration = [QuillComponent];


  constructor(
    private surveyService: SurveyService,
    private fb: FormBuilder
  ) {
    this.surveyForm = this.fb.group({
      title: ['']
    });
  }

  ngOnInit() {
    setLicenseKey("community");
    surveyLocalization.supportedLocales = ["en", "de", "es", "fr", "it", "ar"];
    console.log(surveyLocalization.supportedLocales);

    this.creator = new SurveyCreatorModel({
      showLogicTab: true,
      isAutoSave: false,
      showTranslationTab: true,
    });



    // Move the Quill question type to the first position in the Toolbox
    const toolboxItems = this.creator.toolbox.items;
    const quillIndex = toolboxItems.findIndex((item) => item.name === "quill");
    const quillItem = toolboxItems.splice(quillIndex, 1)[0];
    quillItem.title = "Rich Text Editor";
    quillItem.iconName = "icon-comment";
    toolboxItems.unshift(quillItem);

    // Apply HTML markup to survey contents
    this.creator.survey.onTextMarkdown.add(applyHtml);
    this.creator.onSurveyInstanceCreated.add((_, options) => {
      options.survey.onTextMarkdown.add(applyHtml);
    });




    this.creator.survey.locale = "fr";

    this.creator.saveSurveyFunc = (saveNo: number, callback: (saveNo: number, response: any) => void) => {
      const formJsonString = JSON.stringify(this.creator.JSON);

      const surveyData = {
        title: this.creator.JSON.title?.fr || 'Sans titre',
        form: formJsonString
      };

      console.log('Données envoyées:', surveyData);

      this.surveyService.createSurvey(surveyData).subscribe({
        next: (res) => {
          alert('Sondage enregistré avec succès!');
          console.log('Sondage créé:', res);
          callback(saveNo, { success: true });
        },
        error: (err) => {
          console.error('Erreur lors de la sauvegarde:', err);
          callback(saveNo, { success: false });
        }
      });
    };
  }
}
