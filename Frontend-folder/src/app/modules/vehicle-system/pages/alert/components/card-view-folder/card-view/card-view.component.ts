import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { PaginationComponent } from 'src/app/modules/vehicle-system/components/pagination-grid';
import { CardViewTable } from 'src/app/modules/vehicle-system/interfaces/alert/http.response';
import { CodeItemsApi, CodesArrayItem } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';

@Component({
  selector: 'vs-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss'],
})
export class CardViewComponent implements OnInit, OnDestroy {
  @Input() tableRowData!: Array<CardViewTable>;
  @Input() tableId = '';
  @Input() paginationComponent!: PaginationComponent;
  @Output() checkCardItemEmit = new EventEmitter<CardViewTable>();

  public language = 'en';
  private allcodeItem!: Array<CodeItemsApi>;
  private makeList!: Array<CodesArrayItem>;
  private codeItemSub$!: Subscription;

  constructor(
    private codeItemService: CodeItemService,
    private translocoService: TranslocoService,
  ){
    this.language = this.translocoService.getActiveLang();
  }

  ngOnInit(): void {
    this.initSelectItemData();
  }

  ngOnDestroy(): void {
    this.codeItemSub$ && this.codeItemSub$.unsubscribe();
  }

  plateNumberFn = (item: CardViewTable): string => {
    const plateList = [];
    if (item.regionShort || item.region) {
      plateList.push(item.regionShort || item.region);
    }
    if (item.category) {
      plateList.push(item.category);
    }
    if (item.plateNumber || item.plateNo) {
      plateList.push(item.plateNumber || item.plateNo);
    }

    if (plateList.length) {
      return plateList.join(' ');
    } else {
      return '----';
    }
  };

  getMakeModelKey(make?: string, model?: string): string {
    if (['behavioralTable', 'geofenceTable', 'noNumberPlateTable'].includes(this.tableId)) {
      return `${make} ${model}`;
    }
    if(make) {
      const makeObj = this.makeList.find(item => item.codeItemValue === make);
      const makeKey = this.getItemName(makeObj || new CodesArrayItem());
      const m = `LprVehicleBrandType_${make}`;
      const curM = this.allcodeItem.find(item => item.codeType === m)?.codesArray || [];
      const modelObj = curM.find(item => item.codeItemValue === model);
      const modelKey = this.getItemName(modelObj || new CodesArrayItem());
      return (makeKey || make) + ' ' + (modelKey || model);
    }
    return '';
  }

  private initSelectItemData():void {
    this.codeItemSub$ = this.codeItemService.subject$.subscribe(({eventType, data}) => {
      if (eventType === 'update-codeItems') {
        this.allcodeItem = data;
        data.forEach(item => {
          switch(item.codeType) {
            case 'LprVehicleBrandType':
              this.makeList = item.codesArray;
              break;
          }
        });
      }
    });
  }

  private getItemName(data: CodesArrayItem):string {
    if (this.language === 'en') {
      return data.englishItemName || '';
    } else if (this.language === 'ar') {
      return data.arabItemName || '';
    }
    return '';
  }

  checkCardItem(item:CardViewTable): void {
    this.checkCardItemEmit.emit(item);
  }
}
