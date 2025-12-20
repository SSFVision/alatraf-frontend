import { Component, input, output, signal } from '@angular/core';
import { PatientCardListItemVm } from '../../models/patient-card-list-item.vm';

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


  select = output<number>();

  selectedId = signal<number | null>(null);

  onSelect(id: number): void {
    this.selectedId.set(id);
    this.select.emit(id);
  }
}
