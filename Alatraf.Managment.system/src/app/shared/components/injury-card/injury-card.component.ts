import {
  Component,
  computed,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { InjuryDto } from '../../../core/models/injuries/injury.dto';

@Component({
  selector: 'app-injury-card',
  imports: [],
  templateUrl: './injury-card.component.html',
  styleUrl: './injury-card.component.css',
})
export class InjuryCardComponent implements OnDestroy {
  injuries = input.required<InjuryDto[]>();
  loading = input<boolean>(false);

  selectedId = signal<number | null>(null);

  // Emit the selected InjuryDto
  select = output<InjuryDto>();

  // Sorted list by name to keep display consistent
  sortedInjuries = computed(() => {
    const list = this.injuries();
    return Array.isArray(list)
      ? [...list].sort((a, b) => a.name.localeCompare(b.name))
      : [];
  });

  onSelect(injury: InjuryDto) {
    this.selectedId.set(injury.id);
    this.select.emit(injury);
  }

  ngOnDestroy(): void {
    this.selectedId.set(null);
  }
}
