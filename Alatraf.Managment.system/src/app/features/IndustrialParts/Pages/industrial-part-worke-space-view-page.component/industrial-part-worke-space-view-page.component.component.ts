import {
  Component,
  inject,
  signal,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { IndustrialPartsFacade } from '../../Services/industrial-parts.facade.service';
import { UnitsFacade } from '../../../Inventory/Units/Services/unit.facade.service';

import { AddEditIndustrialPartComponent } from '../../Components/add-edit-industrial-part/add-edit-industrial-part.component';
import { CreateIndustrialPartRequest } from '../../models/create-industrial-part.request';
import { UpdateIndustrialPartRequest } from '../../models/update-industrial-part.request';
import { IndustrialPartDto } from '../../../../core/models/industrial-parts/industrial-partdto';

type IndustrialPartFormMode = 'create' | 'edit';

@Component({
  selector: 'app-industrial-part-worke-space-view-page',
  standalone: true,
  imports: [AddEditIndustrialPartComponent],
  templateUrl:
    './industrial-part-worke-space-view-page.component.component.html',
  styleUrl:
    './industrial-part-worke-space-view-page.component.component.css',
})
export class IndustrialPartWorkeSpaceViewPageComponentComponent
  implements OnInit, OnDestroy
{
  // ----------------------------------------------------
  // INJECTIONS
  // ----------------------------------------------------
  private route = inject(ActivatedRoute);
  private facade = inject(IndustrialPartsFacade);
  private unitsFacade = inject(UnitsFacade);

  // ----------------------------------------------------
  // STATE (WORKSPACE)
  // ----------------------------------------------------
  mode = signal<IndustrialPartFormMode>('create');
  isLoading = signal<boolean>(true);

  // Exposed readonly signals
  part = this.facade.selectedIndustrialPart;
  units = this.unitsFacade.units;

  private currentId = signal<number | null>(null);
  private routeSub?: Subscription;

  // ----------------------------------------------------
  // EFFECTS (INJECTION CONTEXT ✔)
  // ----------------------------------------------------
  /**
   * Controls loading lifecycle for EDIT mode
   * Loading ends ONLY when:
   * - part loaded
   * - units loaded
   * - correct id
   */
  private loadingEffect = effect(() => {
    if (this.mode() !== 'edit') return;

    const part = this.part();
    const units = this.units();
    const id = this.currentId();

    if (
      part &&
      units.length > 0 &&
      id !== null &&
      part.industrialPartId === id
    ) {
      this.isLoading.set(false);
    }
  });

  // ----------------------------------------------------
  // LIFECYCLE
  // ----------------------------------------------------
  ngOnInit(): void {
    // Load units ONCE for workspace lifetime
    this.unitsFacade.loadUnits();

    // React to route changes
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('industrialPartId');
      const id = idParam ? Number(idParam) : null;

      this.currentId.set(id);

      if (id) {
        // ---------------------------
        // EDIT MODE
        // ---------------------------
        this.mode.set('edit');
        this.isLoading.set(true);
        this.facade.loadIndustrialPartForEdit(id);
      } else {
        // ---------------------------
        // CREATE MODE
        // ---------------------------
        this.mode.set('create');
        this.facade.enterCreateMode();
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.loadingEffect.destroy();
  }

  // ----------------------------------------------------
  // CHILD OUTPUT HANDLERS
  // ----------------------------------------------------
  onCreate(dto: CreateIndustrialPartRequest): void {
    this.isLoading.set(true);

    this.facade.createIndustrialPart(dto).subscribe((res) => {
      if (res.success && res.data) {
        this.mode.set('edit');
        this.currentId.set(res.data.industrialPartId);
        this.facade.enterEditMode(res.data);
      }

      this.isLoading.set(false);
    });
  }

  onUpdate(payload: { id: number; dto: UpdateIndustrialPartRequest }): void {
    this.isLoading.set(true);

    this.facade.updateIndustrialPart(payload.id, payload.dto).subscribe(() => {
      // Reload to sync backend state
      this.facade.loadIndustrialPartForEdit(payload.id);
    });
  }

  onDelete(part: IndustrialPartDto): void {
    this.isLoading.set(true);

    this.facade.deleteIndustrialPart(part);

    // Reset workspace
    this.mode.set('create');
    this.currentId.set(null);
    this.facade.enterCreateMode();
    this.isLoading.set(false);
  }
}
