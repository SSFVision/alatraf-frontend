import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SectionDto } from './../../../Sections/Models/section.dto';
import { Component, EventEmitter, input, Output, output } from '@angular/core';
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

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      rooms: this.fb.array([]),
    });

    this.addRoom();
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
      }
    });

    return control;
  }

  addRoom(name = '') {
    this.rooms.push(this.createRoom(name));
  }

  removeRoom(index: number) {
    if (this.rooms.length > 1) {
      this.rooms.removeAt(index);
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    const dto: AssignNewRoomsToSectionDto = {
      roomNames: this.rooms.controls
        .map((c) => (c as FormControl).value?.trim())
        .filter((v) => v),
    };

    this.save.emit(dto);
  }
}
