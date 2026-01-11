import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InjuryCardComponent } from '../../../../shared/components/injury-card/injury-card.component';
import { InjuryDto } from '../../../../core/models/injuries/injury.dto';
import { InjuryTypesFacadeService } from '../../Services/injury-types.facade.service';
import { InjurySidesFacadeService } from '../../Services/injury-sides.facade.service';
import { InjuryReasonsFacadeService } from '../../Services/injury-reasons.facade.service';
import { RouterOutlet } from '@angular/router';
import { InjuriesNavigationFacade } from '../../../../core/navigation/injuries-navigation.facade';

@Component({
  selector: 'app-main-injuries-page',
  imports: [CommonModule, InjuryCardComponent, RouterOutlet],
  templateUrl: './main-injuries-page.component.html',
  styleUrl: './main-injuries-page.component.css',
})
export class MainInjuriesPageComponent implements OnInit {
  private typesFacade = inject(InjuryTypesFacadeService);
  private sidesFacade = inject(InjurySidesFacadeService);
  private reasonsFacade = inject(InjuryReasonsFacadeService);
  private nav = inject(InjuriesNavigationFacade);

  // Expose lists and loading signals
  types = this.typesFacade.injuryTypes;
  sides = this.sidesFacade.injurySides;
  reasons = this.reasonsFacade.injuryReasons;

  loadingTypes = this.typesFacade.isLoading;
  loadingSides = this.sidesFacade.isLoading;
  loadingReasons = this.reasonsFacade.isLoading;

  // Search terms
  typeSearch = signal<string>('');
  sideSearch = signal<string>('');
  reasonSearch = signal<string>('');

  // Filtered lists
  filteredTypes = computed<InjuryDto[]>(() => {
    const term = this.typeSearch().trim().toLowerCase();
    const list = this.types();
    if (!Array.isArray(list)) return [];
    if (!term) return list;
    return list.filter((x) => x.name?.toLowerCase().includes(term));
  });

  filteredSides = computed<InjuryDto[]>(() => {
    const term = this.sideSearch().trim().toLowerCase();
    const list = this.sides();
    if (!Array.isArray(list)) return [];
    if (!term) return list;
    return list.filter((x) => x.name?.toLowerCase().includes(term));
  });

  filteredReasons = computed<InjuryDto[]>(() => {
    const term = this.reasonSearch().trim().toLowerCase();
    const list = this.reasons();
    if (!Array.isArray(list)) return [];
    if (!term) return list;
    return list.filter((x) => x.name?.toLowerCase().includes(term));
  });

  // Selection
  selectedType = signal<InjuryDto | null>(null);
  selectedSide = signal<InjuryDto | null>(null);
  selectedReason = signal<InjuryDto | null>(null);

  // Toggle visibility queues (match therapy pattern: booleans, not signals)
  showTypesQueue: boolean = true;
  showSidesQueue: boolean = false;
  showReasonsQueue: boolean = false;

  ngOnInit(): void {
    this.typesFacade.loadInjuryTypes();
    this.sidesFacade.loadInjurySides();
    this.reasonsFacade.loadInjuryReasons();
  }

  onSearchTypes(value: string) {
    this.typeSearch.set(value ?? '');
  }

  onSearchSides(value: string) {
    this.sideSearch.set(value ?? '');
  }

  onSearchReasons(value: string) {
    this.reasonSearch.set(value ?? '');
  }

  onSelectType(injury: InjuryDto) {
    this.selectedType.set(injury);
    if (injury?.id != null) {
      this.nav.goToEditInjuryTypePage(injury.id);
    }
  }

  onSelectSide(injury: InjuryDto) {
    this.selectedSide.set(injury);
    if (injury?.id != null) {
      this.nav.goToEditInjurySidePage(injury.id);
    }
  }

  onSelectReason(injury: InjuryDto) {
    this.selectedReason.set(injury);
    if (injury?.id != null) {
      this.nav.goToEditInjuryReasonPage(injury.id);
    }
  }

  onAddType() {
    this.nav.goToCreateInjuryTypePage();
  }

  onAddSide() {
    this.nav.goToCreateInjurySidePage();
  }

  onAddReason() {
    this.nav.goToCreateInjuryReasonPage();
  }

  // Toggle: open one and collapse others (like therapy queues)
  toggleQueues(queue: 'types' | 'sides' | 'reasons') {
    this.showTypesQueue = queue === 'types';
    this.showSidesQueue = queue === 'sides';
    this.showReasonsQueue = queue === 'reasons';
  }
}
