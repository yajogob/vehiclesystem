import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TRAFFICMenuList } from 'src/app/modules/vehicle-system/interfaces/rbac';
import { AllResourceList, PathLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { RentalStorageService } from 'src/app/modules/vehicle-system/services/car-rental/rental-storage.service';
import { RouterService } from 'src/app/modules/vehicle-system/services/router.service';
import { VehicleProfile } from '../../../../interfaces/vehicle-profile/vehicle-profile';
import { RentalConstLibrary } from '../../../rental/libs/rental-const-library';

@Component({
  selector: 'vs-vp-details',
  templateUrl: './vp-details.component.html',
  styleUrls: [ './vp-details.component.scss' ],
})

export class VpDetailsComponent {
  @Input() language ='en' ;
  @Input() vehicleProfileDetails!: VehicleProfile;
  @Input() isShowTimeLine!: boolean;
  @Input() isShowTimeLineSwitch!: boolean;
  @Output() changeTimeLineStateEmit: EventEmitter<null> = new EventEmitter<null>();
  @Output() toTrafficFineEmit: EventEmitter<VehicleProfile> = new EventEmitter<VehicleProfile>();

  allResourceList = AllResourceList;

  constructor(
    private routerService: RouterService,
    private rentalStorageService: RentalStorageService,
  ) {}

  accessHandle = (accessName: string): boolean => {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const accessParams = accessName || '';
    const next = meunListRes.some((item: TRAFFICMenuList) => {
      return item.uriSet.includes(accessParams);
    });
    return next;
  };

  changeTimeLineState(): void {
    this.changeTimeLineStateEmit.emit();
  }

  toTrafficFine(): void {
    this.toTrafficFineEmit.emit(this.vehicleProfileDetails);
  }

  goRentalHistory(data: VehicleProfile): void {
    data.channel = 'vehicle-profile';
    this.rentalStorageService.commonAccess(RentalConstLibrary.currentCarRentalData, data);
    this.routerService.navigate([PathLib.CAR_RENTAL_HISTORY]);
  }
}
