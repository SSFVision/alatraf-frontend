import { NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-therapy-diagnosis-workspace',
  imports: [],
  templateUrl: './therapy-diagnosis-workspace.component.html',
  styleUrl: './therapy-diagnosis-workspace.component.css'
})
export class TherapyDiagnosisWorkspaceComponent {
patientId!:number|string;
  viewMode = signal<'add' | 'history'>('add');
 switchToAdd() {
    this.viewMode.set('add');
  }

  switchToHistory() {
    this.viewMode.set('history');
  }
}
