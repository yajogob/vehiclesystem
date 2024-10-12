import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PaginationInstance } from "ngx-pagination";

export  interface PageChangeEvent {
  pageNumber: number,
  pageSize: number
}
@Component({
  selector: 'vs-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() itemsPerPage = 10;
  @Input() id = "defaultId";
  @Input()
  set totalItems(value: number) {
    window.setTimeout(() => {
      this.config.totalItems = value;
    }, 0);
  }

  get totalItems() : number {
    return this.config.totalItems || 0;
  }

  @Input()
  set currentPage(value: number) {
    window.setTimeout(() => {
      this.config.currentPage = value;
    }, 0);
  }

  get currentPage() : number {
    return  this.config.currentPage || 1;
  }

  @Output() pageChange: EventEmitter<PageChangeEvent> = new EventEmitter<PageChangeEvent>();

  config: PaginationInstance = {itemsPerPage: 10, currentPage: 1, totalItems: 0, id: "defaultId"};


  private _pageChangeEvent: PageChangeEvent = { pageNumber: 0, pageSize: 0};

  ngOnInit(): void {
    this.config.id = this.id;
    this.config.itemsPerPage = this.itemsPerPage;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['itemsPerPage']) {
      this.config.itemsPerPage = changes['itemsPerPage'].currentValue;
    }
  }

  onPageChange(page: number): void {
    this.config.currentPage = page;
    this._pageChangeEvent.pageSize = this.config.itemsPerPage;
    this._pageChangeEvent.pageNumber = page;
    this.pageChange.emit(this._pageChangeEvent);
  }

}
