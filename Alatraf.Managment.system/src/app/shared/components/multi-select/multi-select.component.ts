import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  forwardRef
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
export class MultiSelectComponent implements ControlValueAccessor {
  @Input() options: MultiSelectOption[] = [];
  @Input() placeholder: string = 'اختر واحد أو أكثر';

  // disabled now comes from form + input (both supported)
  private _disabled = false;
  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @Output() selectionChange = new EventEmitter<any[]>();

  isOpen = false;

  // internal value managed by CVA
  private _value: any[] = [];

  // CVA callbacks
  private onChange: (value: any[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elRef: ElementRef) {}

  // ------------ ControlValueAccessor implementation ------------

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

  // ------------ Helpers ------------

  get value(): any[] {
    return this._value || [];
  }

  get selectedOptions(): MultiSelectOption[] {
    if (!this.value.length) return [];
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

  // ------------ UI Events ------------

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
        this.markAsTouched();
      }
    }
  }

  toggleDropdown(event: MouseEvent): void {
    if (this.disabled) return;
    event.stopPropagation();
    this.isOpen = !this.isOpen;

    if (!this.isOpen) {
      this.markAsTouched();
    }
  }

  isSelected(option: MultiSelectOption): boolean {
    return this.value.includes(option.value);
  }

  toggleOption(option: MultiSelectOption): void {
    if (this.disabled) return;

    const exists = this.isSelected(option);
    const newValue = exists
      ? this.value.filter(v => v !== option.value)
      : [...this.value, option.value];

    this.updateValue(newValue);
  }

  clearOne(option: MultiSelectOption, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.isSelected(option)) return;

    const newValue = this.value.filter(v => v !== option.value);
    this.updateValue(newValue);
  }

  clearAll(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.value.length) return;

    this.updateValue([]);
  }
}

