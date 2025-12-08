import { NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter, computed } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports:[NgFor],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() page: number = 1;
  @Input() pageSize: number = 5;
  @Input() totalCount: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageSizes: number[] = [5, 10, 25, 50, 100];

  // ✅ Use a getter instead of computed()
  get totalPages(): number {
    if (!this.totalCount || !this.pageSize) {
      return 1;
    }
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  // ----------------------------
  // Page Navigation
  // ----------------------------
  goToPage(p: number) {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.pageChange.emit(p);
  }

  next() {
    if (this.page < this.totalPages) {
      this.pageChange.emit(this.page + 1);
    }
  }

  prev() {
    if (this.page > 1) {
      this.pageChange.emit(this.page - 1);
    }
  }

  // ----------------------------
  // Page Size Change
  // ----------------------------
  onPageSizeChange(size: number | string) {
    const numericSize = typeof size === 'string' ? +size : size;
    if (!numericSize || numericSize === this.pageSize) return;
    this.pageSizeChange.emit(numericSize);
  }

  // ----------------------------
  // Utility for page buttons
  // ----------------------------
  range(start: number, end: number): number[] {
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }
}
