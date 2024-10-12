import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { CompatClient, Message, Stomp } from '@stomp/stompjs';
import { Subscription, tap } from 'rxjs';
import SockJS from 'sockjs-client';
import { TRAFFICMenuList } from 'src/app/modules/vehicle-system/interfaces/rbac';
import { AllResourceList } from 'src/app/modules/vehicle-system/libs/path-library';
import { AuthService } from 'src/app/modules/vehicle-system/utils/auth.service';
import { EnvironmentService } from 'src/app/services/EnvironmentService';
import { HomePageTopAlertRes, TopAlarm } from '../../../../interfaces/home/http.response';
import { HomeHttpRequest } from '../../../../services/home/http.service';

@Component({
  selector: 'vs-top-alarm',
  templateUrl: './top-alarm.component.html',
  styleUrls: ['./top-alarm.component.scss'],
})
export class TopAlarmComponent implements OnInit, OnDestroy {
  @Output() goAlertsEmit = new EventEmitter<string>();

  allResourceList = AllResourceList;
  watchlistAlerts: Array<TopAlarm>=[];
  watchlistIndex=0;
  behavioralAlerts: Array<TopAlarm>=[];
  behavioralIndex=0;
  geofenceAlerts: Array<TopAlarm>=[];
  geofenceIndex=0;
  transLocoList = [
    {key: 'vs.trafficFine.numberPlate', value: ''},
    {key: 'vs.public.Alert', value: ''},
    {key: 'vs.public.date', value: ''},
    {key: 'vs.public.time', value: ''},
    {key: 'vs.public.camera', value: ''},
    {key: 'vs.public.alertTaskName', value: ''},
    {key: 'vs.public.algorithmName', value: ''},
  ];

  private selectTranslate$!: Subscription;
  private behavioralAlertWS?: CompatClient;
  private realTimeAlarmWS?: WebSocket;
  private keepHeartTimer = -1;
  private errorConnectCount = 0;

  constructor(
    private homeHttpRequest: HomeHttpRequest,
    private translocoService: TranslocoService,
    private environmentService: EnvironmentService,
  ) {}


  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.transLocoText();
    this.setWatchlistAlerts();
    this.setBehavioralAlerts();
    this.setGeofenceAlerts();
    this.initRealTimeAlarmWS();
    this.initBehavioralAlertWS();
  }

  ngOnDestroy(): void {
    this.closeRealTimeAlarmWS();
    this.selectTranslate$ && this.selectTranslate$.unsubscribe();
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  private transLocoText(): void {
    this.transLocoList.forEach(item => {
      this.selectTranslate$ = this.translocoService.selectTranslate(item.key).subscribe(value => {
        item.value = value;
      });
    });
  }

  goAlerts(alert: string, accessName: string): void {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const hasAccess = meunListRes.some((item: TRAFFICMenuList) => item.uriSet === accessName);
    if(hasAccess) {
      this.goAlertsEmit.emit(alert);
    }
  }

  setWatchlistAlerts():void {
    const res = this.homeHttpRequest.postHomePageWatchListAlertApi();
    res.pipe(
      tap({
        error: () => {
          this.watchlistAlerts = [];
        },
      }),
    ).subscribe((data:HomePageTopAlertRes) => {
      if (data.status === 200) {
        this.watchlistAlerts = data.result.content;
      } else {
        this.watchlistAlerts = [];
      }
    });
  }

  setBehavioralAlerts():void {
    const res = this.homeHttpRequest.postHomePageBehavioralAlerttApi();
    res.pipe(
      tap({
        error: () => {
          this.behavioralAlerts = [];
        },
      }),
    ).subscribe((data:HomePageTopAlertRes) => {
      if (data.status === 200) {
        this.behavioralAlerts = data.result.content || [];
      } else {
        this.behavioralAlerts = [];
      }
    });
  }

  setGeofenceAlerts():void {
    const res = this.homeHttpRequest.postHomePageGeofenceAlertApi();
    res.pipe(
      tap({
        error: () => {
          this.geofenceAlerts = [];
        },
      }),
    ).subscribe((data:HomePageTopAlertRes) => {
      if (data.status === 200) {
        this.geofenceAlerts = data.result.content;
      } else {
        this.geofenceAlerts = [];
      }
    });
  }

  addGeofenceAlertById(data:TopAlarm): void {
    for (let i = 0; i < this.geofenceAlerts.length; i++) {
      const element = this.geofenceAlerts[i];
      if (element.id === data.id) {
        this.geofenceAlerts.splice(i, 1, data);
        break;
      }
    }
  }

  setWatchlistIndex(type:string):void {
    const maxIndex = this.watchlistAlerts.length - 1;
    if (type === 'prev') {
      this.watchlistIndex = this.watchlistIndex > 0 ? this.watchlistIndex - 1 : 0;
    } else if (type === 'next') {
      this.watchlistIndex = this.watchlistIndex < maxIndex ? this.watchlistIndex + 1 : maxIndex;
    }
  }

  setBehavioralIndex(type:string):void {
    const maxIndex = this.behavioralAlerts.length - 1;
    if (type === 'prev') {
      this.behavioralIndex = this.behavioralIndex > 0 ? this.behavioralIndex - 1 : 0;
    } else if (type === 'next') {
      this.behavioralIndex = this.behavioralIndex < maxIndex ? this.behavioralIndex + 1 : maxIndex;
    }
  }

  setGeofenceIndex(type:string):void {
    const maxIndex = this.geofenceAlerts.length - 1;
    if (type === 'prev') {
      this.geofenceIndex = this.geofenceIndex > 0 ? this.geofenceIndex - 1 : 0;
    } else if (type === 'next') {
      this.geofenceIndex = this.geofenceIndex < maxIndex ? this.geofenceIndex + 1 : maxIndex;
    }
  }

  accessHandle = (accessName: string): boolean => {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const accessParams = accessName || '';
    const next = meunListRes.some((item: TRAFFICMenuList) => {
      return item.uriSet.includes(accessParams);
    });
    return next;
  };

  // Real-time alarm for websocket
  initBehavioralAlertWS(): void {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const filterRequest = {
      subSystem: 'Traffic',
      areaPathList:[],
      cameraList:[],
      startTime: Date.now(),
      endTime: endDate.getTime(),
    };

    const {access_token, user_name} = AuthService.getUserInfo();
    const BEHAVIORAL_ALERT_WS = this.environmentService.getGlobalVariable('BEHAVIORAL_ALERT_WS');
    const socket = new SockJS(`${location.protocol}//${BEHAVIORAL_ALERT_WS}`);
    this.behavioralAlertWS = Stomp.over(socket);
    const customHeaders = {
      Authorization: `Bearer ${access_token}`,
      filterRequest: JSON.stringify(filterRequest),
    };
    this.behavioralAlertWS.connect(customHeaders, ():void => {
      this.behavioralAlertWS?.subscribe(`/user/${user_name}/topic/pushmessages`, (message: Message) => {
        const alertData = JSON.parse(message.body);
        if (Array.isArray(alertData)) {
          alertData.forEach(item => {
            const date = new Date(item.hitTime);
            item.warningTime = date.getTime();
            this.pushBehavioralAlerts(item);
          });
        } else {
          const date = new Date(alertData.hitTime);
          alertData.warningTime = date.getTime();
          this.pushBehavioralAlerts(alertData);
        }
      });

      this.behavioralAlertWS?.send("/app/websocketFilter", {'Authorization': `Bearer ${access_token}`}, JSON.stringify(filterRequest));
    });
  }

  pushBehavioralAlerts(alertData: TopAlarm): void {
    if (this.behavioralAlerts.length > 2) {
      this.behavioralAlerts.shift();
    }
    this.behavioralAlerts.push(alertData);
  }

  initRealTimeAlarmWS(): void {
    const {user_name} = AuthService.getUserInfo();
    const wsProtocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
    this.realTimeAlarmWS = new WebSocket(`${wsProtocol}${location.host}/backend-lpr/alert/${user_name}`);

    this.realTimeAlarmWS.addEventListener('open', () => {
      if (this.realTimeAlarmWS) {
        this.keepWebsocketHeart(this.realTimeAlarmWS);
      }
    });

    // When an error occurs, the websocket is relink
    this.realTimeAlarmWS.addEventListener('error', () => {
      this.closeRealTimeAlarmWS();
      // Reconnect a maximum of 9 times
      if (this.errorConnectCount < 9) {
        setTimeout(() => {
          this.errorConnectCount += 1;
          this.initRealTimeAlarmWS();
        }, 5000);
      }
    });

    // Accept real-time alarms，And display to the page
    this.realTimeAlarmWS.addEventListener('message', (event): void => {
      const alarmData:TopAlarm = JSON.parse(event.data);
      // "alertType":  1:watchlist 2:geofence
      if (alarmData.alertType) {
        switch(String(alarmData.alertType)) {
          case '1':
            this.pushWatchlistAlerts(alarmData);
            break;
          case '2':
            this.addGeofenceAlertById(alarmData);
            break;
        }
      }
    });
  }

  pushWatchlistAlerts(alertData: TopAlarm): void {
    if (this.watchlistAlerts.length > 2) {
      this.watchlistAlerts.shift();
    }
    this.watchlistAlerts.push(alertData);
  }

  closeRealTimeAlarmWS(): void {
    if (this.keepHeartTimer) {
      window.clearTimeout(this.keepHeartTimer);
    }
    if (this.realTimeAlarmWS) {
      this.realTimeAlarmWS.close();
    }
    this.realTimeAlarmWS = undefined;
  }

  keepWebsocketHeart(websocket: WebSocket): void {
    if (websocket) {
      websocket.send('h');
      this.keepHeartTimer = window.setTimeout(() => {
        this.keepWebsocketHeart(websocket);
      }, 10000);
    }
  }
  /* custom function   -----end */
}
