import { Component, computed, inject, signal } from '@angular/core';
import { DisabledCardsFacade } from '../../../Facades/disabled-cards.facade.service';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-disabled-card-workspace',
  standalone: true,
  imports: [],
  templateUrl: './disabled-card-workspace.component.html',
  styleUrl: './disabled-card-workspace.component.css',
})
export class DisabledCardWorkspaceComponent {
 private route = inject(ActivatedRoute);
  private facade = inject(DisabledCardsFacade);
 private destroy$ = new Subject<void>();
isEditmode=this.facade.isEditMode
  constructor() {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get('disabledCardId');

        if (!id) {
          this.facade.enterCreateMode();
          return;
        }

        const cardId = Number(id);
        if (!isNaN(cardId)) {
          this.facade.loadDisabledCardForEdit(cardId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
