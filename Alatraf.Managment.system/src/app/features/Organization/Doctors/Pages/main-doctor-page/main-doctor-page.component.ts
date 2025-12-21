import { Component, inject, signal } from '@angular/core';
import { UsersNavigationFacade } from '../../../../../core/navigation/users-navigation.facade';
import { RouterOutlet } from "@angular/router";
import { DoctorsNavigationFacade } from '../../../../../core/navigation/doctors-navigation.facade';

@Component({
  selector: 'app-main-doctor-page',
  imports: [RouterOutlet],
  templateUrl: './main-doctor-page.component.html',
  styleUrl: './main-doctor-page.component.css'
})
export class MainDoctorPageComponent {
 selectedId = signal<number | string | null>(null);
  private doctorNav = inject(DoctorsNavigationFacade);
  canRout = signal<boolean>(false);
  OnSelectedDoctor(userId: number) {
    this.selectedId.set(userId);
    this.canRout.set(true);
    this.doctorNav.goToEditDoctorPage(userId);
  }

  goToAddUser() {
    this.canRout.set(true);

    this.doctorNav.goToCreateDoctorPage();
  }
}
