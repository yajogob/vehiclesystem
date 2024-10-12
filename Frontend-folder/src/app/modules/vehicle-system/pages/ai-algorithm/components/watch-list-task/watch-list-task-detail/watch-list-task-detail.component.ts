import { Component, Input, OnChanges } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OutWatchListTaskSearch } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';

@Component({
  selector: 'vs-watch-list-task-detail',
  templateUrl: './watch-list-task-detail.component.html',
  styleUrls: ['./watch-list-task-detail.component.scss'],
})
export class WatchListTaskDetailComponent implements OnChanges {
  @Input() taskId!: string; // edit data
  @Input() data?:OutWatchListTaskSearch;
  @Input() plateColorList:Array<KeyValueType> = [];
  @Input() taskStatusList: Array<KeyValueType> = [];
  @Input() taskLevelList: Array<KeyValueType> = [];

  detailData: OutWatchListTaskSearch = new OutWatchListTaskSearch();  // have deviceList

  constructor(
    private loadingService: NgxUiLoaderService,
    private aiAlgorithmService: AiAlgorithmService,
  ) {}

  ngOnChanges(): void {
    if (this.data?.id) {
      this.requestDetail(this.data.id);
    }
  }

  requestDetail(taskId:string): void {
    this.aiAlgorithmService.watchlistTaskSearcDevice(taskId).subscribe(
      {
        next: res => {
          if(res && Object.keys(res).length > 0) {
            this.detailData = Object.assign({}, this.data, res);
          } else {
            this.detailData = Object.assign({}, this.data);
          }
          this.requestDetailSuc();
        },
      },
    );
  }

  requestDetailSuc(): void {
    this.plateColorList.forEach(item => {
      if (item['value'] === this.detailData.plateColor) {
        this.detailData.plateColor = item['key'];
      }
    });
    this.taskStatusList.forEach(item => {
      if (item['value'] === this.detailData.currentStatus) {
        this.detailData.currentStatus = item['key'];
      }
    });
    this.taskLevelList.forEach(item => {
      if (item['value'] === this.detailData.taskLevel) {
        this.detailData.taskLevel = item['key'];
      }
    });
  }
}
