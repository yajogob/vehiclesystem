import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslocoModule } from "@ngneat/transloco";
import { AgGridModule } from "ag-grid-angular";
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxPaginationModule } from "ngx-pagination";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { VsAccessControlDirective } from '../directives/access-control.directive';
import { RbacService } from '../services/rbac/rbac.service';
import { AlertCountsComponent } from './alert-counts/alert-counts.component';
import { BehavioralAlertComponent } from './behavioral-alert/behavioral-alert.component';
import { CameraDetailsSideComponent } from './camera-details-side/camera-details-side.component';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { PaginationComponent, PaginationGridComponent } from './pagination-grid';
import { ColumnPanelComponent } from './pagination-grid/column-panel/column-panel.component';
import { NoRowsOverlayComponent } from './pagination-grid/no-rows-overlay/no-rows-overlay.component';
import { PopConfirmComponent } from './pop-confirm/pop-confirm.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ScreenfulComponent } from './screenful/screenful.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { SiteTreeDeclarations, SiteTreeProviders } from './site-selector/site.module';
import { SwitchButtonFormComponent } from './switch-button-form/switch-button-form.component';
import { SwitchButtonRendererComponent } from './switch-button-renderer/switch-button-renderer.component';
import { TableActionsComponent } from './table-actions/table-actions.component';
import { TaskLevelBtnComponent } from './task-level-btn/task-level-btn.component';
import { ToolboxComponent } from './toolbox';
import { VehicleDateInputComponent } from './vehicle-date-input/vehicle-date-input.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

@NgModule({
  declarations: [
    ModalComponentComponent,
    VehicleDateInputComponent,
    PaginationComponent,
    PaginationGridComponent,
    SwitchButtonRendererComponent,
    NoRowsOverlayComponent,
    ColumnPanelComponent,
    SwitchButtonFormComponent,
    ToolboxComponent,
    PopConfirmComponent,
    ProgressBarComponent,
    AlertCountsComponent,
    BehavioralAlertComponent,
    SideMenuComponent,
    TableActionsComponent,
    TaskLevelBtnComponent,
    ScreenfulComponent,
    VideoPlayerComponent,
    VsAccessControlDirective,
    ...SiteTreeDeclarations,
    CameraDetailsSideComponent,
  ],
  exports: [
    ModalComponentComponent,
    VehicleDateInputComponent,
    PaginationComponent,
    NoRowsOverlayComponent,
    NgxDaterangepickerMd,
    NgxPaginationModule,
    SwitchButtonRendererComponent,
    PaginationGridComponent,
    ColumnPanelComponent,
    SwitchButtonFormComponent,
    ToolboxComponent,
    PopConfirmComponent,
    ProgressBarComponent,
    AlertCountsComponent,
    BehavioralAlertComponent,
    SideMenuComponent,
    TableActionsComponent,
    TaskLevelBtnComponent,
    ScreenfulComponent,
    VideoPlayerComponent,
    VsAccessControlDirective,
    ...SiteTreeDeclarations,
    CameraDetailsSideComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule,
    NgxDaterangepickerMd.forRoot(),
    AgGridModule,
    TranslocoModule,
    NgxUiLoaderModule,
  ],
  providers: [
    ...SiteTreeProviders,
    RbacService,
  ],
})
export class VehicleSystemComponentsModule { }
