import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { PatientCardsListComponent } from '../../components/patient-cards-list/patient-cards-list.component';
import { RouterOutlet } from '@angular/router';
import { PatientCardsFacade } from '../../Facades/patient-cards.facade.service';
import { PatientCardsNavigationFacade } from '../../../../core/navigation/patient-cards-navigation.facade';
import { PatientCardType } from '../../models/patient-card-type.enum';

@Component({
  selector: 'app-genaric-layout-patient-cards-page',
  standalone: true,

  imports: [PatientCardsListComponent, RouterOutlet],
  templateUrl: './genaric-layout-patient-cards-page.component.html',
  styleUrl: './genaric-layout-patient-cards-page.component.css',
})
export class GenaricLayoutPatientCardsPageComponent implements OnInit {
  @Input({ required: true })
  facade!: PatientCardsFacade;
  @Input({ required: true })
  activeType!: PatientCardType;

  // cards = this.facade.items!;
  // isloading = this.facade.isLoading!;
  ngOnInit() {
    this.facade.load();
  }
  selectedId = signal<number>(0);
  onSearch(term: string): void {
    this.facade.search(term);
  }

  onSelectCard(cardId: number): void {
    this.selectedId.set(cardId);
    this.facade.openWorkspace(cardId);
  }
  private navigation = inject(PatientCardsNavigationFacade);

  // expose enum to template
  readonly cardType = PatientCardType;
  switchType(type: PatientCardType): void {
    if (type === PatientCardType.Wounded) {
      this.navigation.goToWoundedCardsMainPage();
    } else {
      this.navigation.goToDisabledCardsMainPage();
    }
  }
  onAddCard(): void {
    // هذا سيُربط لاحقًا مع Workspace Facade
    // حاليًا نتركه فارغ أو TODO
  }
}
