import { Component, OnInit } from '@angular/core';
import { setLicenseKey } from 'survey-core';
import {SurveyCreatorModule} from "survey-creator-angular";
import { SurveyCreatorModel } from 'survey-creator-core';


@Component({
  selector: 'app-survey-creator',
  template: `
    <survey-creator [model]="creator"></survey-creator>
  `,
  standalone: true,
  imports: [
    SurveyCreatorModule
  ],
  styleUrl: './survey-creator.component.scss'
})
export class SurveyCreatorComponent implements OnInit {

  creator!: SurveyCreatorModel;

  ngOnInit() {
    setLicenseKey("community");

    this.creator = new SurveyCreatorModel({
      showLogicTab: true,
      isAutoSave: true,
      showTranslationTab: false,
    });

    this.creator.saveSurveyFunc = () => {
      console.log('JSON généré:', this.creator.JSON);
    };
  }
}
