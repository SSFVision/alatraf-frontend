import { NgFor, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, computed } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports:[NgFor,NgIf],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() page: number = 1;
  @Input() pageSize: number = 5;
  @Input() totalCount: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageSizes: number[] = [5, 10, 20, 50];

  // -------- total pages ----------
  get totalPages(): number {
    if (!this.totalCount || !this.pageSize) return 1;
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  // -------- navigation ----------
  prev(): void {
    if (this.page > 1) {
      this.pageChange.emit(this.page - 1);
    }
  }

  next(): void {
    if (this.page < this.totalPages) {
      this.pageChange.emit(this.page + 1);
    }
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.pageChange.emit(p);
  }

  onPageSizeChange(size: any): void {
    const numericSize = +size;
    if (!numericSize || numericSize === this.pageSize) return;
    this.pageSizeChange.emit(numericSize);
  }

  // -------- sliding window with dots ----------
  // return type kept as any[] to avoid strict template typing issues
   getPagesToShow(): (number | 'dots')[] {
    const total = this.totalPages;
    const current = this.page;
    const pages: (number | 'dots')[] = [];

    // If small number of pages → show all
    if (total <=2) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // Always show first
    pages.push(1);

    // LEFT dots
    if (current > 2) pages.push('dots');

    // MAIN WINDOW (centered on current page)
    let start = current - 1;
    let end = current + 1;

    // adjust boundaries
    if (current === 1) {
      start = 1;
      end = 3;
    } else if (current === 2) {
      start = 1;
      end = 3;
    } else if (current === total) {
      start = total - 2;
      end = total;
    } else if (current === total - 1) {
      start = total - 2;
      end = total;
    }

    // clamp range
    start = Math.max(1, start);
    end = Math.min(total, end);

    // push sliding window
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) pages.push(i);
    }

    // RIGHT dots
    if (current < total - 2) pages.push('dots');

    // Always show last
    pages.push(total);

    return pages;
  }


  // safe handler for clicks from template
  onPageClick(p: any): void {
    if (typeof p === 'number') {
      this.goToPage(p);
    }
  }
}

