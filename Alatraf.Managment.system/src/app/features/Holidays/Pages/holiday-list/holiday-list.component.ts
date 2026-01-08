import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HolidaysNavigationFacade } from '../../../../core/navigation/Holidays-navigation.facade';

import { HolidayDto } from '../../Models/holiday.dto';
import { HolidayType } from '../../Models/holiday-type.enum';
import { HolidaysFacade } from '../../services/holidays.facade.service';

@Component({
  selector: 'app-holiday-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './holiday-list.component.html',
  styleUrl: './holiday-list.component.css',
})
export class HolidayListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private facade = inject(HolidaysFacade);
  private holidayNav = inject(HolidaysNavigationFacade);
  HolidayType = HolidayType;

  private arabicMonths = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];

  holidayTypes = [
    { label: 'الكل', value: '' },
    { label: 'ثابتة', value: HolidayType.Fixed },
    { label: 'مؤقتة', value: HolidayType.Temporary },
  ];

  statusOptions = [
    { label: 'الكل', value: '' },
    { label: 'نشطة', value: true },
    { label: 'غير نشطة', value: false },
  ];

  filterForm = this.fb.group({
    type: [''],
    isActive: [''],
    specificDate: [''],
    endDate: [''],
  });

  holidays = this.facade.holidays;
  isLoading = this.facade.isLoading;

  ngOnInit(): void {
    this.facade.loadHolidays();
  }

  applyFilters(): void {
    const { type, isActive, specificDate, endDate } = this.filterForm.value;
    const activeVal = isActive as string | boolean | null | undefined;
    const parsedIsActive =
      activeVal === '' || activeVal === null || activeVal === undefined
        ? undefined
        : typeof activeVal === 'boolean'
        ? activeVal
        : activeVal === 'true'
        ? true
        : activeVal === 'false'
        ? false
        : undefined;

    this.facade.updateFilters({
      type: type ? (type as HolidayType) : undefined,
      isActive: parsedIsActive,
      specificDate: specificDate || undefined,
      endDate: endDate || undefined,
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      type: '',
      isActive: '',
      specificDate: '',
      endDate: '',
    });
    this.facade.resetFilters();
    this.facade.loadHolidays();
  }

  durationDays(holiday: HolidayDto): number {
    const start = new Date(holiday.startDate);
    const end = holiday.endDate ? new Date(holiday.endDate) : start;
    const diffMs = end.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 1;
  }

  formatDateWithArabicMonth(dateStr?: string | null): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const monthName = this.arabicMonths[d.getMonth()] ?? '';
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${monthName}-${day}`;
  }

  onEdit(holiday: HolidayDto): void {
    this.holidayNav.goToEditHoliday(holiday.holidayId);
  }

  onDelete(holiday: HolidayDto): void {
    this.facade.deleteHoliday(holiday);
  }
}
