import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PatientDto } from '../../../../../core/models/Shared/patient.model';
import { PatientsFacade } from '../../Services/patients.facade.service';
import { PatientCardsNavigationFacade } from '../../../../../core/navigation/patient-cards-navigation.facade';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { SkeletonComponent } from '../../../../../shared/components/skeleton/skeleton.component';

type TargetFeature = 'disabled-card' | null;

@Component({
  selector: 'app-patient-select-page',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './patient-select-page.component.html',
  styleUrl: './patient-select-page.component.css',
})
export class PatientSelectPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private patientsFacade = inject(PatientsFacade);
  private cardsNav = inject(PatientCardsNavigationFacade);
  private receptionNav = inject(NavigationReceptionFacade);

  target = signal<TargetFeature>(null);

  patients = this.patientsFacade.patients;
  loading = this.patientsFacade.isLoading;

  skeletonRows = Array.from({ length: 5 });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const targetParam = params.get('target');
      if (targetParam === 'disabled-card') {
        this.target.set('disabled-card');
      }
    });

    this.patientsFacade.loadPatients();
  }

  onSearch(term: string): void {
    this.patientsFacade.search(term);
  }

  selectPatient(patient: PatientDto): void {
    if (this.target() === 'disabled-card') {
      this.cardsNav.goToCreateDisabledCardPage(patient.patientId);
    }
  }
  onAddPatient(): void {
    this.receptionNav.goToPatientsAddStandalone({
      queryParams: { redirect: 'select-patient' ,
              target: this.target(), 

      },
    });
  }
}
