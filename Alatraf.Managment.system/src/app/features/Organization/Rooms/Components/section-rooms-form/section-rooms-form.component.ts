import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SectionDto } from './../../../Sections/Models/section.dto';
import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';
import { AssignNewRoomsToSectionDto } from '../../../Sections/Models/assign-new-rooms-to-section.dto';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-section-rooms-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './section-rooms-form.component.html',
  styleUrl: './section-rooms-form.component.css',
})
export class SectionRoomsFormComponent {
  section = input<SectionDto | null>();
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AssignNewRoomsToSectionDto>();
 disableAfterSave = input<boolean>(false);
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      rooms: this.fb.array([]),
    });

    this.addRoom();
    this.updateRoomValidators();

    // Recompute duplicate errors when any room value changes
    this.rooms.valueChanges.subscribe(() => this.updateDuplicateErrors());
  }

  get rooms(): FormArray {
    return this.form.get('rooms') as FormArray;
  }

  // Helper to get FormControl at index
  roomControl(index: number): FormControl {
    return this.rooms.at(index) as FormControl;
  }

  createRoom(name = ''): FormControl {
    const control = this.fb.control(name, Validators.required);

    control.valueChanges.subscribe((value) => {
      const lastIndex = this.rooms.length - 1;
      if (this.rooms.at(lastIndex) === control && value?.trim() !== '') {
        this.addRoom();
        this.updateRoomValidators();
      }
    });

    return control;
  }

  addRoom(name = '') {
    
    this.rooms.push(this.createRoom(name));
    // Check duplicates after adding a control
    this.updateDuplicateErrors();
    this.updateRoomValidators();
  }

  removeRoom(index: number) {
    if (this.rooms.length > 1) {
      this.rooms.removeAt(index);
      this.updateRoomValidators();
      this.updateDuplicateErrors();
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    // Prevent save if there are validation errors (including duplicates)
    this.updateDuplicateErrors();
    if (this.form.invalid) {
      return;
    }
    const dto: AssignNewRoomsToSectionDto = {
      roomNames: this.rooms.controls
        .map((c) => (c as FormControl).value?.trim())
        .filter((v) => v),
    };

    this.save.emit(dto);
  }

  private updateDuplicateErrors() {
    const normalizedNames: (string | null)[] = this.rooms.controls.map((c) => {
      const v = (c as FormControl).value;
      return typeof v === 'string' && v.trim() !== ''
        ? v.trim().toLowerCase()
        : null;
    });

    const counts = new Map<string, number>();
    normalizedNames.forEach((name) => {
      if (!name) return;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    });

    this.rooms.controls.forEach((ctrl, idx) => {
      const name = normalizedNames[idx];
      const isDuplicate = !!name && (counts.get(name) ?? 0) > 1;
      const existingErrors = (ctrl as FormControl).errors;
      const currentErrors: Record<string, any> = existingErrors
        ? { ...existingErrors }
        : {};

      if (isDuplicate) {
        currentErrors['duplicate'] = true;
      } else {
        if ('duplicate' in currentErrors) {
          delete currentErrors['duplicate'];
        }
      }

      const hasErrors = Object.keys(currentErrors).length > 0;
      (ctrl as FormControl).setErrors(hasErrors ? currentErrors : null);
    });
  }

  private updateRoomValidators() {
    const lastIndex = this.rooms.length - 1;
    this.rooms.controls.forEach((ctrl, idx) => {
      const c = ctrl as FormControl;
      if (idx < lastIndex) {
        c.setValidators([Validators.required]);
      } else {
        c.clearValidators();
      }
      c.updateValueAndValidity({ emitEvent: false });
    });
  }
}
