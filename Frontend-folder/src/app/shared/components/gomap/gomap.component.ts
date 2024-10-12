import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { DEFAULT_HEATMAP_GRADIENTS, DEFAULT_MAP_OPTION, DEFAULT_POLYLINE, DEFAULT_POLYLINE_TRACKER } from '@config';

import { Coordinates } from '@interface/coordinates';
import { GomapCluster, MapMode, Marker, ZoomChange } from '@interface/gomap';
import { Polyline, PolylineOptions } from '@models/gomap';

import { GomapService } from '@shared/services/gomap.service';
import { generateUniqueId } from '@utils/generate-unique-id';


/**
 * GomapComponent is a wrapper component for interacting with the gomap API.
 * It abstracts map creation, zooming, mode changing, and marker/cluster/heatmap management.
 */
@Component({
  selector: 'vb-gomap',
  templateUrl: './gomap.component.html',
  styleUrls: ['./gomap.component.scss'],
})
export class GomapComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** An array of markers to be placed on the map. */
  @Input() markers: Marker[] = [];
  /** Initial zoom level of the map. */
  @Input() zoom: number = DEFAULT_MAP_OPTION.zoom;
  /** Initial view mode of the map. */
  @Input() mode: MapMode = '2D';
  /** Initial center coordinates of the map. */
  @Input() center: Coordinates = DEFAULT_MAP_OPTION.center;
  /** Marker clusters for the map. */
  @Input() cluster: GomapCluster[] = [];
  /** Heatmap data for the map. */
  @Input() heatmap: Marker[] = [];
  /** Gradients for the heatmap. */
  @Input() heatmapGradients: string[] = DEFAULT_HEATMAP_GRADIENTS;
  /** Trackers for the map. */
  @Input() trackers: Marker[] = [];
  /** Options for the trackers. */
  @Input() trackerOptions: { line: PolylineOptions, tracker: PolylineOptions } = {
    line: DEFAULT_POLYLINE,
    tracker: DEFAULT_POLYLINE_TRACKER,
  };

  /** EventEmitter to emit when the map center changes. */
  @Output() mapCenterChanged: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();
  /** EventEmitter to emit when a marker is clicked. */
  @Output() handleMarkerClick: EventEmitter<Marker> = new EventEmitter<Marker>();
  /** EventEmitter to emit when a marker is clicked. */
  @Output() handleClusterMarkerClick: EventEmitter<Marker[]> = new EventEmitter<Marker[]>();
  @Output() hanlderZoomchangeScroll: EventEmitter<ZoomChange> = new EventEmitter<ZoomChange>();

  /** ElementRef of the HTML element to create the map in. */
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;

  /** A unique id for each map instance. */
  mapElementId = generateUniqueId();
  /** Polyline object for tracking. */
  polyline?: Polyline;

  private _isMapInitialized = false;
  private _destroyer$ = new Subject<void>();


  /**
   * @description Initializes a new instance of the GomapComponent.
   * @param {GomapService} gomapService - Service responsible for map-related operations.
   */
  constructor(private gomapService: GomapService) {
    this._setupMarkerClickSubscription();
    this._setupClusterMarkerClickSubscription();
  }

  ngAfterViewInit(): void {
    this.initGoMap();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (!this._isMapInitialized) return;

    for (const propName in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, propName)) {
        switch (propName) {
          case 'markers':
            this._handleMarkersChange();
            break;

          case 'cluster':
            this._handleClusterChange();
            break;

          case 'trackers':
            this._handleTrackerChange();
            break;

          case 'heatmap':
          case 'heatmapGradients':
            this._handleHeatmapChange();
            break;

          case 'zoom':
            this.gomapService.setZoom(this.zoom);
            break;

          case 'mode':
            this.gomapService.changeMode(this.mode);
            break;

          case 'center':
            this.gomapService.setCenter(this.center);
            break;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this._destroyer$.next();
    this._destroyer$.complete();

    this.polyline?.removePolyline();
    this.gomapService.destroyMap();
  }

  removeMapChildDom(): void {
    if (this.mapElement.nativeElement) {
      this.mapElement.nativeElement.innerHTML = '';
    }
  }

  setIsMapInitialized(): void {
    this._isMapInitialized = false;
  }

  initGoMap(): void {
    this.gomapService.clearMarkers();
    this.gomapService.clearCluster();
    this.gomapService.clearHeatmap();
    if (this.polyline) {
      this.polyline.stopTracking();
      this.polyline.removePolyline();
      this.polyline = undefined;
    }

    this.gomapService.createMap(this.mapElement.nativeElement, this.zoom, this.center, DEFAULT_MAP_OPTION.tilt)
      .then(() => {
        this._handleMarkersChange();
        this._handleClusterChange();
        this._handleHeatmapChange();
        this._handleTrackerChange();

        this._isMapInitialized = true;
        this.hanlderZoomchange();
      });
  }

  setCenterByZoom(latLng: Coordinates, zoom:number): void {
    this.gomapService.setCenter(latLng);
    this.gomapService.setZoom(zoom);
  }

  hanlderZoomchange(): void {
    const callback = (data:ZoomChange): void => {
      this.hanlderZoomchangeScroll.emit(data);
    };
    this.gomapService.hanlderZoomchange(callback);
  }

  getMaxZoom(): number {
    return this.gomapService.getMaxZoom();
  }


  /** @private @description Handle markers updates on the map. */
  private _handleMarkersChange(): void {
    this.gomapService.clearMarkers();

    if (this.markers.length) {
      this.gomapService.addMarkers(this.markers);
    }
  }

  /** @private @description Handle clusters updates on the map. */
  private _handleClusterChange(): void {
    this.gomapService.clearCluster();

    if (this.cluster.length) {
      this.gomapService.updateCluster(this.cluster);
    }
  }

  /** @private @description Handle heatmap updates on the map. */
  private _handleHeatmapChange(): void {
    this.gomapService.clearHeatmap();

    if (this.heatmap.length) {
      this.gomapService.showHeatmap(this.heatmap, this.heatmapGradients);
    }
  }

  /** @private @description Handle tracker updates on the map. */
  private _handleTrackerChange(): void {
    if (this.polyline) {
      this.polyline.stopTracking && this.polyline.stopTracking();
      this.polyline.removePolyline && this.polyline.removePolyline();
      this.polyline = undefined;
    }

    this.gomapService.clearMarkers();
    if (this.trackers.length) {
      if (this.trackers.length > 1) {
        this.polyline = this.gomapService.createPolyline(this.trackers, this.trackerOptions.line, this.trackerOptions.tracker);
      } else {
        this.gomapService.addMarkers(this.trackers);
      }
    }
  }

  /** @private @description Setup marker click subscription to handle marker click events. */
  private _setupMarkerClickSubscription(): void {
    this.gomapService.onMarkerClick()
      .pipe(takeUntil(this._destroyer$))
      .subscribe({
        next: marker => {
          this.handleMarkerClick.emit(marker);
        },
      });
  }

  /** @private @description Setup marker click subscription to handle cluster marker click events. */
  private _setupClusterMarkerClickSubscription(): void {
    this.gomapService.onClusterMarkerClick()
      .pipe(takeUntil(this._destroyer$))
      .subscribe({
        next: markers => {
          this.handleClusterMarkerClick.emit(markers);
        },
      });
  }
}
