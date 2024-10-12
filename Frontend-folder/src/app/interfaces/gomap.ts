import { MAP_THEME } from "../config/map-theme.config";
import { Coordinates } from "./coordinates";

/**
 * Represents the available display modes for the map.
 * - '2D': A two-dimensional view of the map.
 * - '3D': A three-dimensional view of the map.
 */
export type MapMode = '2D' | '3D';

/**
 * Represents a marker that can be placed on the map.
 *
 * @property coordinates - The geolocation where the marker is placed.
 * @property content - Optional content that is displayed when the marker is clicked.
 * @property className - Optional CSS class to style the marker.
 * @property data - Any additional data to be associated with the marker.
 */
export interface Marker {
  readonly coordinates: Coordinates;
  content?: string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

/**
 * Represents a marker that can be placed on the map.
 */
export interface MarkerGroupsByLocation {
  [key: string]: Marker[];
}

/**
 * Represents clusterElementProperties
 */
export interface ClusterElementProperties {
  properties: {
    point_count: number;
    clusterData: {
      geometry: {
        coordinates: number[]
      }
    }[]
  }
}

export interface ZoomChange {
  coordinate: Coordinates,
  type: string,
  previousZoomLevel: number,
  zoomLevel: number,
}

/**
 * Configuration options for clustering markers on the map.
 *
 * @property className - Optional CSS class to style the cluster.
 * @property maxZoom - The maximum zoom level at which clustering will occur.
 * @property minZoom - The minimum zoom level at which clustering will be visible.
 * @property radius - The radius in pixels around each point in which clustering will occur.
 */
export interface ClusterOptions {
  className?: string;
  maxZoom?: number;
  minZoom?: number;
  radius?: number;
  element: (val: number) => string;
}

/**
 * Represents a collection of markers and their clustering configuration for display on a map.
 *
 * @property locations - List of individual map markers.
 * @property clusterOption - Configuration settings for how markers should be clustered.
 */
export interface GomapCluster {
  locations: Marker[];
  clusterOption?: ClusterOptions;
}

/**
 * Represents the structure of a marker in the gomap library's cluster.
 *
 * @property onMapClick - A callback triggered when the marker is clicked.
 * @property extData - Additional data associated with the marker.
 * @property lngLat - The coordinates of the marker.
 */
export interface ClusterMarker {
  lngLat: Coordinates,
  markerOption?: {
    extData?: unknown
  },
  onMapClick: () => void;
}

/**
 * Configuration options for displaying the map using the gomap library.
 *
 * @property center - The initial geolocation where the map should be centered.
 * @property tilt - The tilt angle of the camera.
 * @property heading - The heading or direction of the camera.
 * @property zoom - The initial zoom level of the map.
 * @property theme - The visual theme of the map, defined in `MAP_THEME`.
 * @property enable3DModel - Whether to enable 3D models on the map.
 * @property enableModelSelect - Whether users can select 3D models on the map.
 * @property viewMode - The initial view mode (either 2D or 3D).
 * @property effect - Special visual effects applied to the map, derived from `MAP_THEME.effect`.
 */
export interface MapOptions {
  center: Coordinates;
  tilt: number;
  heading: number;
  zoom: number;
  theme: typeof MAP_THEME;
  enable3DModel: boolean;
  enableModelSelect: boolean;
  viewMode: MapMode;
  effect: typeof MAP_THEME.effect;
}

/**
 * The gomap library's main object.
 *
 * Note: Currently, the type of `gomap` is set to `any` because its exact type is not provided.
 * TODO: Replace with a more specific type when available.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const gomap: any;
export const Gomap = gomap;
