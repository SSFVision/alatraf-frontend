import { Injectable, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../../core/models/ApiResult';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { SearchManager } from '../../../../core/utils/search-manager';

import { RoomService } from './room.service';
import { CreateRoomRequest } from '../Models/create-room.request';
import { RoomDto } from '../Models/room.dto';
import { RoomsFilterRequest } from '../Models/rooms-filter.request';
import { UpdateRoomRequest } from '../Models/update-room.request';

@Injectable({ providedIn: 'root' })
export class RoomsFacade extends BaseFacade {
  private service = inject(RoomService);

  constructor() {
    super();
  }

  private _rooms = signal<RoomDto[]>([]);
  rooms = this._rooms.asReadonly();

  private _filters = signal<RoomsFilterRequest>({
    searchTerm: '',
    sectionId: null,
    departmentId: null,
    sortColumn: 'name',
    sortDirection: 'asc',
  });
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 10,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);
  formValidationErrors = signal<Record<string, string[]>>({});

  private searchManager = new SearchManager<RoomDto[]>(
    (term: string) =>
      this.service
        .getRooms({ ...this._filters(), searchTerm: term }, this._pageRequest())
        .pipe(
          tap((res) => {
            if (!res.isSuccess) this.handleLoadRoomsError(res);
          }),
          map((res) => (res.isSuccess && res.data?.items ? res.data.items : []))
        ),
    null,
    (items) => this._rooms.set(items)
  );

  search(term: string) {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this.searchManager.search(term);
  }

  updateFilters(newFilters: Partial<RoomsFilterRequest>) {
    this._filters.update((f) => ({ ...f, ...newFilters }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
  }

  setSection(sectionId: number | null) {
    this._filters.update((f) => ({
      ...f,
      sectionId: sectionId ?? null,
    }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
  }

  setDepartment(departmentId: number | null) {
    this._filters.update((f) => ({
      ...f,
      departmentId: departmentId ?? null,
    }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
  }

  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadRooms();
  }

  setPageSize(size: number) {
    this._pageRequest.update(() => ({ page: 1, pageSize: size }));
    this.loadRooms();
  }

  loadRooms() {
    this.service
      .getRooms(this._filters(), this._pageRequest())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data?.items) {
            this._rooms.set(res.data.items);
            this.totalCount.set(res.data.totalCount ?? 0);
          } else {
            this._rooms.set([]);
            this.totalCount.set(0);
            this.handleLoadRoomsError(res);
          }
        })
      )
      .subscribe();
  }

  resetFilters() {
    this._filters.set({
      searchTerm: '',
      sectionId: null,
      departmentId: null,
      sortColumn: 'name',
      sortDirection: 'asc',
    });

    this._pageRequest.set({ page: 1, pageSize: 10 });
    this._rooms.set([]);
    this.totalCount.set(0);
  }

  // ---------------------------------------------
  // CREATE / UPDATE
  // ---------------------------------------------
  createRoom(dto: CreateRoomRequest) {
    return this.handleCreateOrUpdate(this.service.createRoom(dto), {
      successMessage: 'تم إنشاء الغرفة بنجاح',
      defaultErrorMessage: 'فشل إنشاء الغرفة. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.addRoomToList(res.data);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateRoom(id: number, dto: UpdateRoomRequest) {
    return this.handleCreateOrUpdate(this.service.updateRoom(id, dto), {
      successMessage: 'تم تعديل الغرفة بنجاح',
      defaultErrorMessage: 'فشل تعديل الغرفة. حاول لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.updateRoomInList(id, dto);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------
  deleteRoom(room: RoomDto): void {
    if (!room?.id) return;

    const config = {
      title: 'حذف الغرفة',
      message: 'هل أنت متأكد من حذف الغرفة التالية؟',
      payload: { الاسم: room.name },
    };

    this.confirmAndDelete(config, () => this.service.deleteRoom(room.id), {
      successMessage: 'تم حذف الغرفة بنجاح',
      defaultErrorMessage: 'فشل حذف الغرفة. حاول لاحقاً.',
    }).subscribe((success) => {
      if (success) {
        this.removeRoomFromList(room.id);
      }
    });
  }

  // ---------------------------------------------
  // LOCAL LIST HELPERS
  // ---------------------------------------------
  private addRoomToList(room: RoomDto) {
    this._rooms.update((list) => [room, ...list]);
    this.totalCount.update((c) => c + 1);
  }

  private updateRoomInList(id: number, dto: UpdateRoomRequest) {
    this._rooms.update((list) =>
      list.map((r) => (r.id === id ? { ...r, name: dto.newName } : r))
    );
  }

  private removeRoomFromList(id: number) {
    this._rooms.update((list) => list.filter((r) => r.id !== id));
    this.totalCount.update((c) => Math.max(0, c - 1));
  }

  private handleLoadRoomsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل الغرف. يرجى المحاولة لاحقاً.');
  }
}
