// survey-creator.module.ts
import { NgModule } from '@angular/core';
import { SurveyCreatorModule } from 'survey-creator-angular';

@NgModule({
  imports: [SurveyCreatorModule],
  exports: [SurveyCreatorModule]
})
export class SurveyCreatorWrapperModule {}
