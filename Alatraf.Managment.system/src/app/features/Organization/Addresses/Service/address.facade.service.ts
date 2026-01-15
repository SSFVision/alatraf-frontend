import { Injectable, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../../core/models/ApiResult';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { SearchManager } from '../../../../core/utils/search-manager';

import { AddressService } from './address.service';
import { AddressDto } from '../Models/address.dto';
import { CreateAddressRequest } from '../Models/create-adress.request';
import { UpdateAddressRequest } from '../Models/update-adress.request';

@Injectable({ providedIn: 'root' })
export class AddressesFacade extends BaseFacade {
  private service = inject(AddressService);

  constructor() {
    super();
  }

  private _addresses = signal<AddressDto[]>([]);
  addresses = this._addresses.asReadonly();

  private _searchTerm = signal<string>('');
  searchTerm = this._searchTerm.asReadonly();

  _pageSize: number = 10;
  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: this._pageSize,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);
  formValidationErrors = signal<Record<string, string[]>>({});

  private searchManager = new SearchManager<AddressDto[]>(
    (term: string) =>
      this.service.getAddresses(term, this._pageRequest()).pipe(
        tap((res) => {
          if (!res.isSuccess) this.handleLoadAddressesError(res);
        }),
        map((res) => (res.isSuccess && res.data?.items ? res.data.items : []))
      ),
    null,
    (items) => this._addresses.set(items)
  );

  search(term: string) {
    this._searchTerm.set(term);
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this.searchManager.search(term);
  }

  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadAddresses();
  }

  setPageSize(size: number) {
    this._pageRequest.update(() => ({ page: 1, pageSize: size }));
    this.loadAddresses();
  }

  loadAddresses() {
    this.service
      .getAddresses(this._searchTerm(), this._pageRequest())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data?.items) {
            this._addresses.set(res.data.items);
            this.totalCount.set(res.data.totalCount ?? 0);
          } else {
            this._addresses.set([]);
            this.totalCount.set(0);
            this.handleLoadAddressesError(res);
          }
        })
      )
      .subscribe();
  }

  reset() {
    this._searchTerm.set('');
    this._pageRequest.set({ page: 1, pageSize: this._pageSize });
    this._addresses.set([]);
    this.totalCount.set(0);
    this.formValidationErrors.set({});
  }

  // ---------------------------------------------
  // CREATE / UPDATE
  // ---------------------------------------------
  createAddress(dto: CreateAddressRequest) {
    return this.handleCreateOrUpdate(this.service.createAddress(dto), {
      successMessage: 'تم إنشاء العنوان بنجاح',
      defaultErrorMessage: 'فشل إنشاء العنوان. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.addAddressToList(res.data);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateAddress(id: number, dto: UpdateAddressRequest) {
    return this.handleCreateOrUpdate(this.service.updateAddress(id, dto), {
      successMessage: 'تم تعديل العنوان بنجاح',
      defaultErrorMessage: 'فشل تعديل العنوان. حاول لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.updateAddressInList(id, dto);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------
  deleteAddress(address: AddressDto): void {
    if (!address?.id) return;

    const config = {
      title: 'حذف العنوان',
      message: 'هل أنت متأكد من حذف العنوان التالي؟',
      payload: { الاسم: address.name },
    };

    this.confirmAndDelete(
      config,
      () => this.service.deleteAddress(address.id),
      {
        successMessage: 'تم حذف العنوان بنجاح',
        defaultErrorMessage: 'فشل حذف العنوان. حاول لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
        this.removeAddressFromList(address.id);
      }
    });
  }

  // ---------------------------------------------
  // LOCAL LIST HELPERS
  // ---------------------------------------------
  private addAddressToList(address: AddressDto) {
    this._addresses.update((list) => [address, ...list]);
    this.totalCount.update((c) => c + 1);
  }

  private updateAddressInList(id: number, dto: UpdateAddressRequest) {
    this._addresses.update((list) =>
      list.map((a) => (a.id === id ? { ...a, name: dto.name } : a))
    );
  }

  private removeAddressFromList(id: number) {
    this._addresses.update((list) => list.filter((a) => a.id !== id));
    this.totalCount.update((c) => Math.max(0, c - 1));
  }

  private handleLoadAddressesError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل العناوين. يرجى المحاولة لاحقاً.');
  }
}
