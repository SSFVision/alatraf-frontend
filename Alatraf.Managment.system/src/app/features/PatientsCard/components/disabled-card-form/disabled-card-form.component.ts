import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DisabledCardDto } from '../../models/disabled-Models/disabled-card.dto';
import { AddDisabledCardRequest } from '../../models/disabled-Models/add-disabled-card.request';
import { UpdateDisabledCardRequest } from '../../models/disabled-Models/update-disabled-card.request';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-disabled-card-form',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './disabled-card-form.component.html',
  styleUrl: './disabled-card-form.component.css',
})
export class DisabledCardFormComponent implements OnChanges {
  // -----------------------------
  // INPUTS
  // -----------------------------
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() card: DisabledCardDto | null = null;
  @Input() isSubmitting = false;
  @Input() validationErrors: Record<string, string[]> | null = null;

  // -----------------------------
  // OUTPUTS
  // -----------------------------
  @Output() submitCreate = new EventEmitter<AddDisabledCardRequest>();
  @Output() submitUpdate = new EventEmitter<UpdateDisabledCardRequest>();
  @Output() delete = new EventEmitter<void>();


  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(3)]],
      disabilityType: ['', [Validators.required, Validators.minLength(3)]],
      issueDate: ['', Validators.required],
      cardImagePath: [null],
    });
  }

 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['card']) {
      if (this.card && this.mode === 'edit') {
        this.form.patchValue({
          cardNumber: this.card.cardNumber,
          disabilityType: this.card.disabilityType,
          issueDate: this.card.issueDate,
          cardImagePath: this.card.cardImagePath ?? null,
        });
      } else {
        this.form.reset();
      }
    }
  }


  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.mode === 'edit') {
      this.submitUpdate.emit(value as UpdateDisabledCardRequest);
    } else {
      this.submitCreate.emit(value as AddDisabledCardRequest);
    }
  }

  // -----------------------------
  // DELETE HANDLER
  // -----------------------------
  onDelete(): void {
    this.delete.emit();
  }
}
