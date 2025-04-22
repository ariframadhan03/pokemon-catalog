import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() currentPage!: number;
  @Input() total!: number;
  @Input() limit!: number;
  @Output() loadPage: EventEmitter<number> = new EventEmitter<number>();

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.loadPage.emit(page);
  }

  hasPrevious() {
    return this.currentPage > 0;
  }

  hasNext() {
    return this.currentPage < this.totalPages - 1;
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5; // Only 5 page numbers visible (7 total including prev/next)

    let start = Math.max(0, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible;

    if (end > total) {
      end = total;
      start = Math.max(0, end - maxVisible);
    }

    const pages = [];
    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  }

  get totalPages() {
    return Math.ceil(this.total / this.limit);
  }
}
