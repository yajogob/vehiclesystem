import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { PaginationComponent } from 'src/app/modules/vehicle-system/components/pagination-grid';
import { OutWhitelistTaskDetail } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { AiConstLibrary } from '../../../libs/ai-const-library';

@Component({
  selector: 'vs-white-list-task-details-table',
  templateUrl: './white-list-task-details-table.component.html',
  styleUrls: ['./white-list-task-details-table.component.scss'],
})
export class WhiteDetailsTableComponent implements OnInit, OnChanges {
  @Input() curTabValue = AiConstLibrary.alert;
  @Input() paginationComponent!: PaginationComponent;
  @Input() pagedwhitelistTaskDetail!: Array<OutWhitelistTaskDetail>;

  language = 'en';
  clientWidth = document.body.clientWidth;
  isAlert!: boolean;
  checkBigImage = false;
  bigImageUrl = '';

  constructor(
    protected tl: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.language = this.tl.getActiveLang();
  }

  ngOnChanges(): void {
    this.isAlert = this.curTabValue === AiConstLibrary.alert;
  }

  setBigImageUrl(url:string): void {
    this.checkBigImage = true;
    this.bigImageUrl = url;
  }

  closeBigImage(): void {
    this.checkBigImage = false;
    this.bigImageUrl = '';
  }
}
