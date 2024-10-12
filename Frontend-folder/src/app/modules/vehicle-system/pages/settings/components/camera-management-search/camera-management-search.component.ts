import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteTreeNode } from 'src/app/modules/vehicle-system/components/site-selector/interfaces/http.response';
import { CameraInfo } from 'src/app/modules/vehicle-system/interfaces/basic-map/http.response';
import { CodesArrayItem, KeyValueType, customPositionType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { I18nService } from 'src/app/modules/vehicle-system/utils/i18n.service';
import { InCameraSearch } from '../../../../interfaces/camera-management/camera-management';

@Component({
  selector: 'vs-camera-management-search',
  templateUrl: './camera-management-search.component.html',
  styleUrls: ['./camera-management-search.component.scss'],
})
export class CameraManagementSearchComponent implements OnInit {
  @Input() activeLangValue = 'en';
  @Output() cameraSearchEvent: EventEmitter<InCameraSearch> = new EventEmitter<InCameraSearch>();
  @Output() cameraListUpdate: EventEmitter<CameraInfo[]> = new EventEmitter<CameraInfo[]>();

  searchName = '';
  licenseStatusMaps: Array<CodesArrayItem> = [];
  license = null;
  cameraStatusMaps: Array<CodesArrayItem> = [];
  cameraStatus = null;
  dtVisible = false;
  siteSelectedList: Array<SiteTreeNode> = [];
  bindSitesArr: Array<string> = [];
  language = 'en';
  customPosition!: customPositionType;

  constructor(
    private router: ActivatedRoute,
    private codeItemService: CodeItemService,
    private i18nService: I18nService,
  ) {}

  ngOnInit(): void {
    this.setCustomPosition();
    // Determines whether the incoming camera data from the map page exists
    this.router.queryParams.subscribe(() => {
      const cameraDataStr = window.sessionStorage.getItem('map-camera-cluster-to-settings');
      const cameraList = cameraDataStr && JSON.parse(cameraDataStr);
      const siteDataStr = window.sessionStorage.getItem('map-site-cluster-to-settings');
      const siteList = siteDataStr && JSON.parse(siteDataStr);
      if (cameraList && cameraList.length) {
        this.cameraListUpdate.emit(cameraList);
        // Data can only be used once, So reset the data
        window.sessionStorage.setItem('map-camera-cluster-to-settings', '');
      } else if (siteList && siteList.length) {
        this.siteSelectedList = siteList;
        // Data can only be used once, So reset the data
        window.sessionStorage.setItem('map-site-cluster-to-settings', '');
        this.searchCameraManagementList();
      } else {
        this.searchCameraManagementList();
      }
    });
    this.initSelectItemData();
  }

  private setCustomPosition(): void {
    this.language = this.i18nService.getLanguage();
    if(this.language === 'en') {
      this.customPosition = {
        position: 'fixed',
        bottom: '13.5rem',
        right: '-23rem',
      };
    }
    if(this.language === 'ar') {
      this.customPosition = {
        position: 'fixed',
        bottom: '13.5rem',
        left: '-17rem',
      };
    }
  }

  searchCameraManagementList(): void {
    const params = new InCameraSearch();
    params.cameraName = this.searchName.trim(),
    params.license = this.license || '';
    params.cameraStatus = this.cameraStatus || '';
    params.sites = this.siteSelectedList,
    this.cameraSearchEvent.emit(params);
  }

  showSiteModal(): void {
    this.dtVisible = true;
  }

  chooseCameraChange(event: Array<SiteTreeNode>): void {
    this.siteSelectedList = event;
  }

  selectorConfirmOn(selectedList: SiteTreeNode[]): void {
    this.siteSelectedList = selectedList;
  }

  cameraLabel = (item: KeyValueType | unknown): string => {
    const ele = item as KeyValueType;
    return ele['codeDesc'] as string;
  };

  initSelectItemData():void {
    this.codeItemService.subject$.subscribe(({eventType, data}) => {
      if (eventType === 'update-codeItems') {
        data.forEach(item => {
          switch(item.codeType) {
            case 'NewLicenseStatus':
              this.licenseStatusMaps = item.codesArray;
              break;
            case 'NewCameraStatus':
              this.cameraStatusMaps = item.codesArray;
          }
        });
      }
    });
  }

  getItemName(data: CodesArrayItem, flag?:string):string {
    const language = flag || this.language;
    if (language === 'en') {
      return data.englishItemName;
    } else if (language === 'ar') {
      return data.arabItemName;
    }
    return '';
  }
}
