import { Injectable, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../../core/models/ApiResult';
import { SearchManager } from '../../../../core/utils/search-manager';

import { CreateServiceRequest } from '../Models/create-service.request';
import { UpdateServiceRequest } from '../Models/update-service.request';
import { OrganizationServiceService } from './service.service';
import { ServiceDto } from '../../../../core/models/Shared/service.model';

@Injectable({ providedIn: 'root' })
export class ServicesFacade extends BaseFacade {
  private service = inject(OrganizationServiceService);

  constructor() {
    super();
  }

  private _services = signal<ServiceDto[]>([]);
  // Visible services after applying department filter (or search)
  private _visibleServices = signal<ServiceDto[]>([]);
  services = this._visibleServices.asReadonly();

  private _department = signal<number | null>(null);

  setDepartment(departmentId: number | null) {
    this._department.set(departmentId ?? null);
    this.applyFilters();
  }

  totalCount = signal<number>(0);
  formValidationErrors = signal<Record<string, string[]>>({});

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  // Simple in-memory search manager (filters the cached `_services` list)
  private searchManager = new SearchManager<ServiceDto[]>(
    (term: string) => {
      const normalized = term?.trim().toLowerCase() ?? '';
      if (!normalized) return of(this._services());
      return of(this.filterListByTerm(this._services(), normalized));
    },
    null,
    (items) => {
      // Do not overwrite the master `_services` list with search results.
      // Apply department filter on top of the provided search results.
      this.applyFilters(items);
      this._isLoading.set(false);
    }
  );

  search(term: string) {
    this._isLoading.set(true);
    this.searchManager.search(term);
  }

  loadServices() {
    this._isLoading.set(true);

    this.service
      .getServices()
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this._services.set(res.data);
            this.totalCount.set(res.data.length);
            this.applyFilters();
          } else {
            this._services.set([]);
            this.totalCount.set(0);
            this.handleLoadServicesError(res);
          }

          this._isLoading.set(false);
        })
      )
      .subscribe();
  }

  resetAndLoad(): void {
    this._services.set([]);
    this.totalCount.set(0);
    this.loadServices();
  }

  createService(dto: CreateServiceRequest) {
    return this.handleCreateOrUpdate(this.service.createService(dto), {
      successMessage: 'تم إنشاء الخدمة بنجاح',
      defaultErrorMessage: 'فشل إنشاء الخدمة. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.addServiceToList(res.data as ServiceDto);
          this.applyFilters();
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateService(id: number, dto: UpdateServiceRequest) {
    return this.handleCreateOrUpdate(this.service.updateService(id, dto), {
      successMessage: 'تم تعديل الخدمة بنجاح',
      defaultErrorMessage: 'فشل تعديل الخدمة. حاول لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.updateServiceInList(id, dto);
          this.applyFilters();
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  private _selectedService = signal<ServiceDto | null>(null);
  selectedService = this._selectedService.asReadonly();

  isEditMode = signal<boolean>(false);

  enterCreateMode(): void {
    this.isEditMode.set(false);
    this._selectedService.set(null);
    this.formValidationErrors.set({});
  }

  enterEditMode(service: ServiceDto): void {
    this.isEditMode.set(true);
    this._selectedService.set(service);
    this.formValidationErrors.set({});
  }

  loadServiceForEdit(id: number): void {
    const local = this._services().find((s) => s.serviceId === id);
    if (local) {
      this.enterEditMode(local);
      return;
    }

    this.service
      .getServiceById(id)
      .pipe(
        tap((res: ApiResult<ServiceDto>) => {
          if (res.isSuccess && res.data) {
            this.enterEditMode(res.data);
          } else {
            this.toast.error(res.errorDetail ?? 'لم يتم العثور على الخدمة');
            this.enterCreateMode();
          }
        })
      )
      .subscribe();
  }

  deleteService(service: ServiceDto): void {
    if (!service?.serviceId) return;

    const config = {
      title: 'حذف الخدمة',
      message: 'هل أنت متأكد من حذف الخدمة التالية؟',
      payload: { الاسم: service.name },
    };

    this.confirmAndDelete(
      config,
      () => this.service.deleteService(service.serviceId),
      {
        successMessage: 'تم حذف الخدمة بنجاح',
        defaultErrorMessage: 'فشل حذف الخدمة. حاول لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
        this.removeServiceFromList(service.serviceId);
        this.enterCreateMode();
      }
    });
  }

  private addServiceToList(service: ServiceDto) {
    this._services.update((list) => [service, ...list]);
    this.totalCount.update((c) => c + 1);
  }

  private updateServiceInList(id: number, dto: UpdateServiceRequest) {
    this._services.update((list) =>
      list.map((s) =>
        s.serviceId === id
          ? {
              ...s,
              name: dto.name,
              departmentId: dto.departmentId ?? s.departmentId,
              price: dto.price ?? s.price,
            }
          : s
      )
    );

    const selected = this._selectedService();
    if (selected?.serviceId === id) {
      this._selectedService.set({
        ...selected,
        name: dto.name,
        departmentId: dto.departmentId ?? selected.departmentId,
        price: dto.price ?? selected.price,
      });
    }
  }

  private removeServiceFromList(id: number) {
    this._services.update((list) => list.filter((s) => s.serviceId !== id));
    this.totalCount.update((c) => Math.max(0, c - 1));
  }

  private applyFilters(source?: ServiceDto[]) {
    const base = source ?? this._services();
    const dept = this._department();
    if (dept === null) {
      this._visibleServices.set(base);
      return;
    }

    this._visibleServices.set(base.filter((s) => s.departmentId === dept));
  }

  private filterListByTerm(list: ServiceDto[], normalized: string) {
    return list.filter((s) => {
      const name = (s.name ?? '').toString().toLowerCase();
      const deptName = s.department ?? '';
      return (
        name.includes(normalized) ||
        (deptName && deptName.toLowerCase().includes(normalized)) ||
        (s.serviceId?.toString() ?? '').includes(normalized)
      );
    });
  }

  private handleLoadServicesError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل الخدمات. يرجى المحاولة لاحقاً.');
  }
}
