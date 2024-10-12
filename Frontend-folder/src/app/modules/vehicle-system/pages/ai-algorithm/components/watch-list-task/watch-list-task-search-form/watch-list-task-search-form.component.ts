import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { FcMapType, FcType, InWatchListTaskSearch } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodeItemsApi, KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { CodesArrayItem } from '../../../../../interfaces/key-value-type';
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassSearchFormComponent } from '../../base-class/base-class-search-form/base-class-search-form.component';

@Component({
  selector: 'vs-watch-list-task-search-form',
  templateUrl: './watch-list-task-search-form.component.html',
  styleUrls: ['./watch-list-task-search-form.component.scss'],
})
export class WatchListTaskSearchFormComponent extends BaseClassSearchFormComponent implements OnInit {
  @Input() accessName = '';
  @Output() searchClickEmit: EventEmitter<InWatchListTaskSearch> = new EventEmitter<InWatchListTaskSearch>();

  language!: string;
  codeDictList!: Array<CodeItemsApi>; // Code dictionary list
  regionList: Array<KeyValueType> = [];
  currentRegion = 'all';
  categoryListMap: {[key:string]: KeyValueType[]} = {}; // Plate category
  plateColorList: Array<KeyValueType> = [];
  regionValue!: string;
  categoryValue!: string | null;
  plateColorValue: string[] = [];
  plateNumber!: string;

  private codeItemFuncMap: FcMapType = {
    'LprRegion': this.lprRegionFunc.bind(this),
    'LprCategory': this.lprAllRegionFunc.bind(this),
    'LprPlateColor': this.lprPlateColorFunc.bind(this),
  };

  constructor(
    private codeItemService: CodeItemService,
    protected override translocoService: TranslocoService,
    protected override aiAlgorithmService: AiAlgorithmService,
    protected override logger: LoggerService,
  ) {
    super(
      translocoService,
      aiAlgorithmService,
      logger,
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.language = this.translocoService.getActiveLang();
    this.initSelectItemData();
  }

  colorLabel = (item: KeyValueType | unknown): string => {
    const ele = item as KeyValueType;
    return ele['key'] as string;
  };

  override searchClick(): void {
    const params: InWatchListTaskSearch = new InWatchListTaskSearch();
    params.region = this.regionValue || '',
    params.plateCategory = this.categoryValue || '',
    params.plateNumber = this.plateNumber,
    params.plateColor = this.plateColorValue.join(','),
    this.searchClickEmit.emit(params);
  }

  private initSelectItemData(): void {
    this.codeItemSub$ = this.codeItemService.subject$.subscribe(
      {
        next: res => {
          this.codeDictList = res.data;
          this.getCodeItemSuc(res.data);
        },
      },
    );
  }

  private getCodeItemSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      const fn = this.codeItemFuncMap[item.codeType as keyof FcMapType] as FcType | undefined;
      if (fn) fn(item.codesArray);
    });
  }

  regionChange(event: KeyValueType): void {
    this.currentRegion = event ? event['value'] : '';
    const categoryList = this.categoryListMap[this.currentRegion] || [];
    let flag = true;
    for (let i = 0; i < categoryList.length; i++) {
      const element = categoryList[i];
      if (element['value'] === this.categoryValue) {
        flag = false;
        break;
      }
    }
    flag && (this.categoryValue = null);
  }

  clearRegion(): void {
    this.currentRegion = 'all';
    this.categoryValue = null;
  }

  private lprRegionFunc(codesArray: Array<CodesArrayItem>): void {
    this.regionList = this.codesArrayForEach(codesArray);
    this.regionList.forEach(item => {
      for (let i = 0; i < this.codeDictList.length; i++) {
        const codeItems = this.codeDictList[i];
        if (codeItems.codeType === `LprRegion_${item['value']}`) {
          this.categoryListMap[item['value']] = this.codesArrayForEach(codeItems.codesArray);
          break;
        }
      }
    });
  }

  private lprAllRegionFunc(codesArray: Array<CodesArrayItem>): void {
    this.categoryListMap['all'] = this.codesArrayForEach(codesArray);
  }

  private lprPlateColorFunc(codesArray: Array<CodesArrayItem>): void {
    this.plateColorList = this.codesArrayForEach(codesArray);
  }

  private codesArrayForEach(codesArray: Array<CodesArrayItem>): Array<KeyValueType> {
    const list: Array<KeyValueType> = [];
    codesArray.forEach(item => {
      const key = this.activeLangValue === AiConstLibrary.ar ? item.arabItemName : item.englishItemName;
      const kvObj = {key, value: item.codeItemValue};
      list.push(kvObj);
    });
    return list;
  }
}
