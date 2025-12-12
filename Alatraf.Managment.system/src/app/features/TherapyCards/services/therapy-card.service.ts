import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/models/ApiResult';
import { BaseApiService } from '../../../core/services/base-api.service';
import { TherapyCardDto } from '../Models/therapy-card.dto';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { TherapyCardFilterRequest } from '../../Diagnosis/Therapy/Models/therapy-card-filter.request';
import { RenewTherapyCardRequest } from '../Models/renew-therapy-card.request';

@Injectable({ providedIn: 'root' })
export class TherapyCardService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/therapy-cards';
  getAllTherapyCardPagenated(
    filter?: TherapyCardFilterRequest,
    pageRequest?: PageRequest
  ): Observable<ApiResult<PaginatedList<TherapyCardDto>>> {
    let params = new HttpParams();

    const page = pageRequest?.page ?? 1;
    const pageSize = pageRequest?.pageSize ?? 10;

    params = params.set('page', page).set('pageSize', pageSize);

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value as any);
        }
      });
    }
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.get<PaginatedList<TherapyCardDto>>(
      this.endpoint,
      params,
      headers
    );
  }
  getTherapyCardByIdWithSessions(
    therapyCardId: number
  ): Observable<ApiResult<TherapyCardDto>> {
    return this.get<TherapyCardDto>(
      `${this.endpoint}/${therapyCardId}/with-sessions`
    );
  }

  renewTherapyCard(
    therapyCardId: number,
    request: RenewTherapyCardRequest
  ): Observable<ApiResult<TherapyCardDto>> {
    const headers = new HttpHeaders()
      .set('X-Enable-Loader', 'true')
      .set('X-Success-Toast', 'تم تجديد بطاقة العلاج بنجاح');

    return this.post<TherapyCardDto>(
      `${this.endpoint}/${therapyCardId}/renew`,
      request,
      headers
    );
  }



//   private _therapyCards = signal<TherapyCardDto[]>([]);
//   therapyCards = this._therapyCards.asReadonly();

//   private _filters = signal<TherapyCardFilterRequest>({
//     searchTerm: '',
//     sortColumn: 'ProgramStartDate',
//     sortDirection: 'desc',
//     isActive: null,
//     therapyCardType: null,
//     therapyCardStatus: null,
//     programStartFrom: null,
//     programStartTo: null,
//     programEndFrom: null,
//     programEndTo: null,
//     diagnosisId: null,
//     patientId: null,
//   });
//   filters = this._filters.asReadonly();

//   private _pageRequest = signal<PageRequest>({
//     page: 1,
//     pageSize: 10,
//   });
//   pageRequest = this._pageRequest.asReadonly();

//   totalCount = signal<number>(0);

//   // ----------------------- Load All Cards -----------------------
//   loadTherapyCards() {
//     this.therapyService
//       .getAllTherapyCardPagenated(this._filters(), this._pageRequest())
//       .pipe(
//         tap((result) => {
//           if (result.isSuccess && result.data?.items) {
//             this._therapyCards.set(result.data.items);
//             this.totalCount.set(result.data.totalCount ?? 0);
//           } else {
//             this._therapyCards.set([]);
//             this.totalCount.set(0);
//             this.toast.error('تعذر تحميل بطاقات العلاج');
//           }
//         })
//       )
//       .subscribe();
//   }

//   // ----------------------- Update filters -----------------------
//   updateFilters(newFilters: Partial<TherapyCardFilterRequest>) {
//     this._filters.update((f) => ({ ...f, ...newFilters }));
//   }

//   // ----------------------- Pagination -----------------------
//   setPage(page: number) {
//     this._pageRequest.update((p) => ({ ...p, page }));
//     this.loadTherapyCards();
//   }

//   setPageSize(size: number) {
//     this._pageRequest.update((p) => ({ page: 1, pageSize: size }));
//     this.loadTherapyCards();
//   }

//   resetFilters() {
//     this._filters.set({
//       searchTerm: '',
//       sortColumn: 'ProgramStartDate',
//       sortDirection: 'desc',
//       isActive: null,
//       therapyCardType: null,
//       therapyCardStatus: null,
//       programStartFrom: null,
//       programStartTo: null,
//       programEndFrom: null,
//       programEndTo: null,
//       diagnosisId: null,
//       patientId: null,
//     });

//     this._pageRequest.set({ page: 1, pageSize: 10 });
//     this._therapyCards.set([]);
//     this.totalCount.set(0);
//   }



}
