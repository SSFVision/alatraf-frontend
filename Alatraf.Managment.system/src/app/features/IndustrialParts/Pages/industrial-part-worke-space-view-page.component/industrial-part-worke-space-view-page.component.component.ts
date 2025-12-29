import {
  Component,
  inject,
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
import { IndustrialPartsNavigationFacade } from '../../../../core/navigation/industrial-parts-navigation.facade';

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

  private route = inject(ActivatedRoute);
  private facade = inject(IndustrialPartsFacade);
  private unitsFacade = inject(UnitsFacade);

  private routeSub?: Subscription;


  part = this.facade.selectedIndustrialPart;
  isEditMode = this.facade.isEditMode;
  loadingItem = this.facade.loadingItem;
  saving = this.facade.saving;

  units = this.unitsFacade.units;


  ngOnInit(): void {
    // Load units once
    this.unitsFacade.loadUnits();

    // Keep param subscription (as requested)
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('industrialPartId');
      const id = idParam ? Number(idParam) : null;

      if (id) {
        this.facade.loadIndustrialPartForEdit(id);
      } else {
        this.facade.enterCreateMode();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

 
  onCreate(dto: CreateIndustrialPartRequest): void {
    this.facade.createIndustrialPart(dto).subscribe();
  }

  onUpdate(payload: { id: number; dto: UpdateIndustrialPartRequest }): void {
    this.facade.updateIndustrialPart(payload.id, payload.dto,).subscribe();
  }

onDelete(part: IndustrialPartDto): void {

  this.facade.deleteIndustrialPart(part);

}

}
