import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-industrial-diagnosis-workspace',
  imports: [],
  templateUrl: './industrial-diagnosis-workspace.component.html',
  styleUrl: './industrial-diagnosis-workspace.component.css'
})
export class IndustrialDiagnosisWorkspaceComponent {
patientId!:number|string;
  viewMode = signal<'add' | 'history'>('add');
 switchToAdd() {
    this.viewMode.set('add');
  }

  switchToHistory() {
    this.viewMode.set('history');
  }
}
