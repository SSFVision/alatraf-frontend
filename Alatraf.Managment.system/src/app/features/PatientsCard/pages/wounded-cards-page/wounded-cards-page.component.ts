import { Component, inject } from '@angular/core';
import { GenaricLayoutPatientCardsPageComponent } from "../genaric-layout-patient-cards-page/genaric-layout-patient-cards-page.component";
import { WoundedCardsFacade } from '../../Facades/wounded-cards.facade..service';
import { PatientCardType } from '../../models/patient-card-type.enum';

@Component({
  selector: 'app-wounded-cards-page',
  imports: [GenaricLayoutPatientCardsPageComponent],
  templateUrl: './wounded-cards-page.component.html',
  styleUrl: './wounded-cards-page.component.css'
})
export class WoundedCardsPageComponent {
  facade = inject(WoundedCardsFacade);
  cardType = PatientCardType;

}
