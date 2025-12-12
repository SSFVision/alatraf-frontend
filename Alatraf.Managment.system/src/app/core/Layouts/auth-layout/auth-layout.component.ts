import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { TherapyWaitingListComponent } from "../../../features/Diagnosis/Therapy/Pages/therapy-waiting-list/therapy-waiting-list.component";

@Component({
  selector: 'app-auth-layout',
  imports: [ RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

}
