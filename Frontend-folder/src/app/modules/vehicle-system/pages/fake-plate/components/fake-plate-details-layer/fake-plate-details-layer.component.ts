import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LayerInfoResponse } from '../../../../interfaces/fake-plate/fake-plate';
import { LoggerService } from '../../../../utils/logger.service';

@Component({
  selector: 'vs-fake-plate-details-layer',
  templateUrl: './fake-plate-details-layer.component.html',
  styleUrls: [ './fake-plate-details-layer.component.scss' ],
})
export class FakePlateDetailsLayerComponent {

  @Input() layerInfo!: LayerInfoResponse;
  @Output() closeDrawerEmit = new EventEmitter<boolean>();
  @Output() checkFakePlateEmit: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private logger: LoggerService,
  ) {
  }

  checkFakePlate(event: string): void {
    this.checkFakePlateEmit.emit(event);
  }

  closeDrawer(): void {
    this.closeDrawerEmit.emit(false);
  }

  verify(): void {
    // TODO: verify
    this.logger.info('verify', this);
  }

  fakePlate(): void {
    // TODO: fakePlate
    this.logger.info('fakePlate', this);
  }

  /* formatTime = (date: Dayjs): string => {
    return date?.format('YYYY-MM-DD HH:mm:ss')
  }*/
}
