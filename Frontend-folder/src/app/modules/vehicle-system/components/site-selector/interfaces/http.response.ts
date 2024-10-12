
export interface SiteTreeNode {
  arabDesc?: string;
  areaType?: string | number;
  children: Array<SiteTreeNode>;
  childrenCameraList?: Array<SiteTreeNode>;
  code?: string;
  siteCode?: string;
  codeDesc?: string;
  district?: string | null;
  sortIndex?: string | number;
  childrenCount?: number;
  areaPath?: string;
  cameraCode?: string;
  cameraId?: string;
  cameraName?: string;
  cameraSource?: string;
  cameraStatus?: string;
  cameraType?: string;
  _showChildren?: boolean;
  _isChecked?: boolean;
  _indeterminate?: boolean;
  _level?: number;
  _activedCount?: number;
  _parentName?: string;
}

export interface SiteTreeEvent {
  event: string;
  data: {
    flag?: boolean
  };
}

export interface SiteTreeRes {
  status: number;
  result: SiteTreeNode;
}

export interface QueryCamerasByCodeParams {
  siteCode: string;
}

export interface CamerasListRes {
  status: number;
  result: SiteTreeNode[];
}

export interface QuerySitesParams {
  siteName: string;
}
export interface QueryCamerasByNameParams {
  cameraName: string;
}
export interface QueryCamerasBysiteCodes {
  siteCode: string[];
}

export interface SitesListRes {
  status: number;
  result: SiteTreeNode[];
}

export interface CountEmitData {
  count: number;
  type: string;
}

export interface SearchSiteData {
  children: SiteTreeNode[];
  _isChecked?: boolean;
  _indeterminate: boolean;
  _activedCount: number;
}
