import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { DoctorHeaderInfoComponent } from '../../../../shared/components/doctor-header-info/doctor-header-info.component';
import { TherapistFacade } from '../../services/TherapistFacade.service';
import { TherapistSessionsCardComponent } from '../therapist-sessions-card/therapist-sessions-card.component';

@Component({
  selector: 'app-therapist-doctor-assigments',
  standalone: true,
  imports: [
    CommonModule,
    DoctorHeaderInfoComponent,
    TherapistSessionsCardComponent,
  ],
  templateUrl: './therapist-doctor-assigments.component.html',
  styleUrl: './therapist-doctor-assigments.component.css',
})
export class TherapistDoctorAssigmentsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  doctorFacade = inject(TherapistFacade);

  therapistHeader = this.doctorFacade.therapistHeader;
  loadingTherapistData = this.doctorFacade.loadingTherapistData;
  ngOnInit(): void {
    this.listenToRouteParamsChange();
  }

  ngOnDestroy(): void {
    this.doctorFacade.resetTherapistState();
  }

  private listenToRouteParamsChange(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('doctorSectionRoomId');

        this.doctorFacade.resetTherapistState();

        if (id !== null && id !== undefined) {
          const doctorSectionRoomId = +id;
          this.doctorFacade.loadTherapistHeader(doctorSectionRoomId);
          this.doctorFacade.loadTherapistSessions(doctorSectionRoomId);
        }
      });
  }

  onSessionCardClick(session: any): void {
    console.log('Sessioncard clicked:', session);
  }
  onSearch(term: string): void {
    this.doctorFacade.search(term);
  }
}
