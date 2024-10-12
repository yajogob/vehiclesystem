import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AiListChildSplit,
  AiListParentSplit,
  AlgorithmOutputData,
  InAlgorithmsListSearch,
  InBehavioralTaskSave,
  InBehavioralTaskSearch,
  InGeofenceListTaskSave,
  InGeofenceTaskSearch,
  InGpuLprTaskSave,
  InGpuLprTaskSearch,
  InWatchListTaskSave,
  InWatchListTaskSearch,
  InWhiteListTaskSearch,
  InWhitelistTaskDetail,
  InWhitelistTaskSave,
  ObOutWatchSearcDevice,
  OutAlgorithmsListSearch,
  OutAllDeviceData,
  OutWhiteListTaskSearch,
  PromiseOutAlgorithmsListSearch,
  PromiseOutBehavioralTaskSearch,
  PromiseOutGeoFenceTaskSearch,
  PromiseOutGeofenceTaskDetail,
  PromiseOutGpuLprCameraList,
  PromiseOutGpuLprTaskSearch,
  PromiseOutWatchListTaskSearch,
  PromiseOutWhiteListTaskSearch,
  PromiseOutWhitelistTaskDetail,
  Restful,
} from "../../interfaces/ai-algorithm/ai-algorithm";
import { DateKey } from '../../interfaces/key-value-type';
import { AiConstLibrary } from '../../pages/ai-algorithm/libs/ai-const-library';
import { LoggerService } from '../../utils/logger.service';
import { RequestService } from '../request/request.service';

/**
 * camera management Business Services
 */
@Injectable()
export class AiAlgorithmService {
  toolBoxToBusinessDateChange$: BehaviorSubject<DateKey> = new BehaviorSubject<DateKey>({} as DateKey);
  businessToToolBoxDateChange$: BehaviorSubject<DateKey> = new BehaviorSubject<DateKey>({} as DateKey);

  constructor(
    private logger: LoggerService,
    private requestService: RequestService,
  ) {
  }

  // algorithms search
  algorithmsListSearch(): Observable<PromiseOutAlgorithmsListSearch> {
    return new Observable(subscribe => {
      this.requestService.algorithmsListSearch().subscribe(
        {
          next: res => {
            if (res.code === '0' && res.result) {
              const {algorithNameI18nMap, algorithDescriptionI18nMap} = AiConstLibrary;
              const algorithmsList = res.result.map((item:OutAlgorithmsListSearch) => {
                item.enName = algorithNameI18nMap[item.algorithm || '']['en'];
                item.arName = algorithNameI18nMap[item.algorithm || '']['ar'];
                item.enDescription = algorithDescriptionI18nMap[item.algorithm || '']['en'];
                item.arDescription = algorithDescriptionI18nMap[item.algorithm || '']['ar'];
                return item;
              });
              const { leftList, rightList } = this.resultSplit(algorithmsList);
              const leftObj = this.childSplit(leftList);
              const rightObj = this.childSplit(rightList);

              this.midHandle(leftObj.mid, 180, 0);
              this.midHandle(rightObj.mid, 0, 0);

              this.topHandle(leftObj.top, 180 + 8, 8, 8, 8);
              this.topHandle(rightObj.top, -8, -8, -8, -8);

              this.bottomHandle(leftObj.bottom, 180 - 8, -8, -8, -8);
              this.bottomHandle(rightObj.bottom, 8, 8, 8, 8);

              const left = this.concatHandle(leftObj);
              const right = this.concatHandle(rightObj);

              const res2 = {
                leftData: { 'result': left },
                rightData: { 'result': right },
                data: { result: res.result },
              };

              subscribe.next(res2);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
          error: err => {
            subscribe.error(err);
          },
        },
      );
    });
  }

  private resultSplit = (result: Array<OutAlgorithmsListSearch>): AiListParentSplit => {
    const isMore = result.length > 19;
    const renderList = result.length > 19 ? result.slice(0, 19) : result;
    if (isMore) {
      renderList.push({
        name: "View more Algorithms",
        enName: "View more Algorithms",
        arName: "عرض المزيد من الخوارزميات",
        algorithm: "view-more",
        isMore,
      });
    }
    const parentNum = Number((renderList.length / 2).toFixed(0));
    const rightList = renderList.filter((v: OutAlgorithmsListSearch, i: number) => i < parentNum);
    const leftList = renderList.filter((v: OutAlgorithmsListSearch, i: number) => i >= parentNum);
    return { leftList, rightList };
  };

  private childSplit = (childResult: Array<OutAlgorithmsListSearch>): AiListChildSplit => {
    let parentNum = 0;
    if (childResult.length > 2) parentNum = Math.floor(childResult.length / 2);

    const top = childResult.filter((v: OutAlgorithmsListSearch, i: number) => i < parentNum);
    const mid = childResult.filter((v: OutAlgorithmsListSearch, i: number) => i === parentNum);
    const bottom = childResult.filter((v: OutAlgorithmsListSearch, i: number) => i > parentNum);
    return { top, mid, bottom };
  };

  private midHandle = (list: Array<OutAlgorithmsListSearch>, angleValue: number, rotateValue: number): void => {
    list.forEach((item: OutAlgorithmsListSearch) => {
      item['angle'] = angleValue;
      item['rotate'] = rotateValue;
    });
  };

  private topHandle = (list: Array<OutAlgorithmsListSearch>, angleSV: number, angleStep: number, rotateSV: number, rotateStep: number): void => {
    if (list.length) {
      const maxIndex= list.length - 1;
      list[maxIndex]['angle'] = angleSV;
      list[maxIndex]['rotate'] = rotateSV;
      for (let index = maxIndex; index > 0; index--) {
        list[index - 1]['angle'] = list[index]['angle'] as number + angleStep;
        list[index - 1]['rotate'] = list[index]['rotate'] as number + rotateStep;
      }
    }
  };

  private bottomHandle = (list: Array<OutAlgorithmsListSearch>, angleSV: number, angleStep: number, rotateSV: number, rotateStep: number): void => {
    for (let index = 0; index < list.length; index++) {
      if (index === 0) {
        list[index]['angle'] = angleSV;
        list[index]['rotate'] = rotateSV;
      } else {
        list[index]['angle'] = list[index - 1]['angle'] as number + angleStep;
        list[index]['rotate'] = list[index - 1]['rotate'] as number + rotateStep;
      }
    }
  };

  private concatHandle = (childObj: AiListChildSplit): Array<OutAlgorithmsListSearch> => {
    const leftOrRight = childObj.top.concat(childObj.mid, childObj.bottom);
    leftOrRight.forEach((item: OutAlgorithmsListSearch) => {
      item['rotate'] = `rotate(${item.rotate}deg)`;
    });
    return leftOrRight;
  };

  // query watch list task
  watchlistTaskSearch = (params: InWatchListTaskSearch): Observable<PromiseOutWatchListTaskSearch> => {
    return new Observable(subscribe => {
      this.requestService.watchlistTaskSearch(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // create watchlist task save
  watchListTaskSave = (params: InWatchListTaskSave): Observable<Restful> => {
    delete params['camera'];
    return new Observable(subscribe => {
      this.requestService.watchListTaskSave(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // Delete watchlist task
  watchlistTaskDelete = (id: string): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.watchlistTaskDelete({ id }).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // watch List Task Enable
  watchListTaskEnable = (id: string): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.watchListTaskEnable({ id }).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // watch List Task Disable
  watchListTaskDisable = (id: string): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.watchListTaskDisable({ id }).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // watch List Task Disable
  watchlistTaskSearcDevice = (id: string): Observable<ObOutWatchSearcDevice> => {
    return new Observable(subscribe => {
      this.requestService.watchlistTaskSearcDevice(id).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // create whitelist task save
  whiteListTaskSaveAdd = (params: InWhitelistTaskSave): Observable<OutWhiteListTaskSearch> => {
    params.taskType = 'whitelist';
    return new Observable(subscribe => {
      this.requestService.whiteListTaskSaveAdd(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // update whitelist task save
  whiteListTaskSaveUpdate = (params: InWhitelistTaskSave): Observable<OutWhiteListTaskSearch> => {
    params.taskType = 'whitelist';
    return new Observable(subscribe => {
      this.requestService.whiteListTaskSaveUpdate(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // Delete whitelist task
  whitelistTaskDelete = (id: string): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.whitelistTaskDelete({ id }).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // query white list task
  whitelistTaskSearch = (params: InWhiteListTaskSearch): Observable<PromiseOutWhiteListTaskSearch> => {
    params.startDate = params.startDate ? params.startDate : '';
    params.endDate = params.endDate ? params.endDate : '';
    params.region = params.region || '';
    params.plateNumber = params.plateNumber || '';
    params.plateColor = params.plateColor || '';
    params.plateCategory = params.plateCategory || '';
    return new Observable(subscribe => {
      this.requestService.whitelistTaskSearch(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // query white list Task Detail
  whitelistTaskDetail = (params: InWhitelistTaskDetail): Observable<PromiseOutWhitelistTaskDetail> => {
    return new Observable(subscribe => {
      this.requestService.whitelistTaskDetail(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              if (params.type === 'alert') {
                res.result.data.forEach(item => {
                  item.alertIcon = item.alertType ? item.alertType.toLocaleLowerCase() : '';
                });
              }
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // query Behavioral task
  behavioralTaskSearch = (params: InBehavioralTaskSearch): Observable<PromiseOutBehavioralTaskSearch> => {
    return new Observable(subscribe => {
      this.requestService.behavioralTaskSearch(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  behavioralListTaskSave = (params: InBehavioralTaskSave): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.behavioralTaskSave(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  getAllDeviceData = (): Observable<OutAllDeviceData> => {
    return new Observable(subscribe => {
      this.requestService.getAllDeviceData().subscribe(
        {
          next: res => {
            subscribe.next(res);
            subscribe.complete();
          },
          error: err => {
            subscribe.error(err);
          },
        },
      );
    });
  };

  behavioralAlgorithmInfo = (params: string): Observable<AlgorithmOutputData> => {
    return new Observable(subscribe => {
      this.requestService.behavioralAlgorithmInfo(params).subscribe(
        {
          next: res => {
            if (res.code === '0' && res.result?.length > 0) {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  behavioralTaskDelete = (taskId: string): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.behavioralTaskDelete({ taskId }).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // query geofence task
  geofenceListTaskSearch = (params: InGeofenceTaskSearch): Observable<PromiseOutGeoFenceTaskSearch> => {
    params.startDateTime = params.startDateTime ? params.startDateTime : '';
    params.endDateTime = params.endDateTime ? params.endDateTime : '';
    params.taskName = params.taskName || '';
    return new Observable(subscribe => {
      this.requestService.geofenceListTaskSearch(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  geofenceListTaskDelete = (taskId: number): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.geofenceListTaskDelete({ taskId }).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  geofenceListTaskSave = (params: InGeofenceListTaskSave): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.geofenceListTaskSave(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  geofenceListTaskEnable = (params: { taskId: number, taskStatus: number }): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.geofenceListTaskEnable(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  geofenceTaskDetail = (taskId: number): Observable<PromiseOutGeofenceTaskDetail> => {
    return new Observable(subscribe => {
      this.requestService.geofenceTaskDetail({ taskId }).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // query gpu lpr task
  gpuLprTaskSearch = (params: InGpuLprTaskSearch): Observable<PromiseOutGpuLprTaskSearch> => {
    return new Observable(subscribe => {
      this.requestService.gpuLprTaskSearch(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // query Camera list
  gpuLprTaskCameraQuery = (): Observable<PromiseOutGpuLprCameraList> => {
    return new Observable(subscribe => {
      this.requestService.gpuLprTaskCameraQuery().subscribe(
        {
          next: res => {
            subscribe.next(res.result);
            subscribe.complete();
          },
          error: err => {
            err;
            const res2 = {
              'content': [
                { deviceId: '32057100001327000001', deviceName: 'camera-01' },
                { deviceId: '32057100001327000002', deviceName: 'camera-02' },
                { deviceId: '32057100001327000003', deviceName: 'camera-03' },
                { deviceId: '04', deviceName: 'camera-04' },
                { deviceId: '05', deviceName: 'camera-05' },
                { deviceId: '06', deviceName: 'camera-06' },
                { deviceId: '07', deviceName: 'camera-07' },
                { deviceId: '08', deviceName: 'camera-08' },
              ],
            };
            subscribe.next(res2);
          },
        },
      );
    });
  };

  // Delete gpuLpr Task
  gpuLprTaskDelete = (id: string): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.gpuLprTaskDelete({ id }).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // create or update gpuLpr Task
  gpuLprTaskSave = (params: InGpuLprTaskSave): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.gpuLprTaskSave(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // start Task
  gpuLprTaskStart = (params: InAlgorithmsListSearch): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.gpuLprTaskStart(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // start Task
  gpuLprTaskStop = (params: InAlgorithmsListSearch): Observable<Restful> => {
    return new Observable(subscribe => {
      this.requestService.gpuLprTaskStop(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };
}


