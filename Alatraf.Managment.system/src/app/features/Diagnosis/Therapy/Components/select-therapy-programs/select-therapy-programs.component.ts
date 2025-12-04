import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-therapy-programs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-therapy-programs.component.html',
  styleUrl: './select-therapy-programs.component.css'
})
export class SelectTherapyProgramsComponent {

  @Input() programs!: FormArray<FormGroup>;
  @Input() medicalPrograms: { id: number; name: string }[] = [];

  trackByIndex(index: number): number {
    return index;
  }

  isRowEmpty(group: FormGroup): boolean {
    const { MedicalProgramId, Duration, Notes } = group.value;
    return !MedicalProgramId && (!Duration || Duration === 0) && !Notes;
  }

  addRowBelow(i: number): void {
    const row = this.programs.at(i) as FormGroup;
    if (this.isRowEmpty(row)) return;
    this.programs.insert(i + 1, this.createRow());
  }

  addRowAtEnd(): void {
    const last = this.programs.at(this.programs.length - 1) as FormGroup;
    if (this.isRowEmpty(last)) return;
    this.programs.push(this.createRow());
  }

  removeRow(i: number): void {
    if (this.programs.length === 1) {
      this.programs.at(0)?.reset({
        MedicalProgramId: null,
        Duration: null,
        Notes: ''
      });
      return;
    }
    this.programs.removeAt(i);
  }

  private createRow(): FormGroup {
    return new FormGroup({
      MedicalProgramId: new FormControl(null),
      Duration: new FormControl(null),
      Notes: new FormControl('')
    });
  }
}
