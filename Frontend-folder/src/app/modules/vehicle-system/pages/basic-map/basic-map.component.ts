import { Component, OnInit, ViewChild } from '@angular/core';
import { DEFAULT_MAP_OPTION } from '@config';
import { ThemeService } from '@core/services/theme.service';
import { Coordinates } from '@interface/coordinates';
import { GomapCluster, MapMode, Marker, ZoomChange } from '@interface/gomap';
import { GomapComponent } from '@shared/components/gomap/gomap.component';
import { GeofenceAlert, WatchlistAlert } from '../../interfaces/alert/http.response';
import { AlertsData, CameraData, SiteData } from '../../interfaces/basic-map/http.response';
import { CodesArrayItem, KeyValueType } from '../../interfaces/key-value-type';
import { TRAFFICMenuList } from '../../interfaces/rbac';
import { VehicleProfileCountMap, VehicleProfileTimeLineResultValue } from '../../interfaces/vehicle-profile/vehicle-profile';
import { AllResourceList, PathLib } from '../../libs/path-library';
import { MapService } from '../../services/map-event.service';
import { RouterService } from '../../services/router.service';
import { ThemeSubject } from '../../services/theme.service';
import { I18nService } from '../../utils/i18n.service';

@Component({
  selector: 'vs-basic-map',
  templateUrl: './basic-map.component.html',
  styleUrls: ['./basic-map.component.scss'],
})
export class BasicMapComponent implements OnInit {
  @ViewChild('goMap') goMapDom: GomapComponent | undefined;

  language!: string;
  themeType = '';
  allResourceList = AllResourceList;
  center: Coordinates = DEFAULT_MAP_OPTION.center;
  zoom = 12;
  scrollZoom = 12;
  scrollTimer = 0;
  mapMode: MapMode = '3D';
  mapViewType = '';
  siteLocations: Array<SiteData> = [];
  cameraLocations: Array<CameraData> = [];
  alertLocations: Array<AlertsData> = [];
  vehicleProfileTrackers: Array<VehicleProfileTimeLineResultValue> = [];
  vehicleProfileAppearance: VehicleProfileCountMap = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trafficFineLocation: Array<any> = [];
  trafficFineViewType = 'heatMap';
  markers: Array<Marker> = [];
  cluster: Array<GomapCluster> = [];
  heatmap: Array<Marker> = [];
  trackers: Array<Marker> = [];
  pageOnGomap = '/home';
  renderTimer:number[] = [];
  alertFilterType: string | undefined;
  alertFilterTypeMap: KeyValueType = {
    'watchList': 'Watchlist',
    'behavioral': 'Behavioral',
    'geofenceList': 'Geofence',
  };

  currentMouseEnterDom?: HTMLElement;
  currentAlertMarker?: AlertsData;
  styleObj: KeyValueType = {
    'left': '-200px',
    'top': '-200px',
  };

  hotelSvg = `<rect transform="translate(6 6) scale(0.7)" width="40" height="40" rx="12" fill="#752E6E"/>
              <g transform="translate(6 6) scale(0.7)">
                <path d="M27.3186 16.5442H23.1786V11.7114C23.1782 9.66112 21.5175 8.00045 19.4672 8H13.6814C11.6311
                8.00045 9.9704 9.66112 9.96991 11.7114V31H11.6324V11.7114C11.6329 11.1432 11.8606 10.6362 12.2327
                10.2628C12.6062 9.89063 13.1131 9.66292 13.6814 9.66242H19.4672C20.0354 9.66287 20.5424 9.89063 20.9158
                10.2628C21.2879 10.6362 21.5157 11.1432 21.5161 11.7114V31H23.1786V18.2067H27.3186C27.8869 18.2071 28.3939
                18.4349 28.7673 18.807C29.1394 19.1805 29.3671 19.6875 29.3676 20.2557V31H31.0301V20.2557C31.0296
                18.2054 29.3689 16.5447 27.3186 16.5442Z" fill="white"/>
                <path d="M15.4296 13.9116H14.0007V16.3363H15.4296V13.9116Z" fill="white"/>
                <path d="M18.9629 13.9116H17.534V16.3363H18.9629V13.9116Z" fill="white"/>
                <path d="M15.4296 19.4538H14.0007V21.8785H15.4296V19.4538Z" fill="white"/>
                <path d="M18.9629 19.4538H17.534V21.8785H18.9629V19.4538Z" fill="white"/>
                <path d="M15.4296 24.996H14.0007V27.4207H15.4296V24.996Z" fill="white"/>
                <path d="M18.9629 24.996H17.534V27.4207H18.9629V24.996Z" fill="white"/>
                <path d="M26.7566 21.0125H25.3278V23.4372H26.7566V21.0125Z" fill="white"/>
                <path d="M26.7566 26.3238H25.3278V28.7485H26.7566V26.3238Z" fill="white"/>
              </g>`;

  gantrySvg = `<rect transform="translate(6 6) scale(0.7)" width="40" height="40" rx="12" fill="#437570"/>
              <g transform="translate(6 6) scale(0.7)">
                <path d="M31.1559 28.4V16C31.1559 13.7908 29.365 12 27.1559 12H13.0041C10.795 12 9.00414 13.7908 9.00414 16V28.4"
                stroke="white" stroke-width="3"/>
                <rect x="6" y="26.48" width="6.16" height="2.64" fill="white"/>
                <rect x="28" y="26.48" width="6.16" height="2.64" fill="white"/>
                <rect x="14.1324" y="7" width="3.03448" height="2.4" fill="white"/>
                <rect x="18.9876" y="7" width="3.03448" height="2.4" fill="white"/>
                <rect x="24.1462" y="7" width="3.03448" height="2.4" fill="white"/>
              </g>`;

  mallSvg = `<rect transform="translate(6 6) scale(0.7)" width="40" height="40" rx="12" fill="#88603C"/>
            <g transform="translate(6 6) scale(0.7)">
              <path d="M11 27V13.7C10.9999 13.4947 11.0631 13.2944 11.1808 13.1262C11.2985 12.9581 11.4651 12.8302
              11.658 12.76L21.329 9.244C21.4045 9.21651 21.4856 9.20763 21.5653 9.21814C21.645 9.22864 21.721
              9.2582 21.7869 9.30432C21.8527 9.35044 21.9065 9.41176 21.9436 9.48308C21.9807 9.5544 22 9.63361 22
              9.714V14.667L28.316 16.772C28.5152 16.8384 28.6885 16.9657 28.8112 17.1361C28.934 17.3064 29.0001 17.511
              29 17.721V27H31V29H9V27H11ZM13 27H20V11.855L13 14.401V27ZM27 27V18.442L22 16.775V27H27Z" fill="white"/>
            </g>`;

  streetSvg = `<rect transform="translate(6 6) scale(0.7)" width="40" height="40" rx="11" fill="#988645"/>
              <g transform="translate(6 6) scale(0.7)">
                <path d="M7 17.6897H33L31.9679 15H8.15114L7 17.6897Z" fill="white"/>
                <path d="M7.89655 18.5862H32.1034L31.1426 23.9655H8.96831L7.89655 18.5862Z" fill="white"/>
                <rect x="14.939" y="19.9083" width="10.515" height="2.28036" fill="#988645"/>
                <path d="M17.8106 24.7953C17.8106 25.275 17.7161 25.75 17.5325 26.1932C17.349 26.6364 17.0799 27.0391
                16.7407 27.3783C16.4015 27.7175 15.9988 27.9865 15.5557 28.1701C15.1125 28.3537 14.6375 28.4481 14.1578
                28.4481C13.6781 28.4481 13.2031 28.3537 12.7599 28.1701C12.3168 27.9865 11.9141 27.7175 11.5749 27.3783C11.2357
                27.0391 10.9666 26.6364 10.783 26.1932C10.5995 25.75 10.505 25.275 10.505 24.7953L14.1578 24.7953H17.8106Z" fill="white"/>
                <circle cx="15.0446" cy="26.7802" r="0.865692" fill="#988645"/>
                <circle cx="13.7241" cy="26.2069" r="0.448276" fill="#988645"/>
              </g>`;

  constructor(
    private mapService: MapService,
    private routerService: RouterService,
    private themeEvent: ThemeSubject,
    private themeService: ThemeService,
    private i18nService: I18nService,
  ) { }


  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.getActiveLangFn();
    this.themeType = this.themeService.getColorTheme();
    this.themeEvent.subject.subscribe(({eventType, data}) => {
      if (eventType === 'update') {
        this.themeType = data || '';
      }
    });
    // mapService: Other pages interact with events on the map, Start with "set-"
    this.mapService.subject.subscribe(({ eventType, data }) => {
      switch (eventType) {
        case 'map-reset':
          this.resetMap();
          break;
        case 'set-map-zoom':
          this.changeMapZoom(data.type || '');
          break;
        case 'set-map-center':
          this.center = JSON.parse(JSON.stringify(data.center));
          break;
        case 'set-map-mode':
          this.changeMapMode(data.type || '');
          break;
        case 'set-page-on-gomap':
          this.pageOnGomap = data.type || '';
          if (data.center) {
            this.center = data.center;
          } else {
            this.center = DEFAULT_MAP_OPTION.center;
          }
          this.clearAllMap(data.defaultZoom);
          break;
        case 'set-home-map-site-markers':
          if (this.pageOnGomap === '/home') {
            this.siteLocations = data.siteLocations || [];
            this.changeHomeMapMarkers('');
          }
          break;
        case 'set-home-map-camera-markers':
          if (this.pageOnGomap === '/home') {
            this.cameraLocations = data.cameraLocations || [];
            this.changeHomeMapMarkers('');
          }
          break;
        case 'set-home-map-view-type':
          if (this.pageOnGomap === '/home') {
            this.changeHomeMapMarkers(data.type || '');
          }
          break;
        case 'set-alert-map-alert-markers':
          if (this.pageOnGomap === '/alert') {
            this.alertLocations = data.alertLocations || [];
            this.setAlertMapAlertMarkers();
          }
          break;
        case 'set-alert-map-filter-type':
          this.alertFilterType = data.alertType;
          this.setAlertMapAlertMarkers();
          break;
        case 'set-alert-map-geofence-markers':
          data.geofenceList && this.setAlertMapGeofenceMarkers(data.geofenceList);
          break;
        case 'set-alert-map-watchlist-markers':
          data.watchlistList && this.setAlertMapWatchlistMarkers(data.watchlistList);
          break;
        case 'set-trafficFine-map-site-location':
          this.trafficFineLocation = data.trafficFineLocation || [];
          this.setTrafficFineMapSiteRender();
          break;
        case 'set-trafficFine-map-view-type':
          this.trafficFineViewType = data.trafficFineViewType || 'heatMap';
          this.setTrafficFineMapSiteRender();
          break;
        case 'vehicleProfile-map-appearance':
          this.vehicleProfileAppearance = data.vehicleProfileAppearance || {};
          this.setVehicleProfileMapAppearanceMarkers();
          break;
        case 'set-vehicleProfile-map-site-trackers':
          this.vehicleProfileTrackers = data.vehicleProfileTrackers || [];
          this.setVehicleProfileMapSiteTrackers();
          break;
        case 'vehicleProfile-map-start-trackers':
          if (this.pageOnGomap === '/vehicle-profile') {
            this.vehicleProfileMapStartTrackers();
          }
          break;
        case 'vehicleProfile-map-track':
          if (this.pageOnGomap === '/vehicle-profile') {
            this.setVehicleProfileMapSiteTrackers();
          }
          break;
      }
    });
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  getActiveLangFn(): void {
    this.i18nService.getLanguageObservable().subscribe(value => {
      this.language = value;
    });
  }

  getItemName(data: CodesArrayItem, flag?: string): string {
    const language = flag || this.language;
    if (language === 'en') {
      return data.englishItemName;
    } else if (language === 'ar') {
      return data.arabItemName;
    }
    return '';
  }

  accessHandle = (accessName: string): boolean => {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const accessParams = accessName || '';
    const next = meunListRes.some((item: TRAFFICMenuList) => {
      return item.uriSet.includes(accessParams);
    });
    return next;
  };

  changeMapZoom(type: string): void {
    if (type === 'increase') {
      this.scrollZoom < 20 ? this.scrollZoom++ : this.scrollZoom;
    } else if (type === 'decrease') {
      this.scrollZoom > 1 ? this.scrollZoom-- : this.scrollZoom;
    }
    this.zoom = this.scrollZoom;
  }

  changeMapMode(type: string): void {
    if (type === '2D') {
      this.mapMode = '2D';
    } else if (type === '3D') {
      this.mapMode = '3D';
    }
  }

  resetMap(defaultZoom?: number): void {
    this.goMapDom?.setIsMapInitialized();
    this.zoom = defaultZoom || 12;
    this.scrollZoom = defaultZoom || 12;
    this.mapMode = '3D';
    // To ensure that map parameters are modified before executing
    setTimeout(() => {
      this.goMapDom?.initGoMap();
    }, 100);
  }

  clearAllMap(defaultZoom?: number): void {
    this.renderTimer.forEach(timer => {
      clearTimeout(timer);
    });
    this.heatmap = [];
    this.cluster = [];
    this.trackers = [];
    this.markers = [];
    this.resetMap(defaultZoom);
  }

  changeHomeMapMarkers(type: string): void {
    type && (this.mapViewType = type);
    switch (this.mapViewType) {
      case 'sites':
        // this.setHomeMapSiteMarkers();
        this.setHomeMapSiteCluster();
        break;
      case 'sitesHeat':
        this.setHomeMapSiteHeat();
        break;
      case 'camera':
        // this.setHomeMapCameraMarkers();
        this.setHomeMapCameraCluster();
        break;
      case 'cameraHeat':
        this.setHomeMapCameraHeat();
        break;
    }
  }

  setHomeMapSiteMarkers(): void {
    this.heatmap = [];
    this.cluster = [];
    this.trackers = [];
    const timer = window.setTimeout(() => {
      this.markers = this.siteLocations.map(item => {
        const content =
          `<div class="map-site-point type-${item.siteType}">
              <div class="icon"></div>
              <!-- site description -->
              <div class="point-description ${this.language}">
                <p>
                  <span class="label">
                    ${this.language === 'ar' ? 'اسم الموقع' : 'Site Name'}:
                  </span>
                  <span class="value">${item.siteName}</span>
                </p>
                <p>
                  <span class="label">
                    ${this.language === 'ar' ? 'لا. كاميرا إل بي آر' : 'No. of LPR Camera'}:
                  </span>
                  <span class="value">${item.siteCameraNum}</span>
                </p>
              </div>
            </div>`;
        return {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          content,
          data: {
            ...item,
            customMarkerType: 'siteMarker',
          },
        } as Marker;
      });
    }, 200);
    this.renderTimer.push(timer);
  }

  setHomeMapSiteCluster(): void {
    this.heatmap = [];
    this.markers = [];
    this.trackers = [];
    const timer = window.setTimeout(() => {
      const hotelLocations: Array<Marker> = [];
      const gantryLocations: Array<Marker> = [];
      const mallLocations: Array<Marker> = [];
      const streetLocations: Array<Marker> = [];
      this.siteLocations.forEach(item => {
        const content =
          `<div class="map-site-point type-${ item.siteType || 'other' }">
            <div class="icon"></div>
            <!-- site description -->
            <div class="point-description ${ this.language }">
              <p>
                <span class="label">
                  ${ this.language === 'ar' ? 'اسم الموقع' : 'Site Name' }:
                </span>
                <span class="value">${ item.siteName }</span>
              </p>
              <p>
                <span class="label">
                  ${ this.language === 'ar' ? 'لا. كاميرا إل بي آر' : 'No. of LPR Camera' }:
                </span>
                <span class="value">${ item.siteCameraNum }</span>
              </p>
            </div>
          </div>`;
        const markerItem = {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          content,
          data: {
            ...item,
            customMarkerType: 'siteMarker',
          },
        } as Marker;

        switch (item.siteType) {
          case '4':
            hotelLocations.push(markerItem);
            break;
          case '5':
            mallLocations.push(markerItem);
            break;
          case '6':
            gantryLocations.push(markerItem);
            break;
          case '7': case '8':
            streetLocations.push(markerItem);
        }
      });
      this.cluster = [
        {
          locations: hotelLocations,
          clusterOption: {
            element: (count): string => {
              // contentWidth = paddingLeft + iconWidth + marginLeft + numberWidth + marginRight
              const svgContentWidth = 6 + 40 * 0.7 + 6 + count.toString().length * 12 + 6;
              const labelWidth = this.language === 'ar' ? 90 : 86;
              const width = labelWidth < svgContentWidth ? svgContentWidth : labelWidth;
              const svgStr = `
                <svg width="${width}" height="40" viewBox="0 0 ${width} 40" class="map-cluster-style ${this.language}"
                fill="none" xmlns="http://www.w3.org/2000/svg" style="z-index: ${5 + count}">
                  ${this.hotelSvg}
                  <g transform="translate(42 14)">
                    <text fill="white" class="cluster-title">${this.language === 'ar' ? 'الفنادق' : 'Hotels'}</text>
                    <text transform="translate(0, 19)" fill="white" class="cluster-total">${count}</text>
                  </g>
                  <path
                    transform="translate(30 36)" d="M15.1429 14L4.00825 0.500002L26.2775 0.5L15.1429 14Z"
                    fill="${this.themeType === 'dark' ? '#000' : '#5f5c4e'}"/>
                </svg>`;
              return svgStr;
            },
          },
        },
        {
          locations: gantryLocations,
          clusterOption: {
            element: (count): string => {
              // contentWidth = paddingLeft + iconWidth + marginLeft + numberWidth + marginRight
              const svgContentWidth = 6 + 40 * 0.7 + 6 + count.toString().length * 12 + 6;
              const labelWidth = this.language === 'ar' ? 88 : 88;
              const width = labelWidth < svgContentWidth ? svgContentWidth : labelWidth;
              const svgStr = `
                <svg width="${width}" height="40" viewBox="0 0 ${width} 40" class="map-cluster-style ${this.language}"
                fill="none" xmlns="http://www.w3.org/2000/svg" style="z-index: ${5 + count}">
                  ${this.gantrySvg}
                  <g transform="translate(42 14)">
                    <text fill="white" class="cluster-title">${this.language === 'ar' ? 'بوابات' : 'Gantry'}</text>
                    <text transform="translate(0, 19)" fill="white" class="cluster-total">${count}</text>
                  </g>
                  <path
                    transform="translate(30 36)" d="M15.1429 14L4.00825 0.500002L26.2775 0.5L15.1429 14Z"
                    fill="${this.themeType === 'dark' ? '#000' : '#5f5c4e'}"/>
                </svg>`;
              return svgStr;
            },
          },
        },
        {
          locations: mallLocations,
          clusterOption: {
            element: (count): string => {
              // contentWidth = paddingLeft + iconWidth + marginLeft + numberWidth + marginRight
              const svgContentWidth = 6 + 40 * 0.7 + 6 + count.toString().length * 12 + 6;
              const labelWidth = this.language === 'ar' ? 120 : 80;
              const width = labelWidth < svgContentWidth ? svgContentWidth : labelWidth;
              const svgStr = `
                <svg width="${width}" height="40" viewBox="0 0 ${width} 40" class="map-cluster-style ${this.language}"
                fill="none" xmlns="http://www.w3.org/2000/svg" style="z-index: ${5 + count}">
                  ${this.mallSvg}
                  <g transform="translate(42 14)">
                    <text fill="white" class="cluster-title">${this.language === 'ar' ? 'مراكز التسوق' : 'Malls'}</text>
                    <text transform="translate(0, 19)" fill="white" class="cluster-total">${count}</text>
                  </g>
                  <path
                    transform="translate(30 36)" d="M15.1429 14L4.00825 0.500002L26.2775 0.5L15.1429 14Z"
                    fill="${this.themeType === 'dark' ? '#000' : '#5f5c4e'}"/>
                </svg>`;
              return svgStr;
            },
          },
        },
        {
          locations: streetLocations,
          clusterOption: {
            element: (count): string => {
              // contentWidth = paddingLeft + iconWidth + marginLeft + numberWidth + marginRight
              const svgContentWidth = 6 + 40 * 0.7 + 6 + count.toString().length * 12 + 6;
              const labelWidth = this.language === 'ar' ? 102 : 98;
              const width = labelWidth < svgContentWidth ? svgContentWidth : labelWidth;
              const svgStr = `
                <svg width="${width}" height="40" viewBox="0 0 ${width} 40" class="map-cluster-style ${this.language}"
                fill="none" xmlns="http://www.w3.org/2000/svg" style="z-index: ${5 + count}">
                  ${this.streetSvg}
                  <g transform="translate(42 14)">
                    <text fill="white" class="cluster-title">${this.language === 'ar' ? 'الكاميرات' : 'Cameras'}</text>
                    <text transform="translate(0, 19)" fill="white" class="cluster-total">${count}</text>
                  </g>
                  <path
                    transform="translate(30 36)" d="M15.1429 14L4.00825 0.500002L26.2775 0.5L15.1429 14Z"
                    fill="${this.themeType === 'dark' ? '#000' : '#5f5c4e'}"/>
                </svg>`;
              return svgStr;
            },
          },
        },
      ];
    }, 200);
    this.renderTimer.push(timer);
  }

  setHomeMapSiteHeat(): void {
    this.markers = [];
    this.cluster = [];
    this.trackers = [];
    const timer = window.setTimeout(() => {
      this.heatmap = this.siteLocations.map(item => {
        return {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          data: item,
        } as Marker;
      });
    }, 200);
    this.renderTimer.push(timer);
  }

  setHomeMapCameraMarkers(): void {
    this.heatmap = [];
    this.cluster = [];
    this.trackers = [];
    const timer = window.setTimeout(() => {
      this.markers = this.cameraLocations.map(item => {
        const content =
          `<div class="map-camera-point type-${item.cameraType}">
              <div class="icon"></div>
            </div>`;
        return {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          content,
          data: {
            ...item,
            customMarkerType: 'cameraMarker',
          },
        } as Marker;
      });
    }, 200);
    this.renderTimer.push(timer);
  }

  setHomeMapCameraCluster(): void {
    this.heatmap = [];
    this.markers = [];
    this.trackers = [];
    const timer = window.setTimeout(() => {
      const hotelCameras: Array<Marker> = [];
      const streetCameras: Array<Marker> = [];
      const mallCameras: Array<Marker> = [];
      const gantryCameras: Array<Marker> = [];
      this.cameraLocations.forEach(item => {
        const content =
          `<div class="map-camera-point type-${item.cameraType}">
            <div class="icon"></div>
            <!-- site description -->
            <div class="point-description ${ this.language }">
              <p>
                <span class="label">
                  ${ this.language === 'ar' ? 'اسم الكاميرا' : 'Camera Name' }:
                </span>
                <span class="value">${ item.cameraName }</span>
              </p>
              <p>
                <span class="label">
                  ${ this.language === 'ar' ? 'اسم الموقع' : 'Site Name' }:
                </span>
                <span class="value">${ item.siteName }</span>
              </p>
            </div>
          </div>`;
        const markerItem = {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          content,
          data: {
            ...item,
            customMarkerType: 'cameraMarker',
          },
        } as Marker;

        switch (item.cameraType) {
          case '1':
            hotelCameras.push(markerItem);
            break;
          case '2':
            streetCameras.push(markerItem);
            break;
          case '3':
            mallCameras.push(markerItem);
            break;
          case '4':
            gantryCameras.push(markerItem);
            break;
        }
      });
      this.cluster = [
        {
          locations: hotelCameras,
          clusterOption: {
            element: (count): string => {
              // contentWidth = paddingLeft + iconWidth + marginLeft + numberWidth + marginRight
              const width = 6 + 40 * 0.7 + 6 + count.toString().length * 12 + 6;
              const svgStr = `
                <svg width="${width}" height="40" viewBox="0 0 ${width} 40" class="map-cluster-style ${this.language}" fill="none"
                  xmlns="http://www.w3.org/2000/svg" style="z-index: ${5 + count}">
                  ${this.hotelSvg}
                  <g transform="translate(40 7)">
                    <text transform="translate(0, 19)" fill="white" class="cluster-total">${count}</text>
                  </g>
                  <path
                    transform="translate(20 36)" d="M15.1429 14L4.00825 0.500002L26.2775 0.5L15.1429 14Z"
                    fill="${this.themeType === 'dark' ? '#000' : '#5f5c4e'}"/>
                </svg>`;
              return svgStr;
            },
          },
        },
        {
          locations: streetCameras,
          clusterOption: {
            element: (count): string => {
              // contentWidth = paddingLeft + iconWidth + marginLeft + numberWidth + marginRight
              const width = 6 + 40 * 0.7 + 6 + count.toString().length * 12 + 6;
              const svgStr = `
                <svg width="${width}" height="40" viewBox="0 0 ${width} 40" class="map-cluster-style ${this.language}" fill="none"
                xmlns="http://www.w3.org/2000/svg" style="z-index: ${5 + count}">
                  ${this.streetSvg}
                  <g transform="translate(40 7)">
                    <text transform="translate(0, 19)" fill="white" class="cluster-total">${count}</text>
                  </g>
                  <path
                    transform="translate(20 36)" d="M15.1429 14L4.00825 0.500002L26.2775 0.5L15.1429 14Z"
                    fill="${this.themeType === 'dark' ? '#000' : '#5f5c4e'}"/>
                </svg>`;
              return svgStr;
            },
          },
        },
        {
          locations: mallCameras,
          clusterOption: {
            element: (count): string => {
              // contentWidth = paddingLeft + iconWidth + marginLeft + numberWidth + marginRight
              const width = 6 + 40 * 0.7 + 6 + count.toString().length * 12 + 6;
              const svgStr = `
                <svg width="${width}" height="40" viewBox="0 0 ${width} 40" class="map-cluster-style ${this.language}" fill="none"
                xmlns="http://www.w3.org/2000/svg" style="z-index: ${5 + count}">
                  ${this.mallSvg}
                  <g transform="translate(40 7)">
                    <text transform="translate(0, 19)" fill="white" class="cluster-total">${count}</text>
                  </g>
                  <path
                    transform="translate(20 36)" d="M15.1429 14L4.00825 0.500002L26.2775 0.5L15.1429 14Z"
                    fill="${this.themeType === 'dark' ? '#000' : '#5f5c4e'}"/>
                </svg>`;
              return svgStr;
            },
          },
        },
        {
          locations: gantryCameras,
          clusterOption: {
            element: (count): string => {
              // contentWidth = paddingLeft + iconWidth + marginLeft + numberWidth + marginRight
              const width = 6 + 40 * 0.7 + 6 + count.toString().length * 12 + 6;
              const svgStr = `
                <svg width="${width}" height="40" viewBox="0 0 ${width} 40" class="map-cluster-style ${this.language}"
                fill="none" xmlns="http://www.w3.org/2000/svg" style="z-index: ${5 + count}">
                  ${this.gantrySvg}
                  <g transform="translate(40 7)">
                    <text transform="translate(0, 19)" fill="white" class="cluster-total">${count}</text>
                  </g>
                  <path
                    transform="translate(20 36)" d="M15.1429 14L4.00825 0.500002L26.2775 0.5L15.1429 14Z"
                    fill="${this.themeType === 'dark' ? '#000' : '#5f5c4e'}"/>
                </svg>`;
              return svgStr;
            },
          },
        },
      ];
    }, 200);
    this.renderTimer.push(timer);
  }

  setHomeMapCameraHeat(): void {
    this.markers = [];
    this.cluster = [];
    this.trackers = [];
    const timer = window.setTimeout(() => {
      this.heatmap = this.cameraLocations.map(item => {
        return {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          data: item,
        } as Marker;
      });
    }, 200);
    this.renderTimer.push(timer);
  }

  setAlertMapAlertMarkers(): void {
    this.heatmap = [];
    this.trackers = [];
    this.cluster = [];
    const timer = window.setTimeout(() => {
      this.markers = this.alertLocations.map(item => {
        const showWatchList = this.accessHandle(this.allResourceList.WatchListListAlerts);
        const showBehavioral = this.accessHandle(this.allResourceList.BehavioralListAlerts);
        const showGeofence = this.accessHandle(this.allResourceList.GeofenceListAlerts);
        let totalAlert = 0;
        showWatchList && (totalAlert += item.watchListAlert);
        showBehavioral && (totalAlert += item.behavioralAlert);
        showGeofence && (totalAlert += item.geofenceAlert);
        const content =
          `<div class="map-alert-point type-watchlist" style="display: ${totalAlert ? 'flex' : 'none'}">
            <div class="icon"></div>
            <div class="item-label">
              <p> ${this.language === 'ar' ? 'تنبيه' : 'Alert'}</p>
              <p class="number">${totalAlert}</p>
            </div>
            <div class="alert-description ${this.language}">
              <div style="color: #FFD600">
                <p>
                  <span class="label">
                    ${this.language === 'ar' ? 'اسم الموقع' : 'Site Name'}:
                  </span>
                  <span class="value">${item.siteName}</span>
                </p>
                <p>
                  <span class="label">
                    ${this.language === 'ar' ? 'مجموع الانذارات' : 'Total Alert'}:
                  </span>
                  <span class="value">${totalAlert}</span>
                </p>
              </div>

              <div class="three-alert" style="display: ${showWatchList ? 'flex' : 'none'}">
                <div class="icon-w w-h"></div>
                <div class="line"></div>
                <div class="title">
                  <span class="num">${item.watchListAlert}</span>
                  <span>${this.language === 'ar' ? 'قائمة المراقبة تنبيه' : 'Watchlist Alert'}</span>
                </div>
              </div
              >
              <div class="three-alert" style="display: ${showBehavioral ? 'flex' : 'none'}">
                <div class="icon-b w-h"></div>
                <div class="line"></div>
                <div class="title">
                  <span class="num">${item.behavioralAlert}</span>
                  <span>${this.language === 'ar' ? 'سلوك تنبيه' : 'Behavioral Alert'}</span>
                </div>
              </div>

              <div class="three-alert" style="display: ${showGeofence ? 'flex' : 'none'}">
                <div class="icon-g w-h"></div>
                <div class="line"></div>
                <div class="title">
                  <span class="num">${item.geofenceAlert}</span>
                  <span>${this.language === 'ar' ? 'تحذير السياج الجغرافي' : 'Geofence Alert'}</span>
                </div>
              </div>
            </div>
          </div>`;
        return {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          content,
          data: {
            ...item,
            customMarkerType: 'allAlertMarker',
          },
        } as Marker;
      });
    }, 200);
    this.renderTimer.push(timer);
  }

  setAlertMapWatchlistMarkers(list: Array<WatchlistAlert>): void {
    this.heatmap = [];
    this.trackers = [];
    this.cluster = [];
    const timer = window.setTimeout(() => {
      const filterType = this.alertFilterType ? this.alertFilterTypeMap[this.alertFilterType] : '';
      this.markers = list.filter(item => !filterType || item.alertType === filterType).map(item => {
        const content =
          `<div class="map-alert-point type-${item.alertType ? item.alertType.toLocaleLowerCase() : ''}">
            <div class="icon"></div>
          </div>`;
        return {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          content,
          data: {
            ...item,
            customMarkerType: 'watchlistMarker',
          },
        } as Marker;
      });
    }, 200);
    this.renderTimer.push(timer);
  }

  setAlertMapGeofenceMarkers(list: Array<GeofenceAlert>): void {
    this.heatmap = [];
    this.trackers = [];
    this.cluster = [];
    const timer = window.setTimeout(() => {
      const filterType = this.alertFilterType ? this.alertFilterTypeMap[this.alertFilterType] : '';
      this.markers = list.filter(item => !filterType || item.alertType === filterType).map(item => {
        const content =
          `<div class="map-alert-point type-${item.alertType ? item.alertType.toLocaleLowerCase() : ''}">
            <div class="icon"></div>
          </div>`;
        return {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          content,
          data: {
            ...item,
            customMarkerType: 'geofenceMarker',
          },
        } as Marker;
      });
    }, 200);
    this.renderTimer.push(timer);
  }


  setTrafficFineMapSiteRender(): void {
    if (this.trafficFineViewType === 'heatMap') {
      this.trackers = [];
      this.markers = [];
      this.cluster = [];
      const timer = window.setTimeout(() => {
        this.heatmap = this.trafficFineLocation.map(item => {
          const content =
            `<div class="map-camera-point type-99">
              <div class="icon"></div>
            </div>`;
          return {
            coordinates: {
              lat: Number(item.latitude),
              lng: Number(item.longitude),
            },
            content,
            data: item,
          } as Marker;
        });
      }, 200);
      this.renderTimer.push(timer);
      return;
    }

    if (this.trafficFineViewType === 'fine') {
      this.trackers = [];
      this.heatmap = [];
      this.markers = [];
      const timer = window.setTimeout(() => {
        const locations = this.trafficFineLocation.map(item => {
          const content =
            `<div class="map-camera-point type-99">
              <div class="icon"></div>
            </div>`;
          return {
            coordinates: {
              lat: Number(item.latitude),
              lng: Number(item.longitude),
            },
            content,
            data: item,
          } as Marker;
        });
        this.cluster = [
          {
            locations,
            clusterOption: {
              element: (count): string => {
                // contentWidth = paddingLeft + iconWidth + marginLeft + numberWidth + marginRight
                const width = 10 + 40 + 12 + count.toString().length * 12 + 10;
                const svgStr = `
                  <svg width="${width}" height="60" viewBox="0 0 ${width} 60" class="map-cluster-style ${this.language}"
                    fill="none" xmlns="http://www.w3.org/2000/svg" style="z-index: ${5 + count}">
                    <rect transform="translate(10 10)" width="40" height="40" rx="12" fill="#FF8C05"/>
                    <g transform="translate(10 10)">
                      <path d="M8.39657 22.8242L13.17 25.4964L14.7772 24.9782L7.83527 21.0875L8.39657 22.8242Z" fill="white"/>
                      <path d="M30.6663 26.3887V27.305H26.8284L22.1173 22.5939L31.3475 19.6099C31.4543 19.5757 31.5532 19.5206 31.6385
                      19.448C31.7239 19.3753 31.794 19.2864 31.8449 19.1865C31.8957 19.0866 31.9263 18.9777 31.9348 18.8659C31.9433 18.7541
                      31.9296 18.6418 31.8945 18.5353L30.0954 12.9703C30.0251 12.7542 29.872 12.5748 29.6697 12.4714C29.4674 12.368 29.2323
                      12.349 29.016 12.4186L8.11834 19.1878C7.98103 19.2318 7.8571 19.3099 7.75811 19.4147C7.65912 19.5196 7.5883 19.6478
                      7.55225 19.7874L16.0629 24.5849L19.9824 23.3136L26.0128 29.3247H30.6663V29.9532C30.6648 30.3345 30.7976 30.7041 31.0415
                      30.9971C31.2854 31.2902 31.6248 31.4879 32 31.5556V24.796C31.626 24.8625 31.2874 25.0585 31.0435 25.3498C30.7996 25.641
                      30.6661 26.0089 30.6663 26.3887ZM21.8678 16.4676C21.7815 16.2038 21.8678 15.9447 22.0165 15.8919L28.0757 13.9346C28.2436
                      13.8818 28.4451 14.0497 28.5554 14.3088C28.6658 14.5678 28.5554 14.8317 28.4067 14.8845L22.3236 16.8418C22.1748 16.8994
                      21.9542 16.7267 21.8678 16.4676Z" fill="white"/>
                    </g>
                    <g transform="translate(60 12)">
                      <text transform="translate(0, 25)" fill="white" class="cluster-total">${count}</text>
                    </g>
                  </svg>`;
                return svgStr;
              },
            },
          },
        ];
      }, 200);
      this.renderTimer.push(timer);
    }
  }

  setVehicleProfileMapAppearanceMarkers(): void {
    this.cluster = [];
    this.heatmap = [];
    this.trackers = [];
    const cameraTypeBgMap: KeyValueType = {
      '1': '#752E6E',
      '2': '#988645',
      '3': '#88603C',
      '4': '#437570',
      '99': '#ff8c05',
    };
    const timer = window.setTimeout(() => {
      this.markers = Object.values(this.vehicleProfileAppearance).map(item => {
        const cameraType = item.cameraType || '99';
        const content =
          `<div class="map-appearance-marker">
            <div class="corner-icon"></div>
            <div class="appearance-count type-${cameraType}">${item.count}</div>
            <svg class="svg-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="7" viewBox="0 0 13 7" fill="none">
              <path d="M0.000236027 0.363961L12.7282 0.363992L6.36429 6.72795L0.000236027 0.363961Z" fill="${cameraTypeBgMap[cameraType]}"/>
              </svg>
          </div>`;
        return {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          content,
          data: item,
        } as Marker;
      });
    }, 200);
    this.renderTimer.push(timer);
  }

  setVehicleProfileMapSiteTrackers(): void {
    this.cluster = [];
    this.heatmap = [];
    this.markers = [];
    const timer = window.setTimeout(() => {
      if (this.pageOnGomap === '/vehicle-profile') {
        this.goMapDom?.setCenterByZoom(DEFAULT_MAP_OPTION.vehicleProfileCenter, 9);
        this.zoom = 9;
        this.scrollZoom = 9;
      }
      this.trackers = this.vehicleProfileTrackers.map(item => {
        const content =
          `<div class="map-camera-point type-${item.cameraType}">
            <div class="icon"></div>
            <!-- site description -->
            <div class="point-description ${ this.language }">
              <p>
                <span class="label">
                  ${ this.language === 'ar' ? 'اسم الكاميرا' : 'Camera Name' }:
                </span>
                <span class="value">${ item.deviceName }</span>
              </p>
              <p>
                <span class="label">
                  ${ this.language === 'ar' ? 'اسم الموقع' : 'Site Name' }:
                </span>
                <span class="value">${ item.siteName }</span>
              </p>
            </div>
          </div>`;
        return {
          coordinates: {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          },
          content,
        } as Marker;
      });
    }, 200);
    this.renderTimer.push(timer);
  }

  vehicleProfileMapStartTrackers(): void {
    this.goMapDom?.polyline?.restartTracking();
  }

  // gomap markers callback event
  handleMarkerClickFn(marker: Marker): void {
    const customMarkerType = marker.data && (marker.data.customMarkerType || '');
    if (['watchlistMarker', 'geofenceMarker'].includes(customMarkerType)) {
      this.mapService.subject.next({
        eventType: 'set-alert-map-marker-details',
        data: { watchlistDetail: marker.data, alertPosition: this.language === 'ar' ? 'left' : 'right', alertType: marker.data.alertType },
      });
    } else if (['cameraMarker'].includes(customMarkerType)) {
      this.mapService.subject.next({
        eventType: 'set-alert-map-marker-details',
        data: { watchlistDetail: marker.data, alertPosition: this.language === 'ar' ? 'right' : 'left', alertType: marker.data.alertType || '' },
      });
    } else if (customMarkerType === "siteMarker") {
      this.siteJumpToSettingPage([marker]);
    }
  }

  // gomap cluster callback event
  handleClusterMarkerClickFn(markers: Marker[]): void {
    const maxZoom = this.goMapDom?.getMaxZoom() || 20;
    if (this.scrollZoom < maxZoom) return;
    const flag = markers[0].data.customMarkerType;
    if (flag && flag === "cameraMarker") {
      const cameraList = markers.map(item => item.data);
      window.sessionStorage.setItem('map-camera-cluster-to-settings', JSON.stringify(cameraList));
      this.routerService.navigate([PathLib.CAMERA_MAMANGERMENT]);
    } else if (flag === 'siteMarker') {
      this.siteJumpToSettingPage(markers);
    }
  }

  siteJumpToSettingPage(markers: Marker[]): void {
    const siteSelectedList = markers.map(item => {
      const data = item.data;
      return {
        ...data,
        areaType: 2,
        childrenCount: data.siteCameraNum,
        code: data.siteCode,
        codeDesc: data.siteName,
      };
    });
    window.sessionStorage.setItem('map-site-cluster-to-settings', JSON.stringify(siteSelectedList));
    this.routerService.navigate([PathLib.CAMERA_MAMANGERMENT]);
  }

  hanlderZoomchangeScrollFn(data:ZoomChange): void {
    this.scrollZoom = data.zoomLevel;
  }
  /* custom function   -----end */
}
