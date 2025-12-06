import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MultiSelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent {
  @Input() options: MultiSelectOption[] = [];
  @Input() selectedValues: any[] = [];
  @Input() placeholder: string = 'اختر واحد أو أكثر';
  @Input() disabled: boolean = false;

  @Output() selectionChange = new EventEmitter<any[]>();

  isOpen = false;

  constructor(private elRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event: MouseEvent): void {
    if (this.disabled) return;
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  isSelected(option: MultiSelectOption): boolean {
    return this.selectedValues.some(v => v === option.value);
  }

  toggleOption(option: MultiSelectOption): void {
    if (this.disabled) return;

    const exists = this.isSelected(option);

    if (exists) {
      this.selectedValues = this.selectedValues.filter(v => v !== option.value);
    } else {
      this.selectedValues = [...this.selectedValues, option.value];
    }

    this.selectionChange.emit(this.selectedValues);
  }

  clearOne(option: MultiSelectOption, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.isSelected(option)) return;
    this.selectedValues = this.selectedValues.filter(v => v !== option.value);
    this.selectionChange.emit(this.selectedValues);
  }

  clearAll(event: MouseEvent): void {
    event.stopPropagation();
    this.selectedValues = [];
    this.selectionChange.emit(this.selectedValues);
  }
}
