import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { PageChangeEvent } from 'src/app/modules/vehicle-system/components/pagination-grid';
import { InWhitelistTaskDetail, OutWhitelistTaskDetail } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';

@Component({
  selector: 'vs-white-list-task-details',
  templateUrl: './white-list-task-details.component.html',
  styleUrls: ['./white-list-task-details.component.scss'],
})
export class WhiteListTaskDetailsComponent implements OnChanges {
  @Input() taskId!: string;
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  curTabValue = AiConstLibrary.alert;
  whitelistTaskDetailData!: Array<OutWhitelistTaskDetail>;
  dataTotal = 0;
  pageNo = 1;

  constructor(
    private aiAlgorithmService: AiAlgorithmService,
  ) {}

  ngOnChanges(): void {
    this.getWhitelistTaskDetail();
  }

  close(): void {
    this.closeModalEvent.emit();
  }

  tabEvent(tab: string): void {
    this.curTabValue = tab;
    this.getWhitelistTaskDetail();
  }

  onPageChange(event: PageChangeEvent): void {
    this.pageNo = event.pageNumber;
    this.getWhitelistTaskDetail();
  }

  private getWhitelistTaskDetail(): void {
    const inWhitelistTaskDetail = new InWhitelistTaskDetail();
    inWhitelistTaskDetail.taskId = this.taskId; // this.taskId;
    inWhitelistTaskDetail.type = this.curTabValue; // this.curTabValue;
    inWhitelistTaskDetail.pageNo = this.pageNo;
    inWhitelistTaskDetail.pageSize = 9;
    this.aiAlgorithmService.whitelistTaskDetail(inWhitelistTaskDetail).subscribe(
      {
        next: res => {
          this.dataTotal = res.total;
          this.whitelistTaskDetailData = res.data;
        },
      },
    );
  }
}
