import { Component, input, output, signal } from '@angular/core';
import { ManagementEntityCardUiModel } from '../../models/management-entity-card.ui-model';

@Component({
  selector: 'app-management-entity-card',
  imports: [],
  templateUrl: './management-entity-card.component.html',
  styleUrl: './management-entity-card.component.css',
})
export class ManagementEntityCardComponent {
items = input.required<ManagementEntityCardUiModel[]>();
  loading = input<boolean>(false);

  // Output
  select = output<number | string>();

  // Internal selection state
  selectedId = signal<number | string | null>(null);

  onSelect(id: number | string): void {
    this.selectedId.set(id);
    this.select.emit(id);
  }
}
