import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DoctorHeaderInfoComponent } from '../../../../shared/components/doctor-header-info/doctor-header-info.component';
import { TechnicianFacade } from '../../Services/TechnicianFacade.service';
import { TechnicianIndustrialPartsCardComponent } from "../technician-industrial-parts-card/technician-industrial-parts-card.component";

@Component({
  selector: 'app-technician-doctor-assignments',
  standalone: true,
  imports: [
    CommonModule,
    DoctorHeaderInfoComponent,
    TechnicianIndustrialPartsCardComponent
],
  templateUrl: './technician-doctor-assignments.component.html',
  styleUrl: './technician-doctor-assignments.component.css',
})
export class TechnicianDoctorAssignmentsComponent {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  techniciandoctorFacade = inject(TechnicianFacade);

  technicianHeader = this.techniciandoctorFacade.technicianHeader;
  loadingTechnicianData = this.techniciandoctorFacade.loadingTechnicianData;
  ngOnInit(): void {
    this.listenToRouteParamsChange();
  }

  ngOnDestroy(): void {
    this.techniciandoctorFacade.resetTechnicianState();
  }

  private listenToRouteParamsChange(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('doctorSectionRoomId');

        this.techniciandoctorFacade.resetTechnicianState();

        if (id !== null && id !== undefined) {
          const doctorSectionRoomId = +id;
          this.techniciandoctorFacade.loadTechnicianHeader(doctorSectionRoomId);
          this.techniciandoctorFacade.loadTechnicianIndustrialParts(doctorSectionRoomId);
        }
      });
  }

  onpartCardClick(part: any): void {
    console.log('Partcard clicked:', part);
  }
  onSearch(term: string): void {
    this.techniciandoctorFacade.search(term);
  }
}
