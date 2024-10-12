import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { InGeofenceTaskSearch } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { AiAlgorithmService } from '../../../../../services/ai-algorithm/ai-algorithm.service';
import { BaseClassSearchFormComponent } from '../../base-class/base-class-search-form/base-class-search-form.component';

@Component({
  selector: 'vs-geofence-task-search-form',
  templateUrl: './geofence-task-search-form.component.html',
  styleUrls: [ './geofence-task-search-form.component.scss' ],
})
export class GeofenceTaskSearchFormComponent extends BaseClassSearchFormComponent implements OnInit {
  @Output() searchClickEmit: EventEmitter<InGeofenceTaskSearch> = new EventEmitter<InGeofenceTaskSearch>();

  taskName = '';
  language!: string;
  constructor(
    protected override aiAlgorithmService: AiAlgorithmService,
    protected override translocoService: TranslocoService,
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
  }

  override searchClick(): void {
    const params: InGeofenceTaskSearch = new InGeofenceTaskSearch();
    params.taskName = this.taskName.trim();
    params.startDateTime = this.selected?.startDate?.valueOf() || '';
    params.endDateTime = this.selected?.endDate?.valueOf() || '';
    this.searchClickEmit.emit(params);
  }
}
