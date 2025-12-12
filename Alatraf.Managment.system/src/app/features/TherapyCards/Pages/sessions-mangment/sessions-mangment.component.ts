import { Component, signal } from '@angular/core';
import { HeaderPatientInfoComponent } from '../../../../shared/components/header-patient-info/header-patient-info.component';

@Component({
  selector: 'app-sessions-mangment',
  imports: [],
  templateUrl: './sessions-mangment.component.html',
  styleUrl: './sessions-mangment.component.css',
})
export class SessionsMangmentComponent {
  viewMode = signal<'add' | 'history'>('add');

  switchToAdd() {
    this.viewMode.set('add');
  }

  switchToHistory() {
    this.viewMode.set('history');
  }
}
