import { AiAlgorithmService } from '../../services/ai-algorithm/ai-algorithm.service';
import { AiAlgorithmComponent } from './ai-algorithm.component';
import { BaseClassPageComponent } from './components/base-class/base-class-page/base-class-page.component';
import { BehavioralTaskDetailComponent } from "./components/behavioral-task/behavioral-task-detail/behavioral-task-detail.component";
import { BehavioralTaskModalComponent } from './components/behavioral-task/behavioral-task-modal/behavioral-task-modal.component';
import { BehavioralTaskPageComponent } from './components/behavioral-task/behavioral-task-page/behavioral-task-page.component';
import { BehavioralTaskSearchFormComponent } from './components/behavioral-task/behavioral-task-search-form/behavioral-task-search-form.component';
import { GeofenceTaskDetailComponent } from './components/geofence-task/geofence-task-detail/geofence-task-detail.component';
import { GeofenceTaskModalComponent } from './components/geofence-task/geofence-task-modal/geofence-task-modal.component';
import { GeofenceTaskPageComponent } from './components/geofence-task/geofence-task-page/geofence-task-page.component';
import { GeofenceTaskSearchFormComponent } from './components/geofence-task/geofence-task-search-form/geofence-task-search-form.component';
import { GpuLprTaskDetailComponent } from './components/gpu-lpr-task/gpu-lpr-task-detail/gpu-lpr-task-detail.component';
import { GpuLprTaskPageComponent } from './components/gpu-lpr-task/gpu-lpr-task-page/gpu-lpr-task-page.component';
import { GpuLprTaskSearchFormComponent } from './components/gpu-lpr-task/gpu-lpr-task-search-form/gpu-lpr-task-search-form.component';
import { GpuTaskModalComponent } from './components/gpu-lpr-task/gpu-task-modal/gpu-task-modal.component';
import { AiAlgorithmModalComponent } from './components/public-components/ai-algorithm-modal/ai-algorithm-modal.component';
import { AiControllerComponent } from './components/public-components/ai-controller/ai-controller.component';
import { SelectTaskModalComponent } from './components/public-components/select-task-modal/select-task-modal.component';
import { SharedTaskModalComponent } from './components/public-components/shared-task-modal/shared-task-modal.component';
import { WatchListTaskDetailComponent } from './components/watch-list-task/watch-list-task-detail/watch-list-task-detail.component';
import { WatchListTaskPageComponent } from './components/watch-list-task/watch-list-task-page/watch-list-task-page.component';
import { WatchListTaskSearchFormComponent } from './components/watch-list-task/watch-list-task-search-form/watch-list-task-search-form.component';
import { WatchTaskModalComponent } from './components/watch-list-task/watch-task-modal/watch-task-modal.component';
import { WhiteDetailsTableComponent } from './components/white-list-task/white-list-task-details-table/white-list-task-details-table.component';
import { WhiteListTaskDetailsComponent } from './components/white-list-task/white-list-task-details/white-list-task-details.component';
import { WhiteListTaskComponent } from './components/white-list-task/white-list-task-page/white-list-task-page.component';
import { WhiteTaskModalComponent } from './components/white-list-task/white-task-modal/white-task-modal.component';
import { AiAllTaskComponent } from './router-page/ai-all-task/ai-all-task.component';


export const AiAlgorithmDeclarations = [
  AiAlgorithmComponent,
  AiAllTaskComponent,
  BehavioralTaskPageComponent,
  BehavioralTaskSearchFormComponent,
  BehavioralTaskModalComponent,
  BehavioralTaskDetailComponent,
  GeofenceTaskPageComponent,
  GeofenceTaskSearchFormComponent,
  GeofenceTaskDetailComponent,
  GpuLprTaskDetailComponent,
  GpuLprTaskPageComponent,
  GpuLprTaskSearchFormComponent,
  AiAlgorithmModalComponent,
  AiControllerComponent,
  SelectTaskModalComponent,
  WatchListTaskDetailComponent,
  WatchListTaskPageComponent,
  WatchListTaskSearchFormComponent,
  WhiteDetailsTableComponent,
  WhiteListTaskDetailsComponent,
  WhiteListTaskComponent,
  SharedTaskModalComponent,
  WhiteTaskModalComponent,
  GpuTaskModalComponent,
  WatchTaskModalComponent,
  GeofenceTaskModalComponent,
  BaseClassPageComponent,
];

export const AiAlgorithmProviders = [
  AiAlgorithmService,
];
