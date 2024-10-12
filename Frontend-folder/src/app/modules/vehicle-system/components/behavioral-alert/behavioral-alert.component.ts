import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';
import { TranslocoService } from '@ngneat/transloco';
import dayjs from 'dayjs/esm';
import { BarChart, BarSeriesOption, LineChart, LineSeriesOption } from 'echarts/charts';
import { GridComponent, GridComponentOption, LegendComponent, LegendComponentOption, TitleComponent, TitleComponentOption } from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import {
  BehavioralAlertData,
  BehavioralAlertLineData,
} from '../../interfaces/home/http.response';
import { I18nService } from '../../utils/i18n.service';

echarts.use([GridComponent, TitleComponent, LegendComponent, BarChart,  LineChart, CanvasRenderer, UniversalTransition]);

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption | BarSeriesOption | TitleComponentOption | LegendComponentOption
>;

@Component({
  selector: 'vs-behavioral-alert',
  templateUrl: './behavioral-alert.component.html',
  styleUrls: ['./behavioral-alert.component.scss'],
})
export class BehavioralAlertComponent implements AfterViewInit, OnChanges {
  @Input() chartData:Array<BehavioralAlertData>=[];
  @Input() lineChartData:Array<BehavioralAlertLineData>=[];
  @Input() size='small';
  @Input() showStackedLine=false;
  @ViewChild('chartContainer') chartDom: ElementRef | undefined;
  @ViewChild('lineChartContainer') lineChartDom: ElementRef | undefined;

  smallOptions: EChartsOption = {};
  bigOptions: EChartsOption = {};
  lineOptions: EChartsOption = {};
  behavioralLoading=false;
  language = 'en';
  private dataTheme = 'dark';
  isNoData = false;

  constructor(
    private tl: TranslocoService,
    private themeService: ThemeService,
    private i18nService: I18nService,
  ) {}


  /* Lifecycle function  -----start */
  ngAfterViewInit():void {
    this.dataTheme = this.themeService.getColorTheme();
    setTimeout(() => {
      this.setChartOption();
      this.setLineChartOption();
    }, 200);
  }

  ngOnChanges(changes: SimpleChanges):void {
    this.language = this.i18nService.getLanguage();
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      this.setChartOption();
    }
    if (changes['lineChartData'] && !changes['lineChartData'].firstChange) {
      this.setLineChartOption();
    }
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  setChartOption():void {
    const xAxisData: Array<string> = [];
    const bigxAxisData: Array<string> = [];
    const seriesData: Array<number> = [];
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
    this.chartData.forEach(item => {
      let newName = '';
      let bigNewName = '';
      const nameSplit = (item && item.name) ? item.name.split(' ') : [];
      nameSplit.forEach((item, index) => {
        if (index < 1) {
          newName = (item.substring(0, 1).toLocaleUpperCase() + item.substring(1)).trim();
        }

        if (index > 1) {
          bigNewName = bigNewName.includes('...') ? bigNewName : (bigNewName + '...');
        } else {
          bigNewName = (bigNewName + '\n' + item.substring(0, 1).toLocaleUpperCase() + item.substring(1)).trim();
        }
      });
      const countStr = formatterCount(item.count);
      maxCountStr = countStr.length > maxCountStr.length ? countStr : maxCountStr;
      xAxisData.push(newName);
      bigxAxisData.push(bigNewName);
      seriesData.push(item.count);
    });

    this.smallOptions = {
      grid: {
        top: '15px',
        right: '10px',
        bottom: '20px',
        left: `${maxCountStr.length * 7 + 7}px`,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          color: '#ffffff',
          fontSize: '0.7rem',
          width: 45,
          overflow: 'break',
          interval: 0,
        },
        axisLine: {
          show: true,
          lineStyle: {color: '#A28888'},
        },
        axisTick: {show: false},
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
        splitNumber: 3,
        minInterval: 1,
        axisLabel: {
          color: '#FFFFFF',
          fontSize: '0.8rem',
          margin: 4,
          formatter: (value:number): string => {
            return formatterCount(value);
          },
        },
        axisLine: {
          show: true,
          lineStyle: {color: '#A28888' },
        },
        splitLine: {show: false},
      },
      series: [
        {
          data: seriesData,
          type: 'bar',
          showBackground: true,
          barWidth: 5,
          backgroundStyle: {
            color: '#969385',
            borderRadius: 20,
          },
          itemStyle: {
            color: '#DEA25B',
            borderRadius: 15,
          },
        },
      ],
    };
    this.bigOptions = {
      grid: {
        top: '20px',
        right: '45px',
        bottom: '60px',
        left: `${maxCountStr.length * 14 + 14}px`,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          color: '#969385',
          fontSize: '1.2rem',
          fontWeight: 700,
          overflow: 'break',
          interval: 0,
          width: 80,
        },
        axisTick: {show: false},
        axisLine: {show: false},
        data: bigxAxisData,
      },
      yAxis: {
        type: 'value',
        splitNumber: 3,
        minInterval: 1,
        axisLabel: {
          color: '#969385',
          fontSize: '1.2rem',
          fontWeight: 700,
          showMaxLabel: false,
        },
        max(value): number {
          return value.max;
        },
        axisLine: {
          show: true,
          lineStyle: {color: '#B2B2B2', width: 2 },
        },
        splitLine: {show: true, lineStyle: {color: '#B2B2B2'}},
      },
      series: [
        {
          data: seriesData,
          type: 'bar',
          showBackground: true,
          barWidth: 10,
          backgroundStyle: {
            color: '969385',
            borderRadius: 99,
          },
          markLine: {
            data: [{type: "max"}],
            lineStyle: {
              width: 1,
              type: 'solid',
              color: this.dataTheme === 'dark' ? '#1f1f1f' : '#eae7dd',
            },
            animation: false,
            emphasis: {disabled: true},
            label: {show: false},
          },
          itemStyle: {
            color: '#DEA25B',
            borderRadius: 99,
          },
        },
        {
          data: seriesData,
          type: 'bar',
          barWidth: 13,
          barGap: '-112%',
          markLine: {
            data: [{type: "max"}],
            lineStyle: {
              width: 1,
              type: 'solid',
              color: this.dataTheme === 'dark' ? '#1f1f1f' : '#eae7dd',
            },
            animation: false,
            emphasis: {disabled: true},
            label: {show: false},
          },
          itemStyle: {
            color: '#DEA25B',
            borderRadius: 99,
          },
        },
      ],
    };

    this.initChart();

    let sumCount = 0;
    this.chartData.forEach(item => {
      sumCount += item.count;
    });
    this.isNoData = !sumCount;
  }

  initChart():void {
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

  setLineChartOption():void {
    const majorCount: Array<[number, number]> = [];
    const minorCount: Array<[number, number]> = [];
    const criticalCount: Array<[number, number]> = [];
    const yAxisName = this.tl.translate('vs.statisticalGraph.noOfAlert');

    this.lineChartData.forEach(item => {
      majorCount.push([item.currentTimeDate, item.majorCount]);
      minorCount.push([item.currentTimeDate, item.minorCount]);
      criticalCount.push([item.currentTimeDate, item.criticalCount]);
    });
    const xAxisDataLength = this.lineChartData.length;
    const xAxisDataRender: string[] = [];
    let timer = 0;
    this.lineOptions = {
      title: {
        text: 'Priority',
        textStyle: {
          fontSize: '1.125rem',
          color: this.dataTheme === 'dark' ? '#FFF84D' : '#363525',
        },
      },
      grid: {
        top: '50px',
        right: '40px',
        bottom: '60px',
        left: "80px",
      },
      tooltip: {
        trigger: 'axis',
        borderColor: 'transparent',
        textStyle: {color: this.dataTheme === 'dark' ? '#fff' : '#000', fontSize: 12},
        backgroundColor: this.dataTheme === 'dark' ? '#283134' : '#eae7dd',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter(params: any[]):string {
          const currntTimeStr = dayjs(params[0].value[0]).format('DD MMM YYYY HH:mm');
          let valueStr = '';
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params.forEach((item:any) => {
            valueStr += `${item.marker} <span style="display:inline-block; width:60px;">${item.seriesName}</span>  ${item.value[1]} <br/>`;
          });
          return currntTimeStr + '<br/>' + valueStr;
        },
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        name: "Time & Date",
        nameLocation: "middle",
        nameTextStyle: {
          align: "center",
          verticalAlign: "top",
          lineHeight: 70,
          color: this.dataTheme === 'dark' ? '#FFF84D' : '#363525',
          fontSize: '1rem',
          fontWeight: 700,
        },
        nameGap: 8,
        axisLabel: {
          color: '#969385',
          fontSize: '0.8rem',
          formatter(value:number, index:number):string {
            const tmpList = dayjs(Number(value)).format('DD MMM YYYY HH:mm').split(' ');
            if (xAxisDataLength <= 48) {
              return tmpList[3];
            }
            if (timer) {
              clearTimeout(timer);
            }
            timer = window.setTimeout(() => {
              xAxisDataRender.length = 0;
            }, 200);

            const dataStr = tmpList[0] + ' ' + tmpList[1];
            if (index === 0) {
              return dataStr;
            }
            if (xAxisDataRender.includes(dataStr)) {
              return ' ';
            } else {
              xAxisDataRender.push(dataStr);
              return dataStr;
            }
          },
        },
        axisTick: {show: false},
        splitLine: {
          show: true,
          lineStyle: {color: this.dataTheme === 'dark' ? 'rgba(255, 248, 77, 0.5)' : '#B4B4B4', width: 1},
        },
        axisLine: {lineStyle: {color: this.dataTheme === 'dark' ? 'rgba(255, 248, 77, 0.5)' : '#D0C3C3', width: 1}},
      },
      yAxis: {
        type: 'value',
        splitNumber: 3,
        minInterval: 1,
        name: yAxisName,
        nameLocation: "middle",
        nameTextStyle: {
          align: "center",
          verticalAlign: "bottom",
          lineHeight: 110,
          color: this.dataTheme === 'dark' ? '#FFF84D' : '#363525',
          fontSize: '1rem',
          fontWeight: 700,
        },
        nameRotate: 90,
        nameGap: 1,
        axisLabel: {
          color: '#969385',
          fontSize: '0.8rem',
          fontWeight: 400,
        },
        axisLine: {lineStyle: {color: this.dataTheme === 'dark' ? 'rgba(255, 248, 77, 0.5)' : '#D0C3C3', width: 1}},
        splitLine: {show: false},
      },
      legend: {
        type: "plain",
        itemWidth: 0,
        itemHeight: 0,
        left: '70px',
        top: '-4px',
        itemGap: 0,
        data: [
          {
            name: this.language === 'en' ? 'CRITICAL' : 'حساس',
            textStyle: {
              height: 20,
              color: '#ffffff',
              backgroundColor: '#E71D36',
              borderRadius: [10, 10, 10, 10],
              padding: [0, 8, 0, 8],
            },
          },
          {
            name: this.language === 'en' ? 'MAJOR' : 'متوسط',
            textStyle: {
              height: 20,
              color: '#000000',
              backgroundColor: '#FF9900',
              borderRadius: [10, 10, 10, 10],
              padding: [0, 8, 0, 8],
            },
          },
          {
            name: this.language === 'en' ? 'MINOR' : 'منخفض',
            textStyle: {
              height: 20,
              color: '#000000',
              backgroundColor: '#FFF84D',
              borderRadius: [10, 10, 10, 10],
              padding: [0, 8, 0, 8],
            },
          },
        ],
      },
      series: [
        {
          name: this.language === 'en' ? 'CRITICAL' : 'حساس',
          type: 'line',
          // stack: 'Total',
          color: '#E71D36',
          smooth: true,
          showSymbol: false,
          itemStyle: {borderColor: 'red'},
          lineStyle: {width: 3.5},
          data: criticalCount,
        },
        {
          name: this.language === 'en' ? 'MAJOR' : 'متوسط',
          type: 'line',
          // stack: 'Total',
          color: '#FF9900',
          smooth: true,
          showSymbol: false,
          data: majorCount,
        },
        {
          name: this.language === 'en' ? 'MINOR' : 'منخفض',
          type: 'line',
          // stack: 'Total',
          color: '#FFF84D',
          smooth: true,
          showSymbol: false,
          data: minorCount,
        },
      ],
    };

    if (this.showStackedLine) {
      this.initLineChart();
    }
  }

  initLineChart():void {
    const lineChartDom = this.lineChartDom?.nativeElement || {};
    const lineChart = echarts.init(lineChartDom);
    lineChart.setOption(this.lineOptions);
  }
  /* custom function   -----end */
}
