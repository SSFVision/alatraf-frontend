import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize, map, tap } from 'rxjs/operators';

import { ApiResult } from '../../../../core/models/ApiResult';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { SearchManager } from '../../../../core/utils/search-manager';

import { DoctorsNavigationFacade } from '../../../../core/navigation/doctors-navigation.facade';
import { AssignDoctorToSectionRoomRequest } from '../Models/assign-doctor-to-section-room.request';
import { AssignDoctorToSectionRequest } from '../Models/assign-doctor-to-section.request';
import { CreateDoctorRequest } from '../Models/create-doctor.request';
import { DoctorListItemDto } from '../Models/doctor-list-item.dto';
import { DoctorDto } from '../Models/doctor.dto';
import { DoctorsFilterRequest } from '../Models/doctors-filter.request';
import { UpdateDoctorRequest } from '../Models/update-doctor.request';
import { DoctorService } from './doctor.service';

@Injectable({ providedIn: 'root' })
export class DoctorFacade extends BaseFacade {
  private service = inject(DoctorService);

  constructor() {
    super();
  }

  private _doctors = signal<DoctorListItemDto[]>([]);
  doctors = this._doctors.asReadonly();
  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  hasActiveFilters = computed(() => {
    const f = this._filters();
    return !!(
      f.departmentId ||
      f.sectionId ||
      f.roomId ||
      f.search ||
      f.specialization ||
      f.hasActiveAssignment !== null
    );
  });

  private _filters = signal<DoctorsFilterRequest>({
    departmentId: null,
    sectionId: null,
    roomId: null,
    search: '',
    specialization: null,
    hasActiveAssignment: null,
    sortBy: 'assigndate',
    sortDir: 'desc',
  });
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 30,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);
  formValidationErrors = signal<Record<string, string[]>>({});

  private doctorNav = inject(DoctorsNavigationFacade);
  private searchManager = new SearchManager<DoctorListItemDto[]>(
    (term: string) =>
      this.service
        .getDoctors({ ...this._filters(), search: term }, this._pageRequest())
        .pipe(
          tap((res) => {
            if (!res.isSuccess) this.handleLoadDoctorsError(res);
          }),
          map((res) => (res.isSuccess && res.data?.items ? res.data.items : []))
        ),
    null,
    (items) => {
      this._isLoading.set(false);

      this._doctors.set(items);
    }
  );

  search(term: string) {
    this._filters.update((f) => ({ ...f, search: term }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this._isLoading.set(true);
    this.searchManager.search(term);
  }

  updateFilters(newFilters: Partial<DoctorsFilterRequest>) {
    // if (this._doctors().length === 0) return;

    this._filters.update((f) => ({ ...f, ...newFilters }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this.loadDoctors();
  }

  setDepartment(departmentId: number | null) {
    // if (this._doctors().length === 0) return;

    this._filters.update((f) => ({
      ...f,
      departmentId: departmentId ?? null,
    }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this.loadDoctors();
  }

  setSection(sectionId: number | null) {
    this._filters.update((f) => ({
      ...f,
      sectionId: sectionId ?? null,
    }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
  }

  setRoom(roomId: number | null) {
    this._filters.update((f) => ({
      ...f,
      roomId: roomId ?? null,
    }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
  }

  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadDoctors();
  }

  setPageSize(size: number) {
    this._pageRequest.update(() => ({ page: 1, pageSize: size }));
    this.loadDoctors();
  }
  setSorting(sortBy: string, sortDir: 'asc' | 'desc') {
    this._filters.update((f) => ({ ...f, sortBy, sortDir }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this.loadDoctors();
  }

  loadDoctors() {
    if (this.isLoading()) return;

    this._isLoading.set(true);

    this.service
      .getDoctors(this._filters(), this._pageRequest())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data?.items) {
            this._doctors.set(res.data.items);
            this.totalCount.set(res.data.totalCount ?? 0);
          } else {
            this._doctors.set([]);
            this.totalCount.set(0);
            this.handleLoadDoctorsError(res);
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }

  resetFilters() {
    this._filters.set({
      departmentId: null,
      sectionId: null,
      roomId: null,
      search: '',
      specialization: null,
      hasActiveAssignment: null,
      sortBy: 'assigndate',
      sortDir: 'desc',
    });

    this._pageRequest.set({ page: 1, pageSize: 30 });
    this._doctors.set([]);
    this.totalCount.set(0);
  }

  createDoctor(dto: CreateDoctorRequest) {
    return this.handleCreateOrUpdate(this.service.createDoctor(dto), {
      successMessage: 'تم إنشاء الطبيب بنجاح',
      defaultErrorMessage: 'فشل إنشاء الطبيب. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.loadDoctors();
          this.enterEditMode(res.data);
          this.doctorNav.goToEditDoctorPage(res.data.doctorId);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateDoctor(id: number, dto: UpdateDoctorRequest) {
    return this.handleCreateOrUpdate(this.service.updateDoctor(id, dto), {
      successMessage: 'تم تعديل بيانات الطبيب بنجاح',
      defaultErrorMessage: 'فشل تعديل بيانات الطبيب. حاول لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.loadDoctors();
          // this.updateDoctorInList(id, dto);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }
  endDoctorAssignmentLikeDelete(doctor: DoctorDto): void {
    const doctorId = doctor.doctorId;
    const config = {
      title: 'إنهاء تعيين الطبيب',
      message: 'هل أنت متأكد من رغبتك في إنهاء تعيين هذا الطبيب؟',
      payload: {
        'رقم الطبيب': doctorId,
        'اسم الطبيب': doctor.personDto?.fullname,
      },
    };

    this.confirmAndDelete(
      config,
      () => this.service.endDoctorAssignment(doctorId), // The API call to make
      {
        successMessage: 'تم إنهاء تعيين الطبيب بنجاح',
        defaultErrorMessage: 'فشل إنهاء التعيين. حاول لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
        this.updateDoctorAssignmentInList(doctorId, {
          isActiveAssignment: false,
          sectionId: null,
          sectionName: null,
          roomId: null,
          roomName: null,
        });
      }
    });
  }
  private _selectedDoctor = signal<DoctorDto | null>(null);
  selectedDoctor = this._selectedDoctor.asReadonly();
  private _loadingSelectedDoctor =  signal<boolean>(false);
  LoadingselectedDoctor = this._loadingSelectedDoctor.asReadonly();

  isEditMode = signal<boolean>(false);

  enterCreateMode(): void {
    this.isEditMode.set(false);
    this._selectedDoctor.set(null);
    this.formValidationErrors.set({});
  }

  enterEditMode(doctor: DoctorDto): void {
    this.isEditMode.set(true);
    this._selectedDoctor.set(doctor);
    this.formValidationErrors.set({});
  }

  loadDoctorForEdit(id: number): void {
    this._loadingSelectedDoctor.set(true);
    this.service
      .getDoctorById(id)
      .pipe(
        tap((res: ApiResult<DoctorDto>) => {
          if (res.isSuccess && res.data) {
            this.enterEditMode(res.data);
            this._loadingSelectedDoctor.set(false);
          } else {
            this.toast.error(res.errorDetail ?? 'لم يتم العثور على الطبيب');
            this.enterCreateMode();
          }
        })
      )
      .subscribe();
  }


  assignDoctorToSection(doctorId: number, dto: AssignDoctorToSectionRequest) {
    return this.handleCreateOrUpdate(
      this.service.assignDoctorToSection(doctorId, dto),
      {
        successMessage: 'تم تعيين الطبيب إلى القسم بنجاح',
        defaultErrorMessage: 'فشل تعيين الطبيب إلى القسم',
      }
    ).pipe(tap(() => this.loadDoctors()));
  }

  assignDoctorToSectionRoom(
    doctorId: number,
    dto: AssignDoctorToSectionRoomRequest
  ) {
    return this.handleCreateOrUpdate(
      this.service.assignDoctorToSectionRoom(doctorId, dto),
      {
        successMessage: 'تم تعيين الطبيب إلى الغرفة بنجاح',
        defaultErrorMessage: 'فشل تعيين الطبيب إلى الغرفة',
      }
    ).pipe(tap(() => this.loadDoctors()));
  }
  endDoctorAssignment(doctorId: number) {
    return this.handleCreateOrUpdate(
      this.service.endDoctorAssignment(doctorId),
      {
        successMessage: 'تم إنهاء تعيين الطبيب بنجاح',
        defaultErrorMessage: 'فشل إنهاء تعيين الطبيب',
      }
    ).pipe(
      tap((res) => {
        if (res.success) {
          // this.updateDoctorAssignmentInList(doctorId, {
          //   isActiveAssignment: false,
          //   sectionId: null,
          //   sectionName: null,
          //   roomId: null,
          //   roomName: null,
          // });
        }
      })
    );
  }

  // ---------------------------------------------
  // ERROR HANDLING
  // ---------------------------------------------
  private handleLoadDoctorsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل قائمة الأطباء. يرجى المحاولة لاحقاً.');
  }

  private addDoctorToList(doctor: DoctorListItemDto) {
    this._doctors.update((list) => [doctor, ...list]);
    this.totalCount.update((c) => c + 1);
  }
  private updateDoctorInList(doctorId: number, dto: UpdateDoctorRequest) {
    this._doctors.update((list) =>
      list.map((d) =>
        d.doctorId === doctorId
          ? {
              ...d, // Keep existing properties like sectionName, roomName, etc.
              fullName: dto.fullname,
              specialization: dto.specialization,
              departmentId: dto.departmentId,
            }
          : d
      )
    );

    
  }

  private removeDoctorFromList(doctorId: number) {
    this._doctors.update((list) => list.filter((d) => d.doctorId !== doctorId));
    this.totalCount.update((c) => Math.max(0, c - 1));
  }
  private updateDoctorAssignmentInList(
    doctorId: number,
    changes: Partial<DoctorListItemDto>
  ) {
    this._doctors.update((list) =>
      list.map((d) => (d.doctorId === doctorId ? { ...d, ...changes } : d))
    );
  }
}
