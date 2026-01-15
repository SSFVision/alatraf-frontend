import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Optional,
  Self,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { AddressDto } from '../../../features/Organization/Addresses/Models/address.dto';
import { AddressService } from '../../../features/Organization/Addresses/Service/address.service';

@Component({
  selector: 'app-address-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './address-select.component.html',
  styleUrls: ['./address-select.component.css'],
})
export class AddressSelectComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  private addressApi = inject(AddressService);

  addresses = signal<AddressDto[]>([]);
  loading = signal<boolean>(false);

  searchCtrl = new FormControl<string | number | null>('');
  selectedId: number | null = null;
  disabled = false;

  private ngControl: NgControl | null;

  private destroy$ = new Subject<void>();
  private page: PageRequest = { page: 1, pageSize: 20 };
  private hasMore = true;

  public onTouched: () => void = () => {};
  private onChange: (value: number | null) => void = () => {};

  constructor(@Optional() @Self() ngControl: NgControl | null) {
    this.ngControl = ngControl;
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(
        tap((value) => this.handleInputChange(value)),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.loading.set(true);
          this.page.page = 1; // reset page on new search
          this.hasMore = true;
        }),
        switchMap((term) => {
          const searchTerm = typeof term === 'string' ? term : null;
          return this.addressApi.getAddresses(searchTerm, this.page).pipe(
            map((res) => {
              const items = res.data?.items ?? [];
              this.hasMore = res.data
                ? res.data.pageNumber < res.data.totalPages
                : false;
              return items;
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((items) => {
        this.addresses.set(items);
        this.loading.set(false);
      });

    this.searchCtrl.setValue('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== ControlValueAccessor =====
  writeValue(value: number | null): void {
    this.selectedId = value;

    if (value == null) {
      this.searchCtrl.setValue('', { emitEvent: false });
      return;
    }

    const existing = this.addresses().find((a) => a.id === value);
    if (existing) {
      this.searchCtrl.setValue(existing.name, { emitEvent: false });
      return;
    }

    // Fetch by id when coming from patchValue with an id not in the current page
    this.addressApi.getAddressById(value).subscribe((res) => {
      const address = res.data;
      if (!address) return;

      this.addresses.update((list) => {
        const already = list.some((a) => a.id === address.id);
        return already ? list : [address, ...list];
      });

      this.searchCtrl.setValue(address.name, { emitEvent: false });
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    isDisabled
      ? this.searchCtrl.disable({ emitEvent: false })
      : this.searchCtrl.enable({ emitEvent: false });
  }

  // ===== UI =====
  onOptionSelected(id: number) {
    const address = this.addresses().find((a) => a.id === id);

    this.selectedId = id;
    this.onChange(id);
    this.onTouched();

    this.searchCtrl.setValue(address?.name ?? '', { emitEvent: false });
  }

  private handleInputChange(value: string | number | null) {
    const isString = typeof value === 'string';
    const isNullish = value == null;

    if (!isString && !isNullish) {
      return; // ignore number emissions from option selection
    }

    const text = (value ?? '').toString();
    const isEmpty = text.trim().length === 0;
    const shouldClearSelection =
      isEmpty || (isString && this.selectedId !== null);

    if (shouldClearSelection) {
      this.clearSelection();
    }
  }

  get showError(): boolean {
    const control = this.ngControl?.control;
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private clearSelection() {
    if (this.selectedId !== null) {
      this.selectedId = null;
      this.onChange(null);
    }
  }

  // ===== Highlight search term =====
  highlight(text: string): string {
    const term = this.searchCtrl.value;
    if (typeof term !== 'string' || !term) return text;

    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(
      new RegExp(escaped, 'gi'),
      (match) => `<strong>${match}</strong>`
    );
  }

  // ===== Infinite scroll =====
  loadMore() {
    if (this.loading() || !this.hasMore) return;

    this.loading.set(true);
    this.page.page++;

    const searchTerm =
      typeof this.searchCtrl.value === 'string' ? this.searchCtrl.value : null;

    this.addressApi.getAddresses(searchTerm, this.page).subscribe((res) => {
      const items = res.data?.items ?? [];
      if (res.isSuccess && items.length > 0) {
        this.addresses.update((list) => [...list, ...items]);
        this.hasMore = res.data
          ? res.data.pageNumber < res.data.totalPages
          : false;
      }
      this.loading.set(false);
    });
  }
}
