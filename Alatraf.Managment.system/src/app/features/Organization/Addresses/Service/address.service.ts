import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpHeaders } from '@angular/common/http';

import { ApiResult } from '../../../../core/models/ApiResult';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { AddressDto } from '../Models/address.dto';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../../core/models/Shared/paginated-list.model';
import { CreateAdressRequest } from '../Models/create-adress.request';
import { UpdateAdressRequest } from '../Models/update-adress.request';

@Injectable({
  providedIn: 'root',
})
export class AddressService extends BaseApiService {
  private readonly endpoint = 'addresses';

  // GET: Paginated Addresses with optional search term
  getAddresses(
    searchTerm: string | null,
    pagination: PageRequest
  ): Observable<ApiResult<PaginatedList<AddressDto>>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('pageSize', pagination.pageSize);

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.get<PaginatedList<AddressDto>>(this.endpoint, params);
  }

  // GET: Address by ID
  getAddressById(addressId: number): Observable<ApiResult<AddressDto>> {
    return this.get<AddressDto>(`${this.endpoint}/${addressId}`);
  }

  // POST: Create Address
  createAddress(dto: CreateAdressRequest): Observable<ApiResult<AddressDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<AddressDto>(this.endpoint, dto, headers);
  }

  // PUT: Update Address
  updateAddress(
    addressId: number,
    dto: UpdateAdressRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(`${this.endpoint}/${addressId}`, dto, headers);
  }

  // DELETE: Delete Address
  deleteAddress(addressId: number): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(
      `${this.endpoint}/${addressId}`,
      undefined,
      headers
    );
  }
}
