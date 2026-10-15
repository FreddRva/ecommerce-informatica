import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex items-center gap-0.5">
      @for (star of [1, 2, 3, 4, 5]; track star) {
        <button 
          type="button"
          [disabled]="readonly()"
          (click)="onSelect(star)"
          [class.cursor-pointer]="!readonly()"
          class="p-0 border-0 bg-transparent flex items-center justify-center transition-transform hover:scale-110 disabled:cursor-default"
        >
          <mat-icon [class]="star <= value() ? 'text-amber-400' : 'text-slate-600'" class="!text-[18px] !w-[18px] !h-[18px]">
            {{ star <= value() ? 'star' : 'star_border' }}
          </mat-icon>
        </button>
      }
      @if (showCount() && count() !== undefined) {
        <span class="text-xs text-slate-400 font-mono ml-1.5">({{ count() }})</span>
      }
    </div>
  `
})
export class StarRatingComponent {
  value = input<number>(5);
  count = input<number | undefined>(undefined);
  readonly = input<boolean>(true);
  showCount = input<boolean>(true);
  ratingChange = output<number>();

  onSelect(rating: number): void {
    if (!this.readonly()) {
      this.ratingChange.emit(rating);
    }
  }
}
