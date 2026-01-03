import { NgFor } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { SectionRoomDto } from '../../../features/Organization/Models/section-room.dto';

@Component({
  selector: 'app-section-rooms-table',
  standalone: true,
  imports: [NgFor],
  templateUrl: './section-rooms-table.component.html',
  styleUrl: './section-rooms-table.component.css',
})
export class SectionRoomsTableComponent {
 rooms=input<SectionRoomDto[]>([]);

  @Output() editRoom = new EventEmitter<SectionRoomDto>();
  @Output() deleteRoom = new EventEmitter<number>();
  @Output() addRoom = new EventEmitter<void>();
  loading = input<boolean>(false);
 
  onEdit(room: SectionRoomDto): void {
    this.editRoom.emit(room);
  }

  onDelete(roomId: number): void {
    this.deleteRoom.emit(roomId);
  }

 
}
