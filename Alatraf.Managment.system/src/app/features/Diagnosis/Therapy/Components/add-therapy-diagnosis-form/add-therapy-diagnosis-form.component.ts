import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TherapyDiagnosisFormDto } from '../../Models/therapy-diagnosis-form.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-therapy-diagnosis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  templateUrl: './add-therapy-diagnosis-form.component.html',
  styleUrl: './add-therapy-diagnosis-form.component.css'
})
export class AddTherapyDiagnosisFormComponent {
@Input() patient: any;
  @Output() submitForm = new EventEmitter<TherapyDiagnosisFormDto>();

  private fb = inject(FormBuilder);

  // -----------------------
  // ROOT FORM
  // -----------------------
  form: FormGroup = this.fb.group({
    injurySide: ['', Validators.required],
    injuryType: ['', Validators.required],
    injuryDate: ['', Validators.required],
    injuryAge: ['', Validators.required],
    department: ['', Validators.required],
    diagnosis: ['', Validators.required],
    endDate: [''],
    duration: [''],

    programs: this.fb.array<FormGroup>([]),
  });

  // -----------------------
  // PROGRAMS FORM ARRAY
  // -----------------------
  get programs(): FormArray<FormGroup> {
    return this.form.get('programs') as FormArray<FormGroup>;
  }

  private createProgramRow(): FormGroup {
    return this.fb.group({
      programId: ['', Validators.required],   // program name
      duration: [null, [Validators.required, Validators.min(1)]],
      notes: ['']
    });
  }

  addProgramRow() {
    this.programs.push(this.createProgramRow());
  }

  removeProgramRow(index: number) {
    this.programs.removeAt(index);
  }

  // -----------------------
  // SUBMIT
  // -----------------------
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.form.value);
  }

  // -----------------------
  // INIT
  // -----------------------
  ngOnInit() {
    this.addProgramRow(); // add first row
  }
}
