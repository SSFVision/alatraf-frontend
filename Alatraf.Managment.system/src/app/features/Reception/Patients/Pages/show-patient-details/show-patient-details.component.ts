import { Component, inject, signal } from '@angular/core';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { PatientService } from '../../Services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { PatientSummaryCardComponent } from "../../components/patient-summary-card/patient-summary-card.component";
import { PatientDto } from '../../../../../core/models/Shared/patient.model';

@Component({
  selector: 'app-show-patient-details',
  imports: [PatientSummaryCardComponent],
  templateUrl: './show-patient-details.component.html',
  styleUrl: './show-patient-details.component.css',
})
export class ShowPatientDetailsComponent {
  private nav = inject(NavigationReceptionFacade);
  patientService = inject(PatientService);
  private route = inject(ActivatedRoute);
  patient!: PatientDto;
    isLoading = signal(true);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('patientId'));
    this.patientService.getPatientById(id).subscribe((res) => {
      if (res.isSuccess && res.data) {
        this.patient = res.data;
        this.isLoading.set(false);
      }
    });
  }
  onClose() {
    this.nav.goToPatientsList();
  }
}
