import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { VehicleProfile } from '../../../../interfaces/vehicle-profile/vehicle-profile';

@Component({
  selector: 'vs-side-vp-list',
  templateUrl: './side-vp-list.component.html',
  styleUrls: [ './side-vp-list.component.scss' ],
})
export class SideVpListComponent implements OnInit {
  @Input() visibleNoData = true;
  @Input() vehicleProfileList!: Array<VehicleProfile>;
  @Input() activeIndex!: number;
  @Output() handleCheckedEmit: EventEmitter<{ data: VehicleProfile, index: number }> = new EventEmitter<{ data: VehicleProfile, index: number }>();

  // activeIndex!: number;  // Active queue number
  thumb!: string;  // thumb image
  language = 'en';

  constructor(
    protected tl: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.language = this.tl.getActiveLang();
    this.thumb = 'assets/vehicle-system/icons/vehicle-profile-icon/tick-circle.png';
  }

  handleChecked = (data: VehicleProfile, index: number): void => {
    const paramsEmit = { index, data };
    this.handleCheckedEmit.emit(paramsEmit);
  };
}
