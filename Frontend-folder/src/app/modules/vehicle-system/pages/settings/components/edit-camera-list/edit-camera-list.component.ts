import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CameraInfo } from 'src/app/modules/vehicle-system/interfaces/basic-map/http.response';
import { CameraManagementService } from 'src/app/modules/vehicle-system/services/camera-management/camera-management.service';

@Component({
  selector: 'vs-edit-camera-list',
  templateUrl: './edit-camera-list.component.html',
  styleUrls: ['./edit-camera-list.component.scss'],
  animations: [
    trigger('slideTrigger', [
      transition(':enter', [
        style({ transform: 'translateX({{tx}})' }),
        animate('200ms ease-in-out', style({ transform: 'translateX(0)' })),
      ], {params: {tx: '100%'}}),
      transition(':leave', [
        animate('200ms ease-in-out', style({ transform: 'translateX({{tx}})' })),
      ], {params: {tx: '100%'}}),
    ])],
})
export class EditCameraListComponent implements OnInit {
  @Input() showEditModal = false;
  @Input() language = '';
  @Input() editModalDate!: CameraInfo;
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  editCameraForm!: UntypedFormGroup;
  cameraStatusList = [{key: 'online', value: 'online'}, {key: 'offline', value: 'offline'}]; // fake
  deviceTypeList = [{key: 'AI Server', value: 'AI Server'}, {key: 'operation Server', value: 'operation Server'}]; // fake

  get latitude(): FormControl { return this.editCameraForm.get('latitude') as FormControl;}
  get longitude(): FormControl { return this.editCameraForm.get('longitude') as FormControl; }
  get siteCode(): FormControl { return this.editCameraForm.get('siteCode') as FormControl; }
  get cameraStatus(): FormControl { return this.editCameraForm.get('cameraStatus') as FormControl; }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private cameraManagementService: CameraManagementService,
  ){}

  ngOnInit(): void {
    this.initForm();
  }

  // Form initialization
  private initForm(): void {
    this.editCameraForm = this.formBuilder.group({
      cameraName: [this.editModalDate?.cameraName],
      cameraId: [this.editModalDate?.cameraId],
      longitude: [this.editModalDate?.longitude||'', [Validators.required]],
      latitude: [this.editModalDate?.latitude||'', [Validators.required]],
      // siteCode: [this.editModalDate?.site, [Validators.required]],
      cameraStatus: [this.editModalDate?.cameraStatus, [Validators.required]],
      deviceType: [this.editModalDate?.deviceType],
      laneNo: [this.editModalDate?.laneNo],
      laneId: [this.editModalDate?.cameraStatus],
      id: [this.editModalDate?.id],
    });
  }

  close(): void {
    this.closeModalEvent.emit();
  }

  saveClick(): void {
    // Verify and update status
    for (const key in this.editCameraForm.controls) {
      if (this.editCameraForm.controls) {
        this.editCameraForm.controls[key].markAsDirty();
        this.editCameraForm.controls[key].updateValueAndValidity();
      }
    }
    if (this.editCameraForm.valid) {
      this.cameraUpdate();
    }
  }

  private cameraUpdate(): void {
    this.cameraManagementService.cameraUpdate(this.editCameraForm.value).subscribe({
      next: () => {
        this.updateEmit.emit(true);
      },
    });
  }
}
