// export interface CameraEmitType {
//   searchName: string;
//   siteName: string;
// }

import { SiteTreeNode } from "../../components/site-selector/interfaces/http.response";
import { CameraInfo } from "../basic-map/http.response";

export class InCameraSearch {
  sites!: Array<SiteTreeNode>;
  cameraName!: string;
  pageSize!: number;
  pageNo!: number;
  cameraStatus!: string;
  license!: string;
}

export interface sitesArray {
  cameraIds: Array<string>;
  siteCode: string;
}

export class RestfulOutCameraSearch {
  message?: string;
  code!: string;
  status!: number;
  result!: PromiseOutCameraSearch;
}

export class PromiseOutCameraSearch {
  totalPages!: string | number;
  last!: boolean;
  first!: boolean;
  numberOfElements!: number;
  size!: number;
  totalElements!: number;
  number!: number;
  content!: Array<CameraInfo>;
}

export class InCameraDelete {
  id!: string;
}
