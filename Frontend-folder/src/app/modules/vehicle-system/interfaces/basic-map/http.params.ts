import { SiteTreeNode } from '../../components/site-selector/interfaces/http.response';

export interface QuerySitesParams {
  sites: Array<SiteTreeNode>
}

export interface AllAlertsSearchParams {
  startDateTime: number | string,
  endDateTime: number | string,
  sites: Array<SiteTreeNode>
}

