import { Component, inject } from '@angular/core';
import { GenaricLayoutPatientCardsPageComponent } from "../genaric-layout-patient-cards-page/genaric-layout-patient-cards-page.component";
import { DisabledCardsFacade } from '../../Facades/disabled-cards.facade.service';
import { PatientCardType } from '../../models/patient-card-type.enum';

@Component({
  selector: 'app-disabled-cards-page',
  imports: [GenaricLayoutPatientCardsPageComponent],
  templateUrl: './disabled-cards-page.component.html',
  styleUrl: './disabled-cards-page.component.css'
})
export class DisabledCardsPageComponent {
  facade = inject(DisabledCardsFacade);
  cardType = PatientCardType;
}
