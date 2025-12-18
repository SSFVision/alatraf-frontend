import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IndustrialPartsFacade } from '../../Services/industrial-parts.facade.service';
import { AddEditIndustrialPartComponent } from "../../Components/add-edit-industrial-part/add-edit-industrial-part.component";

@Component({
  selector: 'app-industrial-part-worke-space-view-page.component',
  imports: [AddEditIndustrialPartComponent],
  templateUrl: './industrial-part-worke-space-view-page.component.component.html',
  styleUrl: './industrial-part-worke-space-view-page.component.component.css'
})
export class IndustrialPartWorkeSpaceViewPageComponentComponent {
 private route = inject(ActivatedRoute);
  private facade = inject(IndustrialPartsFacade);

  isLoading = signal(true);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('industrialPartId');

      this.isLoading.set(true);

      if (id) {
        this.facade.loadIndustrialPartForEdit(+id);
      } else {
        this.facade.enterCreateMode();
      }

      this.isLoading.set(false);
    });
  }
}
