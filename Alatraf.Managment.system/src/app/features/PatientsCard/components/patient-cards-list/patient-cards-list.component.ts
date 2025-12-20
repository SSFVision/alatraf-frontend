import { Component, input, output, signal } from '@angular/core';
import { PatientCardListItemVm } from '../../models/patient-card-list-item.vm';
import { PatientCardTypeLabel } from '../../models/patient-card-type.enum';

@Component({
  selector: 'app-patient-cards-list',
  standalone: true,
  imports: [],
  templateUrl: './patient-cards-list.component.html',
  styleUrl: './patient-cards-list.component.css',
})
export class PatientCardsListComponent {

  items = input.required<PatientCardListItemVm[]>();
  loading = input<boolean>(false);

  readonly typeLabel = PatientCardTypeLabel;

  select = output<number>();

  selectedId = signal<number | null>(null);

  onSelect(id: number): void {
    this.selectedId.set(id);
    this.select.emit(id);
  }
}
