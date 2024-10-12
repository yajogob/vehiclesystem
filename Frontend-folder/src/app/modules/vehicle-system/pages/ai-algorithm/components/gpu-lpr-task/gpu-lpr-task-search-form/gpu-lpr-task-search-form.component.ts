import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { InGpuLprTaskSearch } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { BaseClassSearchFormComponent } from '../../base-class/base-class-search-form/base-class-search-form.component';

@Component({
  selector: 'vs-gpu-lpr-task-search-form',
  templateUrl: './gpu-lpr-task-search-form.component.html',
  styleUrls: ['./gpu-lpr-task-search-form.component.scss'],
})
export class GpuLprTaskSearchFormComponent extends BaseClassSearchFormComponent implements OnInit {
  @Output() searchClickEmit: EventEmitter<InGpuLprTaskSearch> = new EventEmitter<InGpuLprTaskSearch>();

  gpuLprTaskForm!: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
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
    this.initForm();
    super.ngOnInit();
  }

  override searchClick(): void {
    this.searchClickEmit.emit(this.gpuLprTaskForm.value);
  }

  // Form initialization
  private initForm(): void {
    this.gpuLprTaskForm = this.formBuilder.group({taskName: ['']});
  }
}
