import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PageChangeEvent } from 'src/app/modules/vehicle-system/components/pagination-grid';
import { CardViewTable } from 'src/app/modules/vehicle-system/interfaces/alert/http.response';

@Component({
  selector: 'vs-card-view-public',
  templateUrl: './card-view-public.component.html',
  styleUrls: ['./card-view-public.component.scss'],
})
export class CardViewPublicComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalElements = 0;
  @Input() tableId = 'tableId';
  @Input() tableRowData!: Array<CardViewTable>;
  @Output() checkCardItemEmit = new EventEmitter<CardViewTable>();
  @Output() onPageChangeEmit = new EventEmitter<PageChangeEvent>();
  @Output() totalChange: EventEmitter<number> = new EventEmitter<number>();

  pageSize = 16;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['totalElements']) {
      const currentValue = changes['totalElements'].currentValue;
      this.totalElements = currentValue < 10000 ? currentValue : 10000;
      this.totalChange.emit(this.totalElements);
    }
  }

  onPageChange(event: PageChangeEvent): void {
    this.onPageChangeEmit.emit(event);
  }
}
