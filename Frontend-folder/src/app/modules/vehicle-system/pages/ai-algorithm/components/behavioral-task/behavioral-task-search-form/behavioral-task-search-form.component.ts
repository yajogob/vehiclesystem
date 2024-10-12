import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { InBehavioralTaskSearch } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { BaseClassSearchFormComponent } from '../../base-class/base-class-search-form/base-class-search-form.component';

@Component({
  selector: 'vs-behavioral-task-search-form',
  templateUrl: './behavioral-task-search-form.component.html',
  styleUrls: ['./behavioral-task-search-form.component.scss'],
})
export class BehavioralTaskSearchFormComponent extends BaseClassSearchFormComponent implements OnInit {
  @Output() searchClickEmit: EventEmitter<InBehavioralTaskSearch> = new EventEmitter<InBehavioralTaskSearch>();

  regionList: Array<string> = [];
  language!: string;
  taskName!: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
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
    const params: InBehavioralTaskSearch = new InBehavioralTaskSearch();
    params.taskName = this.taskName;
    params.startDateTime = this.selected?.startDate?.valueOf() || '';
    params.endDateTime = this.selected?.endDate?.valueOf() || '';
    this.searchClickEmit.emit(params);
  }
}
