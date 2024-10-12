/**
 * @file This file defines the Polyline class for displaying polylines on a Gomap map.
 * @author Nikhil
 */

import { Coordinates } from '@interface/coordinates';
import { Gomap, Marker } from '@interface/gomap';
import { Observable, Subject, Subscription, map, takeUntil, timer } from 'rxjs';
import { PolylineOptions } from './polyline-options';

/**
 * @class Polyline
 * @description Represents a polyline on a map.
 */
export class Polyline {
  /* The instance of the main polyline on the map. */
  private _instance: typeof Gomap.maps.Polyline;
  // array to hold all marker instances
  private _markerInstances: typeof Gomap.maps.Marker[] = [];
  /* The instance of the tracker polyline used for animation. */
  private _trackerPolyline: typeof Gomap.maps.Polyline;
  /* Subscription object for managing the tracking timer. */
  private _timer$?: Subscription;
  /* Subject that emits a stop signal to control tracking. */
  private _stopSignal$ = new Subject<void>();
  /* Subject that emits a stop signal to control tracking. */
  private _onMarkerClick$ = new Subject<Marker>();

  /* Represents the state of the Polyline instance. */
  private _state = {
    currentMarkerIndex: 0,
    totalMarkers: 0,
    isTracking: false,
  };

  /**
   * @constructor
   * @param map - Gomap map instance
   * @param markers - Array of marker objects
   * @param lineOptions - Polyline style options
   * @param trackOptions - Tracker polyline style options
   */
  constructor(
    private _map: typeof Gomap.maps.Map,
    private _markers: Marker[],
    private _lineOptions: PolylineOptions,
    private _trackOptions: PolylineOptions,
  ) {
    this._initializeMarkers();
    this._initializePolyline();
  }

  /**
   * @method isTracking
   * @description Returns true if the tracking animation is playing, false otherwise
   */
  get isTracking(): boolean {
    return this._state.isTracking;
  }

  /**
   * @method showPolyline
   * @description Displays the polyline on the map
   */
  showPolyline(): void {
    this._instance.show();
    this._trackerPolyline.show();
  }

  /**
   * @method removePolyline
   * @description Removes the polyline from the map
   */
  removePolyline(): void {
    this._instance && this._instance.remove();
    this._trackerPolyline && this._trackerPolyline.remove();
    this.clearMarkers();
  }


  /**
   * Removes all markers from the current map.
   */
  clearMarkers(): void {
    this._markerInstances.forEach(marker => {
      if (marker) {
        marker.remove && marker.remove();
        marker.setMap && marker.setMap(null);
      }
    });
    this._markerInstances = [];
  }

  /**
   * @method addLatLng
   * @description Adds a new line segment to the polyline
   * @param fromLatLng - Start point of the line segment
   * @param toLatLng - End point of the line segment
   */
  addLatLng(fromLatLng: Coordinates, toLatLng: Coordinates): void {
    this._instance.addLatLng(fromLatLng, toLatLng);
  }

  /**
   * @method startTracking
   * @description Plays the tracking animation
   */
  startTracking(): void {
    this._state.isTracking = true;
    this._timer$ = timer(0, 500)
      .pipe(
        takeUntil(this._stopSignal$),
        map(() => {
          if (this._state.currentMarkerIndex < this._state.totalMarkers) {
            this._trackerPolyline.addLatLng(
              this._markers[this._state.currentMarkerIndex].coordinates,
              this._markers[this._state.currentMarkerIndex + 1].coordinates,
            );
            return ++this._state.currentMarkerIndex;
          } else {
            this.stopTracking();
            return this._state.currentMarkerIndex;
          }
        }),
      )
      .subscribe();
  }

  /**
   * @method reverseTracking
   * @description Plays the tracking animation in reverse
   */
  reverseTracking(): void {
    this._timer$ = timer(0, 500)
      .pipe(
        takeUntil(this._stopSignal$),
        map(() => {
          if (this._state.currentMarkerIndex > 0) {
            return --this._state.currentMarkerIndex;
          } else {
            this.stopTracking();
            return this._state.currentMarkerIndex;
          }
        }),
      )
      .subscribe();
  }

  /**
   * @todo update this method when required
   * @method moveToNextMarker
   * @description Moves to the next marker and plays the tracking animation
   */
  moveToNextMarker(): void {
    this.stopTracking();
    this.startTracking();
  }

  /**
   * @todo update this method when required
   * @method moveToPreviousMarker
   * @description Moves to the previous marker and plays the tracking animation in reverse
   */
  moveToPreviousMarker(): void {
    this.stopTracking();
    this.reverseTracking();
  }

  /**
   * @method stopTracking
   * @description Pauses the tracking animation
   */
  stopTracking(): void {
    this._stopSignal$.next();
    this._state.isTracking = false;
  }

  /**
   * @method resetTracking
   * @description Resets the tracking animation to the start
   */
  resetTracking(): void {
    this._state.currentMarkerIndex = 0;
    this._trackerPolyline.remove();
    this._state.isTracking = false;

    this._trackerPolyline = new Gomap.maps.Polyline(this._map, {
      path: [this._markers[0].coordinates, this._markers[0].coordinates],
      ...this._trackOptions,
    });
    this._trackerPolyline.show();

    if (this._timer$) {
      this._timer$.unsubscribe();
    }
  }

  /**
   * @method restartTracking
   * @description Restarts the tracking animation
   */
  restartTracking(): void {
    this.resetTracking();
    this.startTracking();
  }

  /**
   * @method cleanup
   * @description Cleans up resources when no longer needed
   */
  cleanup(): void {
    this.resetTracking();
  }

  /**
   * @method onMarkerClick
   * @description This method returns an Observable that emits a `Marker` object whenever a marker is clicked on the map.
   * @return {Observable<Marker>} An Observable that emits the clicked marker.
   */
  onMarkerClick(): Observable<Marker> {
    return this._onMarkerClick$.asObservable();
  }

  /**
   * @method _initializeMarkers
   * @description Creates and displays markers on the map
   */
  private _initializeMarkers(): void {
    this._markers.forEach(marker => {
      if (marker.content) {
        const markerInstance = new Gomap.maps.Marker({
          position: marker.coordinates,
          element: marker.content,
          map: this._map,
        });

        markerInstance.on('click', () => {
          this._onMarkerClick$.next(marker);
        });

        this._markerInstances.push(markerInstance);
      }
    });
  }

  /**
   * @method _initializePolyline
   * @description Creates and displays polylines on the map
   */
  private _initializePolyline(): void {
    this._state.totalMarkers = this._markers.length - 1;
    this._instance = new Gomap.maps.Polyline(this._map, {
      path: this._markers.map(({ coordinates }) => coordinates),
      ...this._lineOptions,
    });

    this._trackerPolyline = new Gomap.maps.Polyline(this._map, {
      path: [this._markers[0].coordinates, this._markers[0].coordinates],
      ...this._trackOptions,
    });

    this.showPolyline();
  }
}
