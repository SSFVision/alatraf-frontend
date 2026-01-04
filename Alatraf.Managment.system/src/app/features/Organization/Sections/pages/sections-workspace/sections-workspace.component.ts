import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SectionsFacade } from '../../Service/sections.facade.service';
import { AddEditSectionPageComponent } from '../add-edit-section-page/add-edit-section-page.component';
import { SectionRoomsFacade } from '../../Service/section-rooms.facade.service';
import { SectionRoomsFormComponent } from '../../../Rooms/Components/section-rooms-form/section-rooms-form.component';
import { AssignNewRoomsToSectionDto } from '../../Models/assign-new-rooms-to-section.dto';
import { SectionRoomDto } from '../../../Models/section-room.dto';

@Component({
  selector: 'app-sections-workspace',
  imports: [AddEditSectionPageComponent, SectionRoomsFormComponent],
  templateUrl: './sections-workspace.component.html',
  styleUrl: './sections-workspace.component.css',
})
export class SectionsWorkspaceComponent {
  private route = inject(ActivatedRoute);
  private facade = inject(SectionsFacade);
  roomsFacade = inject(SectionRoomsFacade);
  Selectedsection = this.facade.selectedSection;
  isEditMode = this.facade.isEditMode;

  isLoading = signal(true);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('sectionId');

      this.isLoading.set(true);

      if (id) {
        const sectionId = +id;

        this.facade.loadSectionForEdit(sectionId);
        this.roomsFacade.loadBySectionId(sectionId);
      } else {
        this.facade.enterCreateMode();
        this.roomsFacade.clear();
      }
      this.isLoading.set(false);
    });
  }

  openAddNewRoomToSectionDialog = signal(false);
  onAddNewRoomToSection(): void {
    this.openAddNewRoomToSectionDialog.set(true);
    console.log('Add new room to section', this.Selectedsection());
  }
  OnCloseAddForm() {
    this.openAddNewRoomToSectionDialog.set(false);
    this.roomsFacade.loadBySectionId(this.Selectedsection()!.id);
  }
  OnSaveNewRooms(newRooms: AssignNewRoomsToSectionDto) {
    this.facade
      .assignNewRoomsToSection(this.Selectedsection()!.id, newRooms)
      ?.subscribe((res) => {});
  }

  OnEditRoom(room: SectionRoomDto) {}
}
