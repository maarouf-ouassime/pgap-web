// survey-viewer.module.ts
import { NgModule } from '@angular/core';
import { SurveyModule } from 'survey-angular-ui';

@NgModule({
  imports: [SurveyModule],
  exports: [SurveyModule]
})
export class SurveyViewerWrapperModule {}
