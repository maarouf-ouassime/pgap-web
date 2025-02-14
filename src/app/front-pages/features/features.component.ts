import { Component } from '@angular/core';
import {FpKeyFeaturesComponent} from "../common/fp-key-features/fp-key-features.component";
import {FpTeamComponent} from "../common/fp-team/fp-team.component";
import {FpCtaComponent} from "../common/fp-cta/fp-cta.component";

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [
    FpKeyFeaturesComponent,
    FpTeamComponent,
    FpCtaComponent
  ],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {

}
