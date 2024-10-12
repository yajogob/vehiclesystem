import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';
import { TranslocoService } from '@ngneat/transloco';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import {
  GridComponent,
  GridComponentOption,
  MarkLineComponent,
  MarkLineComponentOption,
  TooltipComponent,
  TooltipComponentOption,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { Subscription } from 'rxjs';
import { TrafficParams } from 'src/app/modules/vehicle-system/interfaces/home/http.params';
import { I18nService } from 'src/app/modules/vehicle-system/utils/i18n.service';
import { LiveTrafficData } from '../../../../interfaces/home/http.response';
import { ThemeSubject } from '../../../../services/theme.service';

echarts.use([GridComponent,TooltipComponent, MarkLineComponent, LineChart, CanvasRenderer, UniversalTransition]);

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption | TooltipComponentOption | MarkLineComponentOption
>;

@Component({
  selector: 'vs-live-traffic',
  templateUrl: './live-traffic.component.html',
  styleUrls: ['./live-traffic.component.scss'],
})
export class LiveTrafficComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() liveTrafficParams!: TrafficParams;
  @Input() chartData:Array<LiveTrafficData>=[];
  @Input() size='small';
  @ViewChild('chartContainer') chartDom: ElementRef | undefined;

  theme='';
  smallOptions: EChartsOption = {};
  bigOptions: EChartsOption = {};
  yAxisName='';
  xAxisName='';
  isNoData = false;

  language = 'en';
  private timeSub$!: Subscription;
  private vehicleCaptureSub$!: Subscription;

  constructor(
    private themeService: ThemeService,
    private tl: TranslocoService,
    private themeEvent: ThemeSubject,
    private i18nService: I18nService,
  ) {}


  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.theme = this.themeService.getColorTheme();
    this.themeEvent.subject.subscribe(({eventType, data}) => {
      if (eventType === 'update') {
        this.theme = data || '';
      }
    });

    this.i18nService.getLanguageObservable().subscribe(lang => {
      this.language = lang;
    });
  }

  ngAfterViewInit():void {
    setTimeout(() => {
      this.setChartOption();
    }, 200);
  }

  ngOnChanges(changes: SimpleChanges):void {
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      this.setChartOption();
    }
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  setChartOption():void {
    const xAxisData: Array<string> = [];
    const seriesMarkLineData: Array<object> = [];
    const seriesData: Array<number> = [];
    this.timeSub$ = this.tl.selectTranslate('vs.statisticalGraph.time').subscribe(value => {
      this.xAxisName = value;
    });
    this.vehicleCaptureSub$ = this.tl.selectTranslate('vs.statisticalGraph.vehicleCapture').subscribe(value => {
      this.yAxisName = value;
    });

    const sd = new Date(this.liveTrafficParams.startDateTime);
    const ed = new Date(this.liveTrafficParams.endDateTime);
    let sameDay = false;
    if(sd.getFullYear() === ed.getFullYear() && sd.getMonth() === ed.getMonth() && sd.getDate() === ed.getDate()) {
      sameDay = true;
    }

    const formatterCount = (value:number):string => {
      if (value >= 1e9) {
        return (value / 1e9).toFixed(0) + 'B';
      } else if (value >= 1e6) {
        return (value / 1e6).toFixed(0) + 'M';
      } else if (value >= 1e3) {
        return (value / 1e3).toFixed(0) + 'K';
      } else {
        return value.toString();
      }
    };
    let maxCountStr = '';
    this.chartData.forEach((item, index) => {
      const countStr = formatterCount(item.vehicleCaptureCount);
      maxCountStr = countStr.length > maxCountStr.length ? countStr : maxCountStr;
      xAxisData.push(item.currentTime);
      seriesMarkLineData.push({xAxis: index + 1});
      seriesData.push(item.vehicleCaptureCount);
    });

    this.smallOptions = {
      grid: {
        top: '15px',
        right: '20px',
        bottom: '40px',
        left: `${maxCountStr.length * 7 + 7}px`,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: sameDay ? this.language === 'en' ? 'Time' : 'الوقت .' : this.language === 'en' ? 'Date' : 'تواريخ',
        nameLocation: 'middle',
        nameTextStyle: {
          verticalAlign: "top",
          lineHeight: 34,
          color: '#FFF84D',
          fontSize: '1rem',
          fontWeight: 700,
        },
        axisLabel: {
          color: '#ffffff',
          fontSize: '0.8rem',
          align: 'center',
          padding: [0, 0, 0, 8],
          interval: (index): boolean => {
            if(sameDay || xAxisData.length > 15) {
              if(index % 6 === 0 || index === xAxisData.length - 1) {
                return true;
              }
            } else {
              if(index % 3 === 0 || index === xAxisData.length - 1) {
                return true;
              }
            }
            return false;
          },
        },
        axisTick: {show: false},
        splitLine: {
          show: true,
          lineStyle: {color: 'rgba(255, 248, 77, 0.5)', width: 1},
        },
        axisLine: {lineStyle: {color: 'rgba(255, 248, 77, 0.5)', width: 1}},
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
        splitNumber: 2,
        minInterval: 1,
        axisLabel: {
          color: '#FFFFFF',
          fontSize: '0.8rem',
          margin: 4,
          formatter: (value:number): string => {
            return formatterCount(value);
          },
        },
        splitLine: {show: false},
      },
      series: [{
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {color: '#F9F36C'},
        itemStyle: {color: 'transparent'},
        data: seriesData,
      }],
    };

    this.bigOptions = {
      tooltip: {
        trigger: 'axis',
        borderColor: 'transparent',
        formatter:`${this.language === 'ar' ? 'الوقت .' : 'Time'} :  {b0} <br />${this.language === 'ar' ? 'عد' : 'Counts'} :  {c0}`,
        textStyle: {color: this.theme === 'dark' ? '#fff' : '#000', fontSize: 12},
        backgroundColor: this.theme === 'dark' ? '#283134' : '#eae7dd',
      },
      grid: {
        top: '20px',
        right: '45px',
        bottom: '60px',
        left: `${maxCountStr.length * 14 + 14}px`,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: sameDay ? this.language === 'en' ? 'Time' : 'الوقت .' : this.language === 'en' ? 'Date' : 'تواريخ',
        nameLocation: "middle",
        nameTextStyle: {
          align: "center",
          verticalAlign: "top",
          lineHeight: 65,
          color: this.theme === 'dark' ? '#FFF84D' : '#363525',
          fontSize: '1.375rem',
          fontWeight: 700,
        },
        axisLabel: {
          color: this.theme === 'dark' ? '#969385' : '#202020',
          fontSize: '1.2rem',
          interval: (index): boolean => {
            if(sameDay || xAxisData.length > 15) {
              if(index % 4 === 0 || index === xAxisData.length - 1) {
                return true;
              }
            } else {
              if(index % 2 === 0 || index === xAxisData.length - 1) {
                return true;
              }
            }
            return false;
          },
        },
        axisTick: {show: false},
        splitLine: {
          show: true,
          lineStyle: {color: this.theme === 'dark' ? 'rgba(255, 248, 77, 0.5)' : '#B4B4B4', width: 1},
        },
        axisLine: {lineStyle: {color: this.theme === 'dark' ? 'rgba(255, 248, 77, 0.5)' : '#D0C3C3', width: 1}},
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
        splitNumber: 2,
        minInterval: 1,
        axisLabel: {
          color: this.theme === 'dark' ? '#969385' : '#202020',
          fontSize: '1.2rem',
          margin: 6,
          formatter: (value:number): string => {
            return formatterCount(value);
          },
        },
        splitLine: {show: false},
      },
      series: [{
        type: 'line',
        smooth: true,
        symbol: 'none',
        itemStyle: {color: 'transparent'},
        areaStyle: {color: '#F9F36C'},
        data: seriesData,
      },
      ],
    };

    this.initChart();

    let sumCount = 0;
    this.chartData.forEach(item => {
      sumCount += item.vehicleCaptureCount;
    });
    this.isNoData = !sumCount;
  }

  initChart(): void {
    const chartDom = this.chartDom?.nativeElement || {};
    const myChart = echarts.init(chartDom);
    let options:EChartsOption = {};
    if (this.size === 'small') {
      options = this.smallOptions;
    } else if (this.size === 'big') {
      options = this.bigOptions;
    }
    myChart.setOption(options);
  }
  /* custom function   -----end */
}
