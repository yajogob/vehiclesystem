import { CameraListComponent } from './camera-list/camera-list.component';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { SiteHttpRequest } from './service/request.service';
import { SiteListComponent } from './site-list/site-list.component';
import { SiteSelectorBehaviorSubject } from './site-selector.BehaviorSubject';
import { SiteSelectorComponent } from './site-selector.component';
import { SiteTreeComponent } from './site-tree/site-tree.component';

export const SiteTreeDeclarations = [
  SiteSelectorComponent,
  CustomCheckboxComponent,
  SiteTreeComponent,
  CameraListComponent,
  SiteListComponent,
];

export const SiteTreeProviders = [
  SiteHttpRequest,
  SiteSelectorBehaviorSubject,
];
