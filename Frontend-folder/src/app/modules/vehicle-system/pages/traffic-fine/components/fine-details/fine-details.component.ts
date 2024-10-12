import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { PageChangeEvent } from 'src/app/modules/vehicle-system/components/pagination-grid';
import { OutTrafficFineSearch } from 'src/app/modules/vehicle-system/interfaces/traffic-fine/traffic-fine';

@Component({
  selector: 'vs-fine-details',
  templateUrl: './fine-details.component.html',
  styleUrls: ['./fine-details.component.scss'],
})
export class FineDetailsComponent implements OnInit {
  @Input() allDetailsData!: Array<OutTrafficFineSearch>;
  @Input() searchType!: string;
  @Input() dataTotal = 0;

  @Output() pageInfoChange: EventEmitter<PageChangeEvent> = new EventEmitter<PageChangeEvent>();
  @Output() expandListEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  wFull = false;
  imgFull = false;
  activeLangValue = 'en';

  constructor(
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.activeLangValue = this.translocoService.getActiveLang();
  }

  expandList(event: boolean): void {
    this.imgFull = event;
    if (!event) {
      setTimeout(() => {
        this.wFull = event;
      }, 200);
    } else {
      this.wFull = event;
    }
    this.expandListEvent.emit(event);
  }

  onPageChange(event: PageChangeEvent): void {
    this.pageInfoChange.emit(event);
  }

  // like vue :key = index
  trackByIndex = (index: number): number => {
    return index;
  };
}
