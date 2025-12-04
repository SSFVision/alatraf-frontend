import { CommonModule, NgFor } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-industrial-diagnosis-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-industrial-diagnosis-form.component.html',
  styleUrl: './add-industrial-diagnosis-form.component.css',
})
export class AddIndustrialDiagnosisFormComponent {
  @Input() patient: any; // you can replace with your patient model
  @Output() submitForm = new EventEmitter<any>();

  private fb = inject(FormBuilder);

  // -----------------------
  // FORM ROOT
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

    industrialParts: this.fb.array<FormGroup>([]),
  });

  // -----------------------
  // PARTS FORM ARRAY
  // -----------------------
  get industrialParts(): FormArray<FormGroup> {
    return this.form.get('industrialParts') as FormArray<FormGroup>;
  }

  private createIndustrialPartRow(): FormGroup {
    return this.fb.group({
      partId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitId: ['', Validators.required],
      sectionId: ['', Validators.required],
      notes: [''],
    });
  }

  addPartRow() {
    this.industrialParts.push(this.createIndustrialPartRow());
  }

  removePartRow(index: number) {
    this.industrialParts.removeAt(index);
  }

  // -----------------------
  // SUBMIT
  // -----------------------
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log("form value",this.form.value);
    this.submitForm.emit(this.form.value);
  }

  // -----------------------
  // INIT
  // -----------------------
  ngOnInit() {
    this.addPartRow();
  }
}
