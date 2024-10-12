import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { PageChangeEvent } from '../../components/pagination-grid';
import { Tool } from '../../components/toolbox';
import { OutAlgorithmsListSearch } from '../../interfaces/ai-algorithm/ai-algorithm';
import { KeyValueType } from '../../interfaces/key-value-type';
import { PathLib } from '../../libs/path-library';
import { AiAlgorithmService } from '../../services/ai-algorithm/ai-algorithm.service';
import { MessageService } from '../../services/common/message.service';
import { RouterService } from '../../services/router.service';
import { I18nService } from '../../utils/i18n.service';
import { AiConstLibrary } from './libs/ai-const-library';

@Component({
  selector: 'vs-ai-algorithm',
  templateUrl: './ai-algorithm.component.html',
  styleUrls: ['./ai-algorithm.component.scss'],
})
export class AiAlgorithmComponent implements OnInit, OnDestroy {
  animationScale = 1;
  pageSize = 14;
  currentPage = 1;
  originAlgorithmList: Array<OutAlgorithmsListSearch> = [];
  aiAlgorithmListLeft: Array<OutAlgorithmsListSearch> = [];
  aiAlgorithmListRight: Array<OutAlgorithmsListSearch> = [];
  allAlgorithmList: Array<OutAlgorithmsListSearch> = [];
  renderAlgorithmList: Array<OutAlgorithmsListSearch> = [];
  currentAlgorithmsData!: OutAlgorithmsListSearch;
  isShowVideo = false;
  isShowAllAlgorithm = false;
  taskModalShow = false;
  searchName = '';
  transText = [
    { key: 'ai', value: '' },
    { key: 'algorithms', value: '' },
  ];

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

  language = '';

  private posObj: KeyValueType = AiConstLibrary.posObj;
  private taskType!: string;
  private selectTranslate$!: Subscription;

  @ViewChild('bgBox') bgBox: ElementRef | undefined;
  @ViewChild('leftSingleBox') leftSingleBox: ElementRef | undefined;

  constructor(
    private aiAlgorithmService: AiAlgorithmService,
    private routerService: RouterService,
    private translocoService: TranslocoService,
    private ele: ElementRef,
    private messageService: MessageService,
    private i18nService: I18nService,
  ) {
    this.language = this.i18nService.getLanguage();
  }

  ngOnInit(): void {
    this.transloco();
    this.getAlgorithmsList();

    window.addEventListener('resize', () => {
      // When the resolution is 1920, the scale is 1
      this.animationScale = window.innerWidth / 1920;
      this.calculateCoordinate();
    });
  }

  setRightShadowHeight(): string {
    const height = this.aiAlgorithmListRight.length * 90 + 40 + 'px';
    return height;
  }

  setRightShadowMarginTop(): string {
    let marginTop = this.aiAlgorithmListRight.length * -45;
    const flag = this.aiAlgorithmListRight.length % 2;
    if (!flag) {
      if (this.aiAlgorithmListRight.length < 3) {
        marginTop += 18;
      } else {
        marginTop -= 30;
      }
    }
    return marginTop + 'px';
  }

  setLeftShadowHeight(): string {
    const height = this.aiAlgorithmListLeft.length * 90 + 40 + 'px';
    return height;
  }

  setLeftShadowMarginTop(): string {
    let marginTop = this.aiAlgorithmListLeft.length * -45;
    const flag = this.aiAlgorithmListLeft.length % 2;
    if (!flag) {
      if (this.aiAlgorithmListLeft.length < 3) {
        marginTop += 18;
      } else {
        marginTop -= 30;
      }
    }
    return marginTop + 'px';
  }

  checkItem(item: OutAlgorithmsListSearch): void {
    if (item.isMore) {
      this.isShowAllAlgorithm = true;
    } else {
      this.isShowVideo = true;
      this.currentAlgorithmsData = item;
    }
  }

  getAlgorithmName(item:OutAlgorithmsListSearch): string {
    if (this.language === 'en') {
      return item.enName || '';
    }
    if (this.language === 'ar') {
      return item.arName || '';
    }
    return '';
  }

  setAllAlgorithmList(): void {
    const filterStr = this.searchName.trim().toLocaleLowerCase();
    this.allAlgorithmList = this.originAlgorithmList.filter(item => {
      let nameStr = '';
      if (this.language === 'en') {
        nameStr = item.enName || '';
      }
      if (this.language === 'ar') {
        nameStr = item.arName || '';
      }
      nameStr = nameStr?.toLocaleLowerCase();
      return nameStr?.includes(filterStr);
    });

    this.renderAlgorithmList = this.allAlgorithmList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }

  onPageChange(event: PageChangeEvent): void {
    this.currentPage = event.pageNumber;
    this.setAllAlgorithmList();
  }

  closeModalEvent(): void {
    this.isShowVideo = false;
  }

  taskClickEmit(type: string): void {
    this.taskType = type;
    this.taskModalShow = true;
  }

  closeTaskModalEmit(): void {
    this.taskModalShow = false;
  }

  selectTask(taskValue: string): void {
    const navigationExtras: NavigationExtras = { queryParams: { taskValue, taskType: this.taskType } };
    this.routerService.navigate([PathLib.TASK_MANAGEMENT], navigationExtras);
  }

  private getAlgorithmsList(): void {
    this.aiAlgorithmService.algorithmsListSearch().subscribe(
      {
        next: res => {
          this.aiAlgorithmListLeft = res.leftData.result;
          this.aiAlgorithmListRight = res.rightData.result;
          this.originAlgorithmList = res.data.result;
          this.setAllAlgorithmList();
          this.calculateCoordinate();
        },
        error: err => {
          err.message && this.messageService.error(err.message);
        },
      },
    );
  }

  private calculateCoordinate(): void {
    const boxClientWidth = this.bgBox?.nativeElement.clientWidth;
    const y0 = boxClientWidth / 2 - 14;
    const r = boxClientWidth / 2;

    this.aiAlgorithmListRight.forEach(item => {
      const domX = (r * Math.cos(Number(item.angle) * Math.PI / 180) as number).toFixed(0);
      const domY = (y0 + r * Math.sin(Number(item.angle) * Math.PI / 180) as number).toFixed(0);
      item['top'] = domY + 'px';
      item['right'] = 'unset';
      item['left'] = Number(domX) + r + 6 + 'px';
    });

    setTimeout(() => {
      const childNodes = this.ele.nativeElement.querySelectorAll('#left');
      childNodes?.forEach((ele: HTMLElement, j: number) => {
        this.aiAlgorithmListLeft.forEach((item, i) => {
          if (j === i) {
            const domX = (r * Math.cos(Number(item.angle) * Math.PI / 180) as number).toFixed(0);
            const domY = (y0 + r * Math.sin(Number(item.angle) * Math.PI / 180) as number).toFixed(0);
            item['top'] = domY + 'px';
            item['right'] = -Number(domX) + r + 6 + 'px';
            item['left'] = 'unset';
          }
        });
      });
    });
  }

  private transloco(): void {
    this.transText.forEach(e => {
      this.selectTranslate$ = this.translocoService.selectTranslate(`vs.aiAlgorithm.${e.key}`).subscribe(value => {
        e.value = value;
      });
    });
  }

  onCallback(tool: Tool): void {
    if (tool.code === 'ALG_TASK') {
      this.taskType = 'task';
      this.taskModalShow = true;
    } else if (tool.code === 'ALG_CREATE_TASK') {
      this.taskType = 'createTask';
      this.taskModalShow = true;
    }
  }

  ngOnDestroy(): void {
    this.selectTranslate$ && this.selectTranslate$.unsubscribe();
  }
}
