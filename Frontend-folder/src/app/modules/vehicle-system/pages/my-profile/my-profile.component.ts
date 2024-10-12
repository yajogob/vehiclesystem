import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';
import { Theme } from '@enums/theme';
import dayjs from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { Tool } from '../../components/toolbox';
import { DateKey } from '../../interfaces/key-value-type';
import { ThemeSubject } from '../../services/theme.service';
import { AuthService } from "../../utils/auth.service";
import { I18nService } from '../../utils/i18n.service';
import { LoggerService } from '../../utils/logger.service';
@Component({
  selector: 'vs-my-profile',
  templateUrl: './my-profile.component.html',
})
export class MyProfileComponent implements OnInit {
  language = 'en';
  theme = Theme.DARK;
  selectedDate: TimePeriod = {
    startDate: dayjs(),
    endDate: dayjs(),
  };

  alertTaskList = [
    {label: 'All Alert', value: 'allAlerts'},
    {label: 'vs.statisticalGraph.watchlistAlerts', value: 'watchlistAlerts'},
    {label: 'vs.statisticalGraph.behavioralAlerts', value: 'behavioralAlerts'},
    {label: 'vs.statisticalGraph.geofenceAlerts', value: 'geofenceAlerts'},
  ];

  toolSet: Tool[] = [
    {
      code: 'BEHAVIORAL_ALERTS',
      category: 'view',
      value: 'vs.statisticalGraph.behavioralAlerts',
      arrowIcon: true,
    },
    {
      code: 'ALG_TASK',
      category: 'Algorithms',
      value: 'Task',
      arrowIcon: true,
    },
  ];

  showAlgorithmTask = false;
  showAlertTask = false;
  userName?: string;

  constructor(
    private themeService: ThemeService,
    private logger: LoggerService,
    private i18nService: I18nService,
    private themeEvent: ThemeSubject,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.theme = this.themeService.getColorTheme();
    this.language = this.i18nService.getLanguage();
    const userInfo = AuthService.getUserInfo();
    this.userName = userInfo.username || userInfo.user_name;
  }

  changeLanguage(data: string): void {
    this.language = data;
    this.i18nService.update(this.language);
    // window.location.reload();
  }

  changeTheme(data: string): void {
    this.theme = data as Theme;
    this.themeService.update(this.theme);

    this.themeEvent.subject.next({
      eventType: 'update',
      data: this.theme,
    });
  }

  onCallback(tool: Tool): void {
    this.showAlgorithmTask = false;
    this.showAlertTask = false;
    if(tool.code == 'ALG_TASK'){
      this.showAlgorithmTask = true;
    } else if(tool.code == 'BEHAVIORAL_ALERTS'){
      this.showAlertTask = true;
    }
  }

  closeTaskModalEmit(): void {
    this.showAlgorithmTask = false;
    this.showAlertTask = false;
  }

  selectTask(taskValue: string): void {
    this.showAlgorithmTask = false;
    this.showAlertTask = false;
    this.alertTaskList.forEach(task => {
      if(task.value == taskValue){
        this.toolSet[0].value = task.label;
      }
    });
  }

  onSelectedDateEmit(event: DateKey): void {
    this.logger.info('onSelectedDateEmit>>>', event);
  }
}
