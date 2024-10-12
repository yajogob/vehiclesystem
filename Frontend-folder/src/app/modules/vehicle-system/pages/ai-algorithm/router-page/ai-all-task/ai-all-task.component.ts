import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { Subscription, fromEvent } from 'rxjs';
import { Tool } from 'src/app/modules/vehicle-system/components/toolbox';
import { DateKey } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { TRAFFICMenuList } from 'src/app/modules/vehicle-system/interfaces/rbac';
import { AllResourceList } from 'src/app/modules/vehicle-system/libs/path-library';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { MapService } from '../../../../services/map-event.service';
import { AiConstLibrary } from '../../libs/ai-const-library';

@Component({
  selector: 'vs-ai-all-task',
  templateUrl: './ai-all-task.component.html',
  styleUrls: ['./ai-all-task.component.scss'],
})
export class AiAllTaskComponent implements OnInit, OnDestroy, AfterViewInit {
  allResourceList = AllResourceList;
  hideTab = true;
  hideTabMap = {key: 'gpuLprTask', value: AiConstLibrary.gpuLpr, accessName: ''};
  taskList = [
    // {key: 'behavioralTask', value: AiConstLibrary.behavioral, accessName: this.allResourceList.BehavioralListTask},
    {key: 'watchListTask', value: AiConstLibrary.watchList, accessName: this.allResourceList.WatchListListTask},
    {key: 'geofenceTask', value: AiConstLibrary.geofenceList, accessName: this.allResourceList.GeofenceListTask},
    {key: 'whiteListTask', value: AiConstLibrary.whiteList, accessName: this.allResourceList.WhiteListListTask},
  ];

  showLevel2Select = false;
  tempTaskType!: string; // Temporary variables
  curTaskType = 'task'; // task | create Task
  curTaskValue = ''; // watch , white ...  five
  backButtonText!: string;
  backType!: string;
  channel!: string;
  selectedDate!: TimePeriod | null;
  canShowFirst: {key: string, value: string, accessName: string} | undefined;

  toolSet: Tool[] = [
    {
      code: 'ALG_TASK',
      category: 'vs.aiAlgorithm.algorithms',
      value: 'vs.aiAlgorithm.task',
      arrowIcon: true,
    },
    {
      code: 'ALG_CREATE_TASK',
      category: 'vs.aiAlgorithm.algorithms',
      value: 'vs.aiAlgorithm.createTask',
      arrowIcon: true,
    },
  ];

  private selectTranslate$!: Subscription;
  private businessToTool$!: Subscription;
  private listening$!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
    private mapService: MapService,
    private aiAlgorithmService: AiAlgorithmService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.showWhichOneTab();
    this.getRouterParams();
    this.transloco();
    this.businessToTool$ = this.aiAlgorithmService.businessToToolBoxDateChange$.subscribe(params => {
      this.selectedDate = params?.curSelected as TimePeriod;
    });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
    this.listeningKeyboard();
  }

  private showWhichOneTab(): void {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    this.canShowFirst = this.taskList.find(item => {
      const obj = meunListRes.find((ele: TRAFFICMenuList) => {
        return item.accessName === ele.uriSet;
      });
      return obj;
    });
    if(this.canShowFirst) {
      this.curTaskValue = this.canShowFirst.value;
    }
  }

  private listeningKeyboard(): void {
    this.listening$ = fromEvent(document, 'keyup').subscribe(
      res => {
        const e = res as KeyboardEvent;
        const keyCode = e.keyCode || e.which || e.charCode;
        const ctrlKey = e.ctrlKey || e.metaKey;
        if(ctrlKey && keyCode == 81) {
          if(this.hideTab) {
            this.hideTab = false;
            this.taskList.push(this.hideTabMap);
          } else {
            this.hideTab = true;
            this.taskList.pop();
            if(this.canShowFirst) {
              this.curTaskValue = this.canShowFirst.value;
            }
          }
        }
        e.preventDefault();
        return false;
      },
    );
  }

  setNotCreateTask(): void {
    this.curTaskType = 'task';
  }

  goBack(): void {
    window.history.go(-1);
    setTimeout(() => {
      this.mapService.subject.next({
        eventType: 'alert-search',
        data: {alertType: this.backType},
      });
    }, 20);
  }

  getRouterParams(): void {
    this.route.queryParams.subscribe(params => {
      if(Object.keys(params).length > 0) {
        this.curTaskValue = params['taskValue'];
        this.backType = params['taskValue'];
        this.channel = params['channel'];
        this.backButtonText = params['backBtn'] || null;
      }
    });
  }

  setCurTaskValue(curValue: string): void {
    this.curTaskValue = curValue;
    if (this.backButtonText) {
      if (this.curTaskValue === AiConstLibrary.watchList) {
        this.backType = AiConstLibrary.watchList;
        this.backButtonText = 'Back To Watchlist Alerts';
      }
      if (this.curTaskValue === AiConstLibrary.behavioral) {
        this.backType = AiConstLibrary.behavioral;
        this.backButtonText = 'Back To Behavioral Alerts';
      }
      if (this.curTaskValue === AiConstLibrary.geofenceList) {
        this.backType = AiConstLibrary.geofenceList;
        this.backButtonText = 'Back To Geofence Alerts';
      }
    }
  }

  showActived(curValue: string): boolean {
    return this.curTaskValue === curValue;
  }

  taskClickEmit(type: string): void {
    this.tempTaskType = type;
    this.showLevel2Select = true;
  }

  onClickbackFn(tool: Tool): void {
    if(tool.code === 'ALG_TASK'){
      this.tempTaskType = 'task';
      this.showLevel2Select = true;
    } else if(tool.code === 'ALG_CREATE_TASK'){
      this.tempTaskType = 'createTask';
      this.showLevel2Select = true;
    }
  }

  selectedDateEmit(event : DateKey): void {
    this.aiAlgorithmService.toolBoxToBusinessDateChange$.next(event);
  }

  changeLevel2SelectVisibleFn(flag:boolean): void {
    this.showLevel2Select = flag;
  }

  changeSelectedFn(taskValue: string): void {
    this.curTaskType = this.tempTaskType;
    this.showLevel2Select = false;
    this.curTaskValue = taskValue;
  }

  private transloco(): void {
    this.taskList.forEach(e => {
      this.selectTranslate$ = this.translocoService.selectTranslate(`vs.aiAlgorithm.${e.key}`).subscribe(value => {
        e.key = value;
      });
    });
  }

  ngOnDestroy(): void {
    this.selectTranslate$ && this.selectTranslate$.unsubscribe();
    this.businessToTool$ && this.businessToTool$.unsubscribe();
    this.listening$ && this.listening$.unsubscribe();
  }
}
