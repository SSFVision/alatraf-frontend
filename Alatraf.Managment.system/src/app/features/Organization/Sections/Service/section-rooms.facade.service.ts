import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

import { ApiResult } from '../../../../core/models/ApiResult';
import { BaseFacade } from '../../../../core/utils/facades/base-facade';

import { SectionRoomDto } from '../../Models/section-room.dto';
import { OrganizationService } from '../../organization.service';
import { AssignNewRoomsToSectionDto } from '../Models/assign-new-rooms-to-section.dto';
import { SectionService } from './section.service';
import { RoomsFacade } from '../../Rooms/Services/room.facade.service';
import { RoomService } from '../../Rooms/Services/room.service';

@Injectable({ providedIn: 'root' })
export class SectionRoomsFacade extends BaseFacade {
  private service = inject(OrganizationService);
  private sectionService = inject(SectionService);

  constructor() {
    super();
  }

  // ---------------------------------------------
  // STATE
  // ---------------------------------------------
  private _rooms = signal<SectionRoomDto[]>([]);
  rooms = this._rooms.asReadonly();

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  private _sectionId = signal<number | null>(null);
  sectionId = this._sectionId.asReadonly();

  // ---------------------------------------------
  // LOAD ROOMS
  // ---------------------------------------------
  loadBySectionId(sectionId: number): void {
    if (!sectionId) return;

    // prevent unnecessary reload
    // if (this._sectionId() === sectionId && this._rooms().length) return;
    console.log('start load rooms for section id:', sectionId);
    this._sectionId.set(sectionId);
    this._isLoading.set(true);

    this.service
      .getRoomsBySectionId(sectionId)
      .pipe(
        tap((res: ApiResult<SectionRoomDto[]>) => {
          if (res.isSuccess && res.data) {
            this._rooms.set(res.data);
          } else {
            this._rooms.set([]);
            this.toast.error(
              res.errorDetail ?? 'تعذر تحميل الغرف الخاصة بالقسم'
            );
          }

          this._isLoading.set(false);
        })
      )
      .subscribe();
  }

  // ---------------------------------------------
  // CLEAR / RESET
  // ---------------------------------------------
  clear(): void {
    this._rooms.set([]);
    this._sectionId.set(null);
  }

  assignNewRooms(roomNames: string[]): void {
    const sectionId = this._sectionId();
    if (!sectionId || roomNames.length === 0) return;

    const dto: AssignNewRoomsToSectionDto = {
      roomNames,
    };

    this._isLoading.set(true);

    this.sectionService
      .assignNewRoomsToSection(sectionId, dto)
      .pipe(
        tap((res: ApiResult<void>) => {
          if (res.isSuccess) {
            this.toast.success('تمت إضافة الغرف بنجاح');
            this.loadBySectionId(sectionId); // 🔄 reload rooms
          } else {
            this.toast.error(res.errorDetail ?? 'فشل إضافة الغرف للقسم');
            this._isLoading.set(false);
          }
        })
      )
      .subscribe();
  }

  private roomService = inject(RoomService);

  deleteRoomFromSpecificSection(room: SectionRoomDto, sectionId: number) {
    if (!room?.roomId) return;

    const config = {
      title: 'حذف الغرفة',
      message: 'هل أنت متأكد من حذف الغرفة التالية؟',
      payload: { الاسم: room.roomName },
    };

    this.confirmAndDelete(
      config,
      () => this.roomService.deleteRoom(room.roomId),
      {
        successMessage: 'تم حذف الغرفة بنجاح',
        defaultErrorMessage: 'فشل حذف الغرفة. حاول لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
        console.log('Room deleted successfully', sectionId);

        this.loadBySectionId(sectionId);
      }
    });
  }
}
