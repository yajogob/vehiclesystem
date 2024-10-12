import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { finalize, tap } from 'rxjs';
import { DateKey } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { CreateTaskParams } from '../../../../interfaces/alert/http.params';
import { CreateAlertTaskRes } from '../../../../interfaces/alert/http.response';
import { CodesArrayItem } from '../../../../interfaces/key-value-type';
import { AlertHttpRequest } from '../../../../services/alert/http.service';
import { CodeItemService } from '../../../../services/global-subscription.service';
import { LoggerService } from '../../../../utils/logger.service';

@Component({
  selector: 'vs-create-newtask',
  templateUrl: './create-newtask.component.html',
  styleUrls: ['./create-newtask.component.scss'],
})
export class CreateNewtaskComponent implements OnInit {
  @Output() closeEmit = new EventEmitter<boolean>();
  @Output() createdEmit = new EventEmitter<string>();
  @Input() taskType='';

  language!: string;
  newTaskType='';
  alertTypeList: Array<CodesArrayItem> = [];
  regionList: Array<CodesArrayItem> = [];
  categoryList: Array<CodesArrayItem> = [];
  plateColorList: Array<CodesArrayItem> = [];
  behavioralAlgorithmList: Array<CodesArrayItem> = [];
  description=null;
  taskCycleList = [
    { key: 'taskCycle1', value: '24-hour task' },
    { key: 'taskCycle2', value: 'Periodic task' },
    { key: 'taskCycle3', value: 'Tour task' },
  ];

  trafficThreshold=false;
  searchDate!: TimePeriod | null;
  showWatchlistTaskParamsError = false;
  newWatchlistTaskParams: CreateTaskParams={
    taskType: null,
    id: null,
    deviceIds: [],
    region: null,
    plateNumber: null,
    plateCategory: null,
    plateColor: null,
    taskLevel: '2',
    startDateTime: null,
    endDateTime: null,
    description: null,
  };

  showBehavioralTaskParamsError = false;
  newBehavioralTaskParams: CreateTaskParams={
    id: null,
    taskType: null,
    taskName: null,
    algorithm: null,
    taskLevel: '2',
    timeCycle: '24-hour task',
    devices: null,
    imageFile: {},
    description: null,
  };

  showGeofenceTaskParamsError = false;
  newGeofenceTaskParams: CreateTaskParams={
    id: null,
    taskType: null,
    taskName: null,
    taskLevel: '2',
    controlType: null,
    siteScope: null,
    site: null,
    description: null,
    alarmRecipient: null,
  };

  constructor(
    private alertHttpRequest: AlertHttpRequest,
    private tl: TranslocoService,
    private codeItemService: CodeItemService,
    private loadingService: NgxUiLoaderService,
    private logger: LoggerService,
  ) {}


  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.language = this.tl.getActiveLang();
    this.setNewTaskType();
    this.initSelectItemData();
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  close():void {
    this.closeEmit.emit(false);
  }

  setNewTaskType():void {
    if (this.taskType === 'watchList') {
      this.newTaskType = '1';
    } else if (this.taskType === 'behavioral') {
      this.newTaskType = '2';
    } else if (this.taskType === 'geofenceList') {
      this.newTaskType = '3';
    }
  }

  initSelectItemData():void {
    this.codeItemService.subject$.subscribe(({eventType, data}) => {
      if (eventType === 'update-codeItems') {
        data.forEach(item => {
          const list = ['Watch List Alert Task', 'Behavioral Alert Task', 'Geofence Alert Task'];
          switch(item.codeType) {
            case 'LprAlertType':
              this.alertTypeList = item.codesArray.filter(obj => list.includes(obj.englishItemName));
              break;
            case 'LprRegion':
              this.regionList = item.codesArray;
              break;
            case 'LprCategory':
              this.categoryList = item.codesArray;
              break;
            case 'LprPlateColor':
              this.plateColorList = item.codesArray;
              break;
            case 'LprBehavioralAlgorithm':
              this.behavioralAlgorithmList = item.codesArray;
              break;
          }
        });
      }
    });
  }

  getItemName(data: CodesArrayItem):string {
    if (this.language === 'en') {
      return data.englishItemName;
    } else if (this.language === 'ar') {
      return data.arabItemName;
    }
    return '';
  }

  selectedDateFn(event: DateKey):void {
    this.newWatchlistTaskParams.startDateTime = event.startDate;
    this.newWatchlistTaskParams.endDateTime = event.endDate;
    this.searchDate = event.curSelected;
  }

  switchChanged(value: boolean): void {
    this.trafficThreshold = value;
  }

  setShowWatchlistTaskParamsError():void {
    const keyList = ['region', 'plateCategory', 'plateNumber', 'plateColor', 'taskLevel', 'startDateTime', 'endDateTime'];
    Object.keys(this.newWatchlistTaskParams).forEach(key => {
      if (keyList.includes(key)) {
        this.showWatchlistTaskParamsError = !(this.newWatchlistTaskParams[key as keyof CreateTaskParams]);
      }
    });
  }

  setShowBehavioralTaskParamsError():void {
    const keyList = ['taskName', 'algorithm', 'devices'];
    Object.keys(this.newBehavioralTaskParams).forEach(key => {
      if (keyList.includes(key)) {
        this.showBehavioralTaskParamsError = !(this.newBehavioralTaskParams[key as keyof CreateTaskParams]);
      }
    });
  }

  setShowGeofenceTaskParamsError():void {
    const keyList = ['taskName'];
    Object.keys(this.newGeofenceTaskParams).forEach(key => {
      if (keyList.includes(key)) {
        this.showGeofenceTaskParamsError = !(this.newGeofenceTaskParams[key as keyof CreateTaskParams]);
      }
    });
  }

  createTask():void {
    this.newWatchlistTaskParams.description = this.newBehavioralTaskParams.description = this.newGeofenceTaskParams.description = this.description;
    this.newWatchlistTaskParams.taskType = this.newBehavioralTaskParams.taskType = this.newGeofenceTaskParams.taskType = this.newTaskType;

    if (this.newTaskType === '1') {
      this.setShowWatchlistTaskParamsError();
      if (this.showWatchlistTaskParamsError) return;
      this.loadingService.startLoader('new-task-loader');
      const res = this.alertHttpRequest.saveWatchListTaskApi(this.newWatchlistTaskParams);
      res.pipe(
        tap({
          error: () => {
            this.createdEmit.emit('error');
          },
        }),
        finalize(() => {
          this.loadingService.stopLoader('new-task-loader');
        }),
      ).subscribe((data:CreateAlertTaskRes) => {
        if (data.status === 200) {
          this.createdEmit.emit('success');
        } else {
          this.createdEmit.emit('error');
        }
      });
    } else if (this.newTaskType === '2') {
      this.setShowBehavioralTaskParamsError();
      if (this.showBehavioralTaskParamsError) return;
      this.loadingService.startLoader('new-task-loader');
      const res = this.alertHttpRequest.saveBehavioralTaskApi(this.newBehavioralTaskParams);
      res.pipe(
        tap({
          error: () => {
            this.createdEmit.emit('error');
          },
        }),
        finalize(() => {
          this.loadingService.stopLoader('new-task-loader');
        }),
      ).subscribe((data:CreateAlertTaskRes) => {
        if (data.status === 200) {
          this.createdEmit.emit('success');
        } else {
          this.createdEmit.emit('error');
        }
      });
    } else if (this.newTaskType === '3') {
      this.setShowGeofenceTaskParamsError();
      if (this.showGeofenceTaskParamsError) return;
      this.loadingService.startLoader('new-task-loader');
      const res = this.alertHttpRequest.saveGeofenceTaskApi(this.newGeofenceTaskParams);
      res.pipe(
        tap({
          error: () => {
            this.createdEmit.emit('error');
          },
        }),
        finalize(() => {
          this.loadingService.stopLoader('new-task-loader');
        }),
      ).subscribe((data:CreateAlertTaskRes) => {
        if (data.status === 200) {
          this.createdEmit.emit('success');
        } else {
          this.createdEmit.emit('error');
        }
      });
    }
  }

  resetParams():void {
    if (this.newTaskType === '1') {
      this.newWatchlistTaskParams = {
        taskType: null,
        id: null,
        region: null,
        plateNumber: null,
        plateCategory: null,
        plateColor: null,
        taskLevel: '2',
        startDateTime: null,
        endDateTime: null,
        description: null,
      };
      this.searchDate = null;
    } else if (this.newTaskType === '2') {
      this.newBehavioralTaskParams = {
        id: null,
        taskType: null,
        taskName: null,
        algorithm: null,
        taskLevel: '2',
        timeCycle: '24-hour task',
        devices: null,
        imageFile: {},
        description: null,
      };
    } else if (this.newTaskType === '3') {
      this.newGeofenceTaskParams = {
        id: null,
        taskType: null,
        taskName: null,
        taskLevel: '2',
        controlType: null,
        siteScope: null,
        site: null,
        alarmRecipient: null,
      };
    }
    this.description = null;
    this.setNewTaskType();
  }
  /* custom function   -----end */
}
