import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OutTrafficCheckPlateResult } from 'src/app/modules/vehicle-system/interfaces/fake-plate/fake-plate';
import { KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';

@Component({
  selector: 'vs-fake-plate-no-database',
  templateUrl: './fake-plate-no-database.component.html',
  styleUrls: [ './fake-plate-no-database.component.scss' ],
})
export class FakePlateNoDatabaseComponent implements OnInit {
  @Input() noDataBaseList!: Array<OutTrafficCheckPlateResult>;
  @Input() fakePlateCheckList: Array<KeyValueType> = [];
  @Input() fakePlateCheckMap: KeyValueType = {};

  @Output() handleCheckedEmit = new EventEmitter<OutTrafficCheckPlateResult>();

  activeIndex = -1;

  ngOnInit(): void {
    this;
  }

  handleChecked = (data: OutTrafficCheckPlateResult, index: number): void => {
    this.activeIndex = index;
    this.handleCheckedEmit.emit(data);
  };

  colorHandle = (value: number | string, flag: string): boolean => {
    return value + '' === flag;
  };

  getLangText(value: number | string): string {
    const item: Array<KeyValueType> = this.fakePlateCheckList.filter(item => item['value'] === value + '');
    return item[0]['key'];
  }
}
