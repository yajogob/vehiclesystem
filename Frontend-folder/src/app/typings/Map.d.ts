/* eslint-disable */
/* NOTE: this doc just for reference */
export declare enum LineTypes {
  SOLID = "solid"
}

export interface LatLngInterface {
  lat?: any;
  lng?: any;
}
export declare class LatLng implements LatLngInterface {
  constructor(latitude: number | undefined, longitude: number | undefined, altitude?: number);
  get lat(): number | undefined;
  get lng(): number | undefined;
}
export declare class LatLngBounds {
  constructor(sw: LatLng, ne: LatLng);
  contains(latLng: LatLng): boolean;
  equals(latLng: LatLngBounds): boolean;
  get southWest(): LatLng;
  get northEast(): LatLng;
}

export interface DrawRouteParams {
  size?: number;
  color?: string;
  lineType?: LineTypes;
  animationTime?: number;
  animate?: boolean;
  iterationTime?: number;
}
export interface MapEffect {
  toneMappingExposure?: number;
  outline?: {
    enabled: boolean;
    ghostExtrudedPolygons: boolean;
    thickness: number;
    color: string;
  };
  bloom?: {
    enabled: boolean;
    strength: number;
    threshold: number;
    radius: number;
  };
  vignette?: {
    enabled: boolean;
    offset: number;
    darkness: number;
  };
  sepia?: {
    enabled: boolean;
    amount: number;
  };
}
interface modelFontStyle {
  [key: string]: {
    size?: number;
    height?: number;
    color?: string;
    latitude: number;
    longitude: number;
    altitude: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
  };
}
export interface MapOptions {
  /**
   *
   */
  maxZoom?: number;
  /**
   *
   */
  minZoom?: number;
  /**
   *
   */
  tilt?: number;
  /**
   *
   */
  heading?: number;
  /**
   * The instance of {@link MapRenderingManager} managing the rendering of the map. It is a public
   * property to allow access and modification of some parameters of the rendering process at
   * runtime.
   */
  effect?: MapEffect;
  /**
   *
   */
  enable3DModel?: boolean;
  /**
   * 建筑模型选择
   */
  enableModelSelect?: boolean;
  /**
   * 建筑模型字体样式
   */
  modelFontStyle?: modelFontStyle;
  /**
   * 建筑hover
   */
  enableBuildingHover?: boolean;
  buildingHoverThrottle?: number;
  hoverPoiCodes?: string[];
  viewMode?: string;
}
export declare class Map {
  constructor(mapId: string | HTMLElement, options: MapOptions);
  handleMouseDown(e: any): void;
  handleMouseUp(e: any): void;
  handleClick(e: any): void;
  handleMousemove(e: any): void;
  getIntersection(e: any): Array<{
    userData: {
      [key: string]: any;
    };
  }>;
  handlePick(e: any, hover?: boolean): void;
  isPick(eventPosition: {
    x: number;
    y: number;
  }): boolean;
  setCenter(latLng: LatLngInterface): void;
  moveCenter(latLng: LatLngInterface, duration?: number, onFinished?: () => {}): void;

  getCenter(): LatLngInterface;
  setZoom(zoom: number): void;
  enableTilt(enable: boolean): void;
  getZoom(): number;
  fitBounds(bounds: LatLngBounds | undefined): void;
  addListener(eventName: string, func: any): void;
  removeAllListeners(eventName: string): void;
  removeListener(eventName: string, func: any): void;
  /**
   * 设置主题
   * @param theme
   */
  setTheme(theme: any): void;
  /**
   * 销毁
   */
  destroy(): void;
  /**
   * 通过经纬度获取Poi或地址
   * @param lat
   * @param lng
   * @param callback
   */
  getPoi(lat: number, lng: number, callback?: any): Promise<any>;
  /**
   * 通过PoiCode获取经纬度
   * @param poi_code
   * @param callback
   */
  getLocation(poi_code: string, callback?: any): Promise<any>;
  /**
   * 添加3D模型
   * @param params
   * @param callback
   */
  addCollada(params: {
    url: string;
    renderOrder?: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    scale?: number;
    lat: number;
    lng: number;
  }, callback: (scene: any) => void): void;
  drawRoute(start: LatLng, end: LatLng, style?: DrawRouteParams, travelMode?: any, callback?: (ret: any) => void): {
    clear: () => void;
  };
  setLight(hours?: number, minutes?: number): void;
  setMaxTiltAngle(angle: number): void;
  setSatelliteStyle(satellite: boolean): void;
  addSvg(params: {
    path: string;
    lat: number;
    lng: number;
    altitude: number;
    size?: number;
    callback?: () => void;
  }): void;
  setMapStyle(params: {
    satellite?: boolean;
    enabled3D?: boolean;
  }): void;
}
export { };

