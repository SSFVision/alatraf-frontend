import { Injectable, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { ApiResult } from '../../core/models/ApiResult';
import { MedicalProgramDto } from '../../core/models/medical-programs/medical-program.dto';
import { BaseFacade } from '../../core/utils/facades/base-facade';
import { SearchManager } from '../../core/utils/search-manager';
import { MedicalProgramsManagementService } from './medical-programs-management.service';
import { CreateMedicalProgramRequest } from './Models/create-medical-program-request.model';
import { UpdateMedicalProgramRequest } from './Models/update-medical-program-request.model';


@Injectable({ providedIn: 'root' })
export class MedicalProgramsFacade extends BaseFacade {
  private service = inject(MedicalProgramsManagementService);

  // ================================
  // Signals
  // ================================
  private _medicalPrograms = signal<MedicalProgramDto[]>([]);
  medicalPrograms = this._medicalPrograms.asReadonly();

  constructor() {
    super();
  }

  // ================================
  // SEARCH MANAGER (ready - no public method yet)
  // ================================
  private searchManager = new SearchManager<MedicalProgramDto[]>(
    (term: string) =>
      this.service.getMedicalPrograms().pipe(
        tap((res: ApiResult<MedicalProgramDto[]>) => {
          if (!res.isSuccess) this.handleSearchError(res);
        }),
        map((res: ApiResult<MedicalProgramDto[]>) => {
          const items = res.isSuccess && res.data ? res.data : [];
          const t = (term ?? '').trim().toLowerCase();

          if (!t) return items;

          return items.filter((x) => {
            const name = (x.name ?? '').toLowerCase();
            const desc = (x.description ?? '').toLowerCase();
            return name.includes(t) || desc.includes(t);
          });
        })
      ),

    null, // no cache here (service already caches)
    (data) => this._medicalPrograms.set(data)
  );
search(term: string): void {
  this.searchManager.search(term);
}
  // ================================
  // 1) LOAD MEDICAL PROGRAMS  ✅ (first method only)
  // ================================
  loadMedicalPrograms(): void {
    this.service
      .getMedicalPrograms()
      .pipe(
        tap((result: ApiResult<MedicalProgramDto[]>) => {
          if (result.isSuccess && result.data) {
            this._medicalPrograms.set(result.data);
          } else {
            this._medicalPrograms.set([]);
            this.handleLoadMedicalProgramsError(result);
          }
        })
      )
      .subscribe();
  }


  createMedicalProgram(dto: CreateMedicalProgramRequest) {
  return this.handleCreateOrUpdate(
    this.service.createMedicalProgram(dto),
    {
      successMessage: 'تم إنشاء البرنامج الطبي بنجاح',
      defaultErrorMessage: 'فشل إنشاء البرنامج الطبي. يرجى المحاولة لاحقاً.',
    }
  ).pipe(
    tap((res) => {
      if (res.success) {
        // reload list after create
        this.loadMedicalPrograms();
      }
    })
  );
}

updateMedicalProgram(id: number, dto: UpdateMedicalProgramRequest) {
  return this.handleCreateOrUpdate(
    this.service.updateMedicalProgram(id, dto),
    {
      successMessage: 'تم تعديل البرنامج الطبي بنجاح',
      defaultErrorMessage: 'فشل تعديل البرنامج الطبي. حاول لاحقاً.',
    }
  ).pipe(
    tap((res) => {
      if (res.success) {
        // reload list after update
        this.loadMedicalPrograms();
      }
    })
  );
}

// ================================
// SELECTED MEDICAL PROGRAM + EDIT MODE
// ================================
private _selectedMedicalProgram = signal<MedicalProgramDto | null>(null);
selectedMedicalProgram = this._selectedMedicalProgram.asReadonly();

isEditMode = signal<boolean>(false);

enterCreateMode(): void {
  this.isEditMode.set(false);
  this._selectedMedicalProgram.set(null);
}

loadMedicalProgramForEdit(id: number): void {
  this.isEditMode.set(true);
  this._selectedMedicalProgram.set(null);

  this.service
    .getMedicalProgramById(id)
    .pipe(
      tap((result: ApiResult<MedicalProgramDto>) => {
        if (result.isSuccess && result.data) {
          this._selectedMedicalProgram.set(result.data);
        } else {
          this.toast.error(
            result.errorDetail ?? 'لم يتم العثور على البرنامج الطبي'
          );
          this.isEditMode.set(false);
          this._selectedMedicalProgram.set(null);
        }
      })
    )
    .subscribe();
}

// ================================
// DELETE
// ================================
deleteMedicalProgram(program: MedicalProgramDto): void {
  if (!program?.id) return;

  const config = {
    title: 'حذف البرنامج الطبي',
    message: 'هل أنت متأكد من حذف البرنامج الطبي التالي؟',
    payload: {
      الاسم: program.name,
      الوصف: program.description ?? '',
    },
  };

  this.confirmAndDelete(
    config,
    () => this.service.deleteMedicalProgram(program.id),
    {
      successMessage: 'تم حذف البرنامج الطبي بنجاح',
      defaultErrorMessage: 'فشل حذف البرنامج الطبي. حاول لاحقاً.',
    }
  ).subscribe((success) => {
    if (success) {
      this.loadMedicalPrograms();
    }
  });
}

  // ================================
  // Error Handlers (minimal)
  // ================================
  private handleLoadMedicalProgramsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل البرامج الطبية. يرجى المحاولة لاحقاً.');
  }

  private handleSearchError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.info(err.message);
      return;
    }
    this.toast.error('حدث خطأ أثناء تنفيذ عملية البحث.');
  }

}
