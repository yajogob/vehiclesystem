import { ElementRef, Injectable } from '@angular/core';
import { DEFAULT_MAP_OPTION, MAP_THEME } from '@config';
import { Coordinates } from '@interface/coordinates';
import {
  ClusterElementProperties,
  ClusterMarker,
  Gomap,
  GomapCluster,
  MapMode,
  Marker,
  MarkerGroupsByLocation,
  ZoomChange,
} from "@interface/gomap";
import { Polyline, PolylineOptions } from '@models/gomap';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GomapService {
  // instance of the map
  private _mapInstance: typeof Gomap.maps.Map;
  // instance of the marker clusterer
  private _clusters?: Array<typeof Gomap.maps.MarkerClusterer>;
  // array to hold all markers
  private _markers: typeof Gomap.maps.Marker[] = [];
  // instance of the heatmap layer
  private _heatmap: typeof Gomap.maps.HeatmapLayer;
  // Subject that emits marker click events
  private _markerClickEvent$ = new Subject<Marker>();
  // Subject that emits cluster marker click events
  private _clusterMarkerClickEvent$ = new Subject<Marker[]>();

  private getGomapMarker = (marker: Marker): typeof Gomap.maps.Marker => {
    return new Gomap.maps.Marker({
      position: marker.coordinates,
      element: marker.content,
      className: marker.className,
      extData: marker.data,
    });
  };

  /**
   * Initializes a new map instance with provided options or defaults.
   * @param {ElementRef} element - The HTML element where the map will be rendered.
   * @param {number} [zoom=DEFAULT_MAP_OPTION.zoom] - Initial zoom level.
   * @param {typeof Gomap.maps.LatLng} [center=DEFAULT_MAP_OPTION.center] - Initial center coordinates.
   * @param {number} [tilt=DEFAULT_MAP_OPTION.tilt] - Tilt angle of the map view.
   */
  createMap(element: ElementRef, zoom: number, center: Coordinates, tilt: number): Promise<void> {
    const mapOptions = {
      center,
      zoom,
      theme: MAP_THEME,
      effect: MAP_THEME.effect,
      tilt,
    };

    return new Promise(resolve => {
      setTimeout(() => {
        this._mapInstance = new Gomap.maps.Map(element, mapOptions);
        resolve();
      }, 100);
    });

  }


  /**
   * Destroys the current map instance and cleans up resources.
   */
  destroyMap(): void {
    this._mapInstance = null;
  }

  // eslint-disable-next-line
  hanlderZoomchange(callback: Function): void {
    this._mapInstance.addEventListener('zoomchange', (data:ZoomChange) => {
      callback && callback(data);
    });
  }


  /**
   * Provides an Observable to listen for marker click events.
   * @returns {Observable<Marker>} - An observable that emits markers when they are clicked.
   */
  onMarkerClick(): Observable<Marker> {
    return this._markerClickEvent$.asObservable();
  }

  /**
   * Provides an Observable to listen for clusterMarker click events.
   * @returns {Observable<Marker>} - An observable that emits clusterMarkers when they are clicked.
   */
  onClusterMarkerClick(): Observable<Marker[]> {
    return this._clusterMarkerClickEvent$.asObservable();
  }

  /**
   * Adds multiple markers to the map.
   * @param {Marker[]} locations - Array of marker data to place on the map.
   */
  addMarkers(locations: Marker[]): void {
    locations.forEach(location => {
      if (location) {
        const marker = new Gomap.maps.Marker({
          position: location.coordinates,
          element: location.content,
          map: this._mapInstance,
          extData: location.data,
        });
        marker.on('click', () => this._markerClickEvent$.next(location));
        this._markers.push(marker);
      }
    });
  }

  /**
   * Removes all markers from the current map.
   */
  clearMarkers(): void {
    this._markers.forEach(marker => {
      if (marker) {
        marker.remove && marker.remove();
        marker.setMap && marker.setMap(null);
      }
    });
    this._markers = [];
  }

  /**
   * Updates or creates a new marker cluster on the map.
   * @param {GomapCluster[]} clusters - Array of clusters configurations, each containing markers and optional clustering options.
   */
  updateCluster(clusters: GomapCluster[]): void {
    this._clusters = [];

    clusters.forEach(({ locations, clusterOption }) => {
      const markerGroupsByLocation: MarkerGroupsByLocation = {};

      const markers = locations.map(item => {
        const flatMarkers = Array.isArray(item)
          ? item.map(marker => marker)
          : [item];

        flatMarkers.forEach(marker => {
          const { lat, lng } = marker.coordinates;
          const key = `${lng},${lat}`;
          if (markerGroupsByLocation[key]) {
            markerGroupsByLocation[key].push(marker);
          } else {
            markerGroupsByLocation[key] = [marker];
          }
        });

        return flatMarkers.map(m => this.getGomapMarker(m));
      }).flat();

      this._clusters?.push(new Gomap.maps.MarkerClusterer(this._mapInstance, markers, {
        clusterOption: {
          radius: 200,
          ...clusterOption,
          element: (e: ClusterElementProperties): HTMLElement => {
            const { properties: { point_count, clusterData } } = e;
            const parser = new DOMParser();
            const doc = parser.parseFromString(clusterOption?.element(point_count) || '', 'image/svg+xml');
            const el: HTMLElement = doc.documentElement;
            el.addEventListener('click', () => {
              const uniqueCoordinatesList = [...new Set(clusterData.map(m => m.geometry.coordinates.join(',')))];
              const clusterMarkers: Marker[] = uniqueCoordinatesList.map(m => markerGroupsByLocation[m]).flat();
              this._clusterMarkerClickEvent$.next(clusterMarkers);
            });
            return el;
          },
        },
      }));
    });
    this._clusters?.forEach(cluster => cluster.markerLayer.markers.forEach((markerInstance: ClusterMarker) => {
      const marker = { coordinates: markerInstance.lngLat, data: markerInstance.markerOption?.extData };
      markerInstance.onMapClick = (): void => {
        this._markerClickEvent$.next(marker);
      };
    }));
  }

  /**
   * Destroys the existing marker clusterer, if any.
   */
  clearCluster(): void {
    if (this._clusters) {
      this._clusters.forEach(cluster => (cluster && cluster.destroy()));
    }
    this._clusters = undefined;
  }

  /**
   * Renders a heatmap layer on the map based on provided locations.
   * @param {Marker[]} locations - Data points for the heatmap.
   * @param {string[]} gradient - Gradient colors for the heatmap.
   */
  showHeatmap(locations: Marker[], gradient: string[]): void {
    this._heatmap = new Gomap.maps.HeatmapLayer({
      data: locations.map(({ coordinates }) => new Gomap.maps.LatLng(coordinates.lat, coordinates.lng)),
      map: this._mapInstance,
      gradient,
    });
  }

  /**
   * Removes the heatmap layer from the map.
   */
  clearHeatmap(): void {
    if (this._heatmap && this._heatmap.setMap) {
      this._heatmap.setMap(null);
    }
    this._heatmap = null;
  }

  /**
   * Centers the map to the specified coordinates.
   * @param {Coordinates} latLng - Coordinates to center the map.
   * @returns {Promise<void>} - Resolves once the operation is complete.
   */
  async setCenter(latLng: Coordinates, zoom?:number): Promise<void> {
    await this._mapInstance.moveCenter(latLng, zoom || 5);
  }

  /**
   * Toggles between 2D and 3D map modes.
   * @param {MapMode} mode - The map mode to set, either '2D' or '3D'.
   */
  changeMode(mode: MapMode): void {
    const is3DMode = mode === '3D';
    const tiltValue = is3DMode ? DEFAULT_MAP_OPTION.tilt : 0;
    const headingValue = is3DMode ? DEFAULT_MAP_OPTION.heading : 0;
    this._mapInstance.lookAt({ tilt: tiltValue, heading: headingValue });
    this._mapInstance.setMapStyle?.({ viewMode: mode, enabled3D: is3DMode, enable3DModel: is3DMode, enableModelSelect: is3DMode });
  }

  /**
   * Increases the zoom level of the map by 1.
   */
  zoomIn(): void {
    this._mapInstance.setZoom(this._mapInstance.getZoom() + 1);
  }

  /**
   * Decreases the zoom level of the map by 1.
   */
  zoomOut(): void {
    this._mapInstance.setZoom(this._mapInstance.getZoom() - 1);
  }

  /**
   * Sets the zoom level of the map to a specified value.
   * @param {number} zoom - Desired zoom level.
   */
  setZoom(zoom: number): void {
    this._mapInstance.setZoom(zoom);
  }

  getMaxZoom(): number {
    return this._mapInstance.maxZoomLevel;
  }

  /**
   * Creates a polyline on the map using the provided markers and styles.
   *
   * @param {Marker[]} markers - Array of markers which will act as the vertices of the polyline.
   * @param {PolylineOptions} lineOptions - Options to style the main polyline.
   * @param {PolylineOptions} trackerOptions - Options to style the tracking polyline.
   * @returns {Polyline} - Returns an instance of the created Polyline object.
   */
  createPolyline(markers: Marker[], lineOptions: PolylineOptions, trackerOptions: PolylineOptions): Polyline {
    return new Polyline(this._mapInstance, markers, lineOptions, trackerOptions);
  }
}
