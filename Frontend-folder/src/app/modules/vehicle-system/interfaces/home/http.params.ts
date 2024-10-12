import { SiteTreeNode } from '../../components/site-selector/interfaces/http.response';

export interface TrafficParams {
  sites: Array<SiteTreeNode>,
  startDateTime: string | number,
  endDateTime: string | number
}

export interface DateParams {
  startDateTime: string | number,
  endDateTime: string | number
}

export interface LiveTrafficParams {
  sites: Array<SiteTreeNode>;
  hour?: number;
  startDateTime: string | number;
  endDateTime: string | number;
}
