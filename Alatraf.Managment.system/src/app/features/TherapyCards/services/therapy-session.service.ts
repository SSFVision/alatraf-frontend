import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/models/ApiResult';
import { BaseApiService } from '../../../core/services/base-api.service';
import { CreateSessionRequest } from '../Models/create-session.request';
import { SessionDto } from '../Models/session.dto';
import { TherapyCardDto } from '../Models/therapy-card.dto';

@Injectable({
  providedIn: 'root',
})
export class TherapySessionService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/therapy-cards';

  createSession(
    therapyCardId: number,
    request: CreateSessionRequest
  ): Observable<ApiResult<SessionDto[]>> {
    const headers = new HttpHeaders()
      .set('X-Enable-Loader', 'true')
      .set('X-Success-Toast', 'تم إنشاء الجلسة بنجاح');

    return this.post<SessionDto[]>(
      `${this.endpoint}/${therapyCardId}/create-session`,
      request,
      headers
    );
  }
}
