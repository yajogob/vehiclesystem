import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { AuthService } from '../../utils/auth.service';
import { SiteTreeNode, SiteTreeRes } from './interfaces/http.response';
import { SiteHttpRequest } from './service/request.service';

@Injectable()
export class SiteSelectorBehaviorSubject {
  siteTree$: BehaviorSubject<SiteTreeNode[]> = new BehaviorSubject<SiteTreeNode[]>([]);

  originalSiteTree: SiteTreeNode[] = [];

  constructor(
    private siteHttpRequest: SiteHttpRequest,
  ) { }

  setOriginalSiteTree(clearTimeout?:boolean): void {
    const userInfo = AuthService.getUserInfo();
    const access_token = userInfo.access_token || userInfo.refresh_token;
    if (access_token) {
      const response = this.siteHttpRequest.queryAllLocationsApi();
      response.pipe(
        tap({
          error: () => {
            this.originalSiteTree = [];
          },
        }),
        finalize(() => {
          this.siteTree$.next(this.originalSiteTree);
        }),
      ).subscribe((data: SiteTreeRes) => {
        if (data.status === 200) {
          const originalSiteTree = data.result.children;
          this.formatOriginalSiteTree(originalSiteTree);
          this.originalSiteTree = data.result.children;
        } else {
          this.originalSiteTree = [];
        }
      });
    } else {
      if (!clearTimeout) {
        setTimeout(() => {
          this.setOriginalSiteTree(clearTimeout);
        }, 500);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private isHasChildren(data: SiteTreeNode): boolean {
    return !!(data.children && data.children.length);
  }

  formatOriginalSiteTree(children:SiteTreeNode[]): void {
    children.forEach(item => {
      if (item?.childrenCameraList && item.areaType !== 3) {
        item.children = item?.childrenCameraList || [];
      }
      if (item.cameraCode) {
        item.areaType = 3;
        item.codeDesc = item.cameraName;
      }
      delete item.childrenCameraList;
      if (this.isHasChildren(item)) {
        this.formatOriginalSiteTree(item.children);
      }
    });
  }
}
