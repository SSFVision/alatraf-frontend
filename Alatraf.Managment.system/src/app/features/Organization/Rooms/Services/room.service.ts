import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../../../core/models/ApiResult';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../../core/models/Shared/paginated-list.model';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { CreateRoomRequest } from '../Models/create-room.request';
import { RoomDto } from '../Models/room.dto';
import { RoomsFilterRequest } from '../Models/rooms-filter.request';
import { UpdateRoomRequest } from '../Models/update-room.request';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends BaseApiService {
  private readonly endpoint = 'rooms';

  getRooms(
    filters: RoomsFilterRequest,
    pagination: PageRequest
  ): Observable<ApiResult<PaginatedList<RoomDto>>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('pageSize', pagination.pageSize);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value as any);
        }
      });
    }

    return this.get<PaginatedList<RoomDto>>(this.endpoint, params);
  }

  getRoomById(roomId: number): Observable<ApiResult<RoomDto>> {
    return this.get<RoomDto>(`${this.endpoint}/${roomId}`);
  }

  createRoom(dto: CreateRoomRequest): Observable<ApiResult<RoomDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<RoomDto>(this.endpoint, dto, headers);
  }

  updateRoom(
    roomId: number,
    dto: UpdateRoomRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(`${this.endpoint}/${roomId}`, dto, headers);
  }

  deleteRoom(roomId: number): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(`${this.endpoint}/${roomId}`, undefined, headers);
  }
}
