import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EnvironmentService } from 'src/app/services/EnvironmentService';
import { MeunMapType, OutLoginParams, TRAFFICMenuList, localMeunListType } from '../../interfaces/rbac';
import { MeunMapClass, PathLib, localMeunClass } from '../../libs/path-library';
import { RbacService } from '../../services/rbac/rbac.service';
import { RouterService } from '../../services/router.service';
import { I18nService } from '../../utils/i18n.service';
import { url2RoutingPath } from '../../utils/tool';

@Component({
  selector: 'vs-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  public activedRouter = '';
  public showMyProfile = false;
  public showSettings = false;
  public useMenuList: Array<localMeunListType> = [];
  language = '';
  private allMeunList: Array<localMeunListType> = localMeunClass.list;
  private meunMap: MeunMapType = MeunMapClass.map;

  constructor(
    private i18nService: I18nService,
    private router: Router,
    private location: Location,
    private routerService: RouterService,
    private rbacService: RbacService,
    private environmentService: EnvironmentService,
  ) { }

  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.language = this.i18nService.getLanguage();
    this.i18nService.getLanguageObservable().subscribe(lang => {
      this.language = lang;
    });

    this.getMenuList();
    this.highlightMenu(this.location.path());

    // watch router change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.highlightMenu(event.url.split('?')[0]);
      }
    });
  }

  /* Lifecycle function  -----end */


  /* custom function   -----start */
  getMenuList(): void {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const meunMapKeys = Object.keys(this.meunMap);
    const pushedItem: string[] = [];
    this.allMeunList.forEach((item => {
      meunListRes.forEach((ele: TRAFFICMenuList) => {
        for (let i = 0; i < meunMapKeys.length; i++) {
          const key = meunMapKeys[i] || '';
          if (ele.uriSet.includes(key)) {
            if (this.meunMap[key as keyof MeunMapType] === PathLib.CAMERA_MAMANGERMENT) this.showSettings = true;
            if (this.meunMap[key as keyof MeunMapType] === PathLib.MY_PROFILE) this.showMyProfile = true;
            if (this.meunMap[key as keyof MeunMapType] === item.path && !pushedItem.includes(item.path)) {
              this.useMenuList.push(item);
              pushedItem.push(item.path);
            }
            break;
          }
        }
      });
    }));
  }

  gotoUrl(url: string): void {
    if (url === PathLib.INDEX) {
      const SUB_SYSTEMS = this.environmentService.getGlobalVariable('SUB_SYSTEMS');
      window.location.href = `${location.protocol}//${SUB_SYSTEMS}`;
      return;
    }
    url && this.routerService.navigate([url]);
    this.highlightMenu(url);
  }

  highlightMenu(url: string | undefined): void {
    if (!url) {
      url = this.useMenuList[0].path;
    }
    url = url2RoutingPath(url);
    this.activedRouter = url;
  }

  logout(): void {
    const params = { refreshToken: '' };
    const userKey: OutLoginParams | null = JSON.parse(localStorage.getItem('UserInfoKey') as string);
    if (userKey) {
      params.refreshToken = userKey.refresh_token || '';
    }
    this.rbacService.logout(params).subscribe();
  }

  myProfile(): void {
    this.gotoUrl(PathLib.MY_PROFILE);
  }

  settings(): void {
    this.gotoUrl(PathLib.CAMERA_MAMANGERMENT);
  }
}
