import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AddDisabledCardRequest } from '../../models/disabled-Models/add-disabled-card.request';
import { DisabledCardDto } from '../../models/disabled-Models/disabled-card.dto';
import { UpdateDisabledCardRequest } from '../../models/disabled-Models/update-disabled-card.request';
type DisabledCardFormMode = 'create' | 'edit';

@Component({
  selector: 'app-disabled-card-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './disabled-card-form.component.html',
  styleUrl: './disabled-card-form.component.css',
})
export class DisabledCardFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  // -----------------------------
  // INPUTS
  // -----------------------------
  @Input({ required: true }) mode: DisabledCardFormMode = 'create';
  @Input() card: DisabledCardDto | null = null;
  @Input() saving = false;

  @Input({ required: true }) patientId!: number;

  @Output() create = new EventEmitter<AddDisabledCardRequest>();
  @Output() update = new EventEmitter<{
    id: number;
    dto: UpdateDisabledCardRequest;
  }>();
  @Output() delete = new EventEmitter<DisabledCardDto>();

  canSubmit = signal(false);
  canDelete = () => this.mode === 'edit';

  // -----------------------------
  // FORM
  // -----------------------------
  form = this.fb.group({
    cardNumber: this.fb.nonNullable.control('', Validators.required),
    disabilityType: this.fb.nonNullable.control('', Validators.required),
    issueDate: this.fb.nonNullable.control('', Validators.required),
    cardImagePath: this.fb.control<string | null>(null),
  });

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.canSubmit.set(this.form.valid && this.form.dirty);
    });
  }

  // -----------------------------
  // INPUT CHANGES
  // -----------------------------
  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === 'edit') {
      if (!this.card) return;
      this.enterEditForm(this.card);
      return;
    }

    this.enterCreateForm();
  }

  // -----------------------------
  // FORM MODES
  // -----------------------------
  private enterEditForm(card: DisabledCardDto): void {
    this.form.setValue({
      cardNumber: card.cardNumber,
      disabilityType: card.disabilityType,
      issueDate: card.issueDate,
      cardImagePath: card.cardImagePath ?? null,
    });

    this.form.markAsPristine();
    this.canSubmit.set(false);
  }

  private enterCreateForm(): void {
    this.form.reset({
      cardNumber: '',
      disabilityType: '',
      issueDate: '',
      cardImagePath: null,
    });

    this.form.markAsPristine();
    this.canSubmit.set(false);
  }

  // -----------------------------
  // SUBMIT / DELETE
  // -----------------------------
  submit(): void {
    if (!this.canSubmit() || this.saving) return;

    const base = {
      patientId: this.patientId,
      cardNumber: this.form.controls.cardNumber.value,
      disabilityType: this.form.controls.disabilityType.value,
      issueDate: this.form.controls.issueDate.value,
      cardImagePath: this.form.controls.cardImagePath.value,
    };

    if (this.mode === 'edit') {
      if (!this.card) return;

      this.update.emit({
        id: this.card.disabledCardId,
        dto: base,
      });
      return;
    }

    this.create.emit(base);
  }

  onDelete(): void {
    if (!this.card || this.saving) return;
    this.delete.emit(this.card);
  }
}
