import { Component, OnInit, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterOutlet } from "@angular/router";
import { Subject, from } from "rxjs";
import { NavigationReceptionFacade } from "../../../../../core/navigation/navigation-reception.facade";
import { PatientsListComponent } from "../../components/patients.list/patients.list.component";
import { PatientFilterDto, Patient } from "../../models/patient.model";
import { PatientsFacade } from "../../Services/patients.facade.service";


@Component({
  selector: 'app-patients-page',
  imports: [PatientsListComponent, RouterOutlet, FormsModule],
  templateUrl: './patients.page.component.html',
  styleUrl: './patients.page.component.css',
})
export class PatientsPageComponent implements OnInit {
  private navReception = inject(NavigationReceptionFacade);
  isDeleting = signal(false);
  searchText = new Subject<string>();
  filters: PatientFilterDto = {};

  private facade = inject(PatientsFacade);
    patients = this.facade.patients;

  ngOnInit() {
  this.facade.loadPatients();
  
  }

  onSearch(term: string) {
    this.facade.search(term);
  }


  onDeletePatient(patient: Patient) {
   this.facade.deletePatient(patient);
  }

  onAddPatient() {
  this.navReception.goToPatientsAdd();
}

}
