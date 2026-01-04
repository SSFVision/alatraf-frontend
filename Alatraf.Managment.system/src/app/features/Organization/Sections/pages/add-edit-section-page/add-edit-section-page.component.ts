import { CommonModule } from '@angular/common';
import { Component, effect, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SectionsFacade } from '../../Service/sections.facade.service';

import { SectionsNavigationFacade } from '../../../../../core/navigation/sections-navigation.facade';
import { SectionRoomsTableComponent } from '../../../../../shared/components/section-rooms-table/section-rooms-table.component';
import { DepartmentsFacade } from '../../../Departments/departments.facade.service';
import { SectionRoomDto } from '../../../Models/section-room.dto';
import { CreateSectionRequest } from '../../Models/create-section.request';
import { UpdateSectionRequest } from '../../Models/update-section.request';
import { SectionRoomsFacade } from '../../Service/section-rooms.facade.service';

@Component({
  selector: 'app-add-edit-section-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SectionRoomsTableComponent],
  templateUrl: './add-edit-section-page.component.html',
  styleUrl: './add-edit-section-page.component.css',
})
export class AddEditSectionPageComponent {
  private fb = inject(FormBuilder);
  private sectionfacade = inject(SectionsFacade);
  private departmentsFacade = inject(DepartmentsFacade);
  private nav = inject(SectionsNavigationFacade);
  sectionRoomsFacade = inject(SectionRoomsFacade);
  Selectedsection = this.sectionfacade.selectedSection;

  rooms = this.sectionRoomsFacade.rooms;
  roomsLoading = this.sectionRoomsFacade.isLoading;
  editRoom = output<SectionRoomDto>();

  isEditMode = this.sectionfacade.isEditMode;
  canDelete = signal(false);
  canSubmit = signal(false);

  form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    departmentId: this.fb.nonNullable.control<number | null>(
      null,
      Validators.required
    ),
  });

  departments = this.departmentsFacade.departments;

  constructor() {
    this.departmentsFacade.loadDepartments();

    effect(() => {
      const section = this.sectionfacade.selectedSection();
      if (!section) return;

      this.form.patchValue({
        name: section.name,
        departmentId: section.departmentId,
      });

      this.form.markAsPristine();
      this.form.enable();
      this.form.controls.departmentId.disable({ emitEvent: false });

      this.canDelete.set(true);
      this.canSubmit.set(false);
    });

    effect(() => {
      if (this.isEditMode()) return;

      this.form.reset({
        name: '',
        departmentId: null,
      });
      this.form.controls.departmentId.enable({ emitEvent: false });

      this.form.markAsPristine();
      this.form.enable();
      this.canDelete.set(false);
      this.canSubmit.set(false);
    });

    this.form.valueChanges.subscribe(() => {
      this.canSubmit.set(this.form.valid && this.form.dirty);
    });
  }

  submit() {
    if (!this.canSubmit()) return;

    const name = this.form.controls.name.value;
    const departmentId = this.form.controls.departmentId.value!;

    if (this.isEditMode()) {
      const section = this.sectionfacade.selectedSection();
      if (!section) return;

      const updateDto: UpdateSectionRequest = {
        name,
        // departmentId
      };

      this.sectionfacade
        .updateSection(section.id, updateDto)
        .subscribe((res) => {
          if (res.success) {
            this.form.disable();
            this.form.markAsPristine();
            this.canSubmit.set(false);
            this.canDelete.set(true);
          }
        });
    } else {
      const createDto: CreateSectionRequest = {
        name,
        departmentId,
      };

      this.sectionfacade.createSection(createDto).subscribe((res) => {
        if (res.success && res.data) {
          this.nav.goToEditSectionPage(res.data.id);
          this.form.markAsPristine();
          this.canDelete.set(true);
          this.canSubmit.set(false);
        }
      });
    }
  }

  delete() {
    const section = this.sectionfacade.selectedSection();
    if (!section) return;

    this.sectionfacade.deleteSection(section);
  }
  onEditRoom(room: SectionRoomDto) {
    this.editRoom.emit(room);
  }

  onDeleteRoom(sectionRoom: SectionRoomDto) {
    this.sectionRoomsFacade.deleteRoomFromSpecificSection(
      sectionRoom,
      this.Selectedsection()?.id!
    );
  }
}
