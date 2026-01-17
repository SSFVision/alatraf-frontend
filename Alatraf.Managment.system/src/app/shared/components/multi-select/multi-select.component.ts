import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  forwardRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

export interface MultiSelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
})
export class MultiSelectComponent
  implements ControlValueAccessor, OnInit, OnChanges {

  @Input() options: MultiSelectOption[] = [];
  @Input() placeholder: string = 'اختر واحد أو أكثر';

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchTerm = '';
  filteredOptions: MultiSelectOption[] = [];
  isOpen = false;

  private _disabled = false;
  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @Output() selectionChange = new EventEmitter<any[]>();

  private _value: any[] = [];

  private onChange: (value: any[]) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(private elRef: ElementRef) { }

  // ---------------- CVA ----------------

  writeValue(value: any[] | null): void {
    this._value = Array.isArray(value) ? [...value] : [];
  }

  registerOnChange(fn: (value: any[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  // ---------------- Helpers ----------------

  get value(): any[] {
    return this._value;
  }

  get selectedOptions(): MultiSelectOption[] {
    return this.options.filter(o => this.value.includes(o.value));
  }

  private markAsTouched(): void {
    this.onTouched();
  }

  private updateValue(newValue: any[]): void {
    this._value = newValue;
    this.onChange(this._value);
    this.selectionChange.emit(this._value);
  }

  // ---------------- Focus & Dropdown ----------------

  focusInput(): void {
    if (!this.disabled) {
      this.searchInput?.nativeElement.focus();
    }
  }

  openDropdown(): void {
    if (this.disabled) return;

    if (!this.isOpen) {
      this.isOpen = true;
      this.filteredOptions = [...this.options];
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.searchTerm = '';
    this.filteredOptions = [...this.options];
  }

  // ---------------- Outside Click ----------------

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.closeDropdown();
        this.markAsTouched();
      }
    }
  }

  // ---------------- Options ----------------

  isSelected(option: MultiSelectOption): boolean {
    return this.value.includes(option.value);
  }

  toggleOption(option: MultiSelectOption): void {
    if (this.disabled) return;

    const newValue = this.isSelected(option)
      ? this.value.filter(v => v !== option.value)
      : [...this.value, option.value];

    this.updateValue(newValue);
  }

  clearOne(option: MultiSelectOption, event: MouseEvent): void {
    event.stopPropagation();
    this.updateValue(this.value.filter(v => v !== option.value));
  }

  clearAll(event: MouseEvent): void {
    event.stopPropagation();
    this.updateValue([]);
  }

  // ---------------- Search ----------------

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filterOptions();
  }

  filterOptions(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredOptions = this.options.filter(option =>
      option.label.toLowerCase().includes(term)
    );
  }

  // ---------------- Keyboard ----------------

  onInputKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.closeDropdown();
        this.markAsTouched();
        break;

      case 'Backspace':
        if (!this.searchTerm && this.value.length) {
          this.updateValue(this.value.slice(0, -1));
        }
        break;
    }
  }

  // ---------------- Lifecycle ----------------

  ngOnInit(): void {
    this.filteredOptions = [...this.options];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filteredOptions = [...this.options];
      this.filterOptions();
    }
  }
}
