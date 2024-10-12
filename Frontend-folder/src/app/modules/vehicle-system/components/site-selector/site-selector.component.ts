import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize, tap } from 'rxjs';
import { CamerasListRes, SearchSiteData, SiteTreeNode } from './interfaces/http.response';
import { SiteHttpRequest } from './service/request.service';
import { SiteSelectorBehaviorSubject } from './site-selector.BehaviorSubject';

@Component({
  selector: 'vs-site-selector',
  templateUrl: './site-selector.component.html',
  styleUrls: ['./site-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SiteSelectorComponent implements OnInit, OnChanges {
  @Input() hiddenConfirmBtn = false;
  @Input() isHeightAuto = false;
  @Input() selectedList?:Array<SiteTreeNode>;
  @Input() visible = false;
  @Input() hiddenCloseModal = false;
  @Output() readonly visibleChange = new EventEmitter<boolean>();
  @Input() position = '';
  @Output() selectCountEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() confirmEmit: EventEmitter<SiteTreeNode[]> = new EventEmitter<SiteTreeNode[]>();
  @Input() treeData?:Array<SiteTreeNode>;


  activedSearchType = 'site';
  searchContent = '';
  filterSiteStrLowerCase = '';
  filterCameraStrLowerCase = '';
  originalSiteData?: SiteTreeNode;
  siteTreeList: SiteTreeNode[] = [];
  currentSiteTreeIndex?: number;
  treeCurrentSiteGroup?: SiteTreeNode;
  treeCurrentLeafSite?: SiteTreeNode;
  selectedCount = 0;
  showLeafSiteList = false;
  searchLeafSite: SearchSiteData = {
    children: [],
    _isChecked: false,
    _indeterminate: false,
    _activedCount: 1,  //because 0 is false；
  };

  // currentLeafSite：This field controls the display of the camera list
  currentLeafSite?: SiteTreeNode;
  allSelectedNodeList: SiteTreeNode[] = [];


  constructor(
    private siteHttpRequest: SiteHttpRequest,
    private siteSelectorBehaviorSubject: SiteSelectorBehaviorSubject,
    private loadService: NgxUiLoaderService,
    private renderer: Renderer2,
  ) { }


  /* Lifecycle function  -----start */
  ngOnInit(): void {
    document.addEventListener('keyup', this.closeSiteSelectorByEsc);
    this.siteSelectorBehaviorSubject.siteTree$.subscribe({
      next: res => {
        this.getOriginalSiteTree(JSON.parse(JSON.stringify(res)));
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue && this.isHeightAuto) {
      const siteTrees = document.querySelectorAll('.site-selector-wrapper .site-tree-container');
      if (window.innerHeight >= 1000) {
        siteTrees.forEach((value:Element) => {
          this.renderer.setStyle(value, 'height', '25rem');
        });
      } else {
        siteTrees.forEach((value:Element) => {
          this.renderer.setStyle(value, 'height', '22rem');
        });
      }
    }

    if (changes['visible'] && changes['visible'].currentValue && this.selectedList) {
      this.setSiteTreeStatusOnSelectedList(this.siteTreeList, this.selectedList);
      this.treeNodeCheckOn();
      // handles all button states for list mode
      if (this.currentLeafSite) {
        this.setCheckboxIndeterminate(this.currentLeafSite);
      }
      this.setCheckboxIndeterminate(this.searchLeafSite);
    }

    if (changes['visible'] && !changes['visible'].currentValue) {
      this.loadService.destroyLoaderData('site-and-device-search-loader');
      this.loadService.destroyLoaderData('site-tree-search-loader');
    }

    if (changes['treeData'] && !changes['treeData'].firstChange && changes['treeData'].currentValue) {
      this.siteTreeList = this.treeData || [];
      this.handleSiteTreeList(this.siteTreeList, 0);
    }
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  closeSiteSelectorByEsc = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.visibleChange.emit(false);
    }
  };

  setSiteTreeStatusOnSelectedList(list: SiteTreeNode[], selectedList: SiteTreeNode[], parentLevel?:SiteTreeNode): void {
    const SelectedSiteCodes = selectedList?.filter(item => item.code)?.map(item => item.code);
    const SelectedCameraCodes = selectedList?.filter(item => item.cameraCode)?.map(item => item.cameraCode);
    if (list && Array.isArray(list)) {
      list.forEach(item => {
        // areaType 1:siteGroup  2:site  3:camera
        switch(item.areaType) {
          case 3:
            if (SelectedCameraCodes?.includes(item.cameraCode)) {
              item['_isChecked'] = true;
            } else {
              item['_isChecked'] = false;
            }
            break;
          default:
            if (SelectedSiteCodes?.includes(item.code)) {
              item['_isChecked'] = true;
              this.setAllChildrenCheckStatus(item.children, true);
            } else {
              item['_isChecked'] = false;
              if (this.isHasChildren(item)) {
                this.setSiteTreeStatusOnSelectedList(item.children, selectedList, item);
              }
            }
        }
      });
      parentLevel && this.setCheckboxIndeterminate(parentLevel);
    }
  }

  setAllChildrenCheckStatus(list: SiteTreeNode[], flag = false): void {
    if (list && Array.isArray(list)) {
      list.forEach(item => {
        item['_isChecked'] = flag;
        if (this.isHasChildren(item)) {
          this.setAllChildrenCheckStatus(item.children, flag);
        }
      });
    }
  }

  getOriginalSiteTree(originalSiteTree:SiteTreeNode[]): void {
    if (this.treeData && Array.isArray(this.treeData)) {
      this.siteTreeList = this.treeData;
      this.handleSiteTreeList(this.siteTreeList, 0);
      return;
    }
    this.siteTreeList = originalSiteTree;
    this.handleSiteTreeList(this.siteTreeList, 0);
  }

  handleSiteTreeList(
    siteList: SiteTreeNode[],
    _level: number,
    selectedCameraIds?: (string | undefined)[],
    flag?: boolean,
    _parentName?:string,
  ): void {
    _level += 1;
    siteList.forEach(item => {
      if (_parentName) {
        item['_parentName'] = _parentName;
      }
      if (!('_isChecked' in item)) {
        item['_isChecked'] = false;
      }
      if (!('_level' in item)) {
        item['_level'] = _level;
        // Set to expand several layers of data structures
        if (_level <= 1) {
          item['_showChildren'] = true;
        }
      }
      if (!('_showChildren' in item)) {
        item['_showChildren'] = false;
      }
      if (!item.children || !Array.isArray(item.children)) {
        item.children = [];
      }
      /*
        Set the selected state of the camera based on the selected device id
        areaType 1:siteGroup  2:site  3:camera
      */
      if (selectedCameraIds && selectedCameraIds.length && item.areaType === 3) {
        item['_isChecked'] = selectedCameraIds.includes(item.cameraId || '');
      }
      // If the identity is passed, set the checkbox status
      if (flag !== undefined) {
        item['_isChecked'] = flag;
      }
      if (item.children.length) {
        this.handleSiteTreeList(item.children, _level, selectedCameraIds, flag, item.codeDesc);
      }
    });
  }

  searchContentFn(): void {
    if (this.searchContent === '') return;
    this.loadService.startLoader('site-and-device-search-loader');

    setTimeout(() => {
      this.showLeafSiteList = true;
      this.filterSiteStrLowerCase = '';
      this.filterCameraStrLowerCase = '';
      const searchContentTrim = this.searchContent.trim();
      switch (this.activedSearchType) {
        case 'site':
          this.searchLeafSite.children = [];
          this.currentLeafSite = undefined;
          this.filterSiteStrLowerCase = searchContentTrim.toLocaleLowerCase();
          this.setSearchLeafSite(this.siteTreeList, this.filterSiteStrLowerCase);
          this.loadService.stopLoader('site-and-device-search-loader');
          this.setCheckboxIndeterminate(this.searchLeafSite);
          break;
        case 'camera':
          this.currentLeafSite = {
            children: [],
            _isChecked: false,
            _indeterminate: false,
            _activedCount: 1,  //because 0 is false；
          };
          this.filterCameraStrLowerCase = searchContentTrim.toLocaleLowerCase();
          this.setSearchLeafCameraToTreeData(this.siteTreeList, this.filterCameraStrLowerCase);
          this.loadService.stopLoader('site-and-device-search-loader');
          this.setCheckboxIndeterminate(this.currentLeafSite);
          break;
      }
    });
  }

  setSearchLeafSite(siteTreeList: SiteTreeNode[], siteName: string): void {
    const children: SiteTreeNode[] = [];
    siteTreeList.forEach(item => {
      // areaType 1:siteGroup  2:site  3:camera
      if (item.areaType !== 3) {
        if (item.areaType === 2 && item.codeDesc?.toLocaleLowerCase()?.includes(siteName)) {
          this.searchLeafSite.children.push(item);
        } else {
          if (item.children && item.children.length) {
            children.push(...item.children);
          }
        }
      }
    });
    if (children.length) {
      this.setSearchLeafSite(children, siteName);
    }
  }

  setSearchLeafCameraToTreeData(siteTreeList: SiteTreeNode[], filterStr: string): void {
    const children: SiteTreeNode[] = [];
    siteTreeList.forEach(item => {
      // areaType 1:siteGroup  2:site  3:camera
      if (item.areaType === 3 && item.codeDesc?.toLocaleLowerCase()?.includes(filterStr)) {
        this.currentLeafSite?.children.push(item);
      } else {
        if (item.children && item.children.length) {
          children.push(...item.children);
        }
      }
    });
    if (children.length) {
      this.setSearchLeafCameraToTreeData(children, filterStr);
    }
  }

  setSearchLeafCamera(cameraName: string): void {
    const response = this.siteHttpRequest.queryCameraInfoByCameraNameApi({cameraName});
    response.pipe(
      tap({
        error: () => {
          this.currentLeafSite = undefined;
          this.loadService.stopLoader('site-and-device-search-loader');
        },
      }),
    ).subscribe((data: CamerasListRes) => {
      if (data.status === 200 && data.result && Array.isArray(data.result)) {
        const siteCodeList:string[] = [];
        data.result.forEach(camera => {
          if (camera.siteCode && !siteCodeList.includes(camera.siteCode)) {
            siteCodeList.push(camera.siteCode);
          }
        });
        // Query all devices under the site and add them to the tree
        this.getLeafSiteAllChildren(siteCodeList);
      } else {
        this.currentLeafSite = undefined;
      }
    });
  }

  getLeafSiteAllChildren(siteCodeList:string[]): void {
    const response = this.siteHttpRequest.queryCameraInfoBySiteCodesApi({siteCode: siteCodeList});
    response.pipe(
      tap({
        error: () => {
          this.loadService.stopLoader('site-and-device-search-loader');
        },
      }),
      finalize(() => {
        this.loadService.stopLoader('site-and-device-search-loader');
      }),
    ).subscribe((data: CamerasListRes) => {
      if (data.status === 200 && data.result && Array.isArray(data.result)) {
        data.result.forEach(item => {
          if (item.areaPath) {
            const areaPathList = item.areaPath.split('/').filter(item => (item && item !== 'UAE'));
            this.pushChildrenOnAreaPath(this.siteTreeList, areaPathList, item);
          }
        });
        this.setSearchLeafCameraToTreeData(this.siteTreeList, this.filterCameraStrLowerCase);
        this.currentLeafSite && this.setCheckboxIndeterminate(this.currentLeafSite);
      }
    });
  }

  // areaPath: "/UAE/Abu Dhabi/Abu Dhabi City/Hotels/"
  pushChildrenOnAreaPath(siteTreeList:SiteTreeNode[], areaPath:string[], data:SiteTreeNode): void {
    let activedSiteTree:SiteTreeNode = {children: []};
    const pathName = areaPath.shift();
    for (let i = 0; i < siteTreeList.length; i++) {
      if (pathName && pathName === siteTreeList[i].codeDesc) {
        activedSiteTree = siteTreeList[i];
        break;
      }
    }
    if (areaPath.length > 0) {
      this.pushChildrenOnAreaPath(activedSiteTree.children, areaPath, data);
      return;
    }
    activedSiteTree.children.forEach(leafSite => {
      if (leafSite.code === data.code && !leafSite.children.length) {
        leafSite.children.push(...(data.children.map(camera => {
          if (!('_isChecked' in camera)) {
            camera['_isChecked'] = leafSite['_isChecked'] || false;
          }
          if (!('codeDesc' in camera)) {
            camera['codeDesc'] = camera.cameraName;
          }
          camera.areaType = 3;
          return camera;
        })));
      }
    });
  }

  siteGroupCheckOn(index: number): void {
    this.currentSiteTreeIndex = index;
  }

  setTreeCurrentSiteGroup(siteGroup: SiteTreeNode): void {
    this.treeCurrentSiteGroup = siteGroup;
    this.treeCurrentLeafSite = undefined;
  }

  emptyTreeCurrentSiteGroup(): void {
    this.treeCurrentSiteGroup = undefined;
    this.treeCurrentLeafSite = undefined;
    this.currentSiteTreeIndex = 0;
  }

  unfoldTreeCurrentSiteGroup(leafSite: SiteTreeNode): void {
    this.treeCurrentLeafSite = leafSite;
    if (leafSite.children.length >= (leafSite.childrenCount || 0)) {
      return;
    }
    if (leafSite.code) {
      this.getLeafCamerasBySiteCode(leafSite);
    }
  }

  getLeafCamerasBySiteCode(leafSite:SiteTreeNode): void {
    this.loadService.startLoader('site-tree-search-loader');
    const response = this.siteHttpRequest.queryCameraInfoBySitesApi({ siteCode: leafSite.code || '' });
    response.pipe(
      finalize(() => {
        this.loadService.stopLoader('site-tree-search-loader');
      }),
    ).subscribe((data: CamerasListRes) => {
      if (data.status === 200) {
        const cameraList = data.result;
        const children:SiteTreeNode[] = cameraList.map(camera => {
          if (!('_isChecked' in camera)) {
            camera['_isChecked'] = leafSite['_isChecked'] || false;
          }
          if (!('codeDesc' in camera)) {
            camera['codeDesc'] = camera.cameraName;
          }
          camera.areaType = 3;
          return camera;
        });

        if (this.treeCurrentLeafSite && this.treeCurrentLeafSite.children) {
          this.treeCurrentLeafSite.children = children;
        }
      }
    });
  }

  emptyTreeCurrentLeafSite(): void {
    this.treeCurrentLeafSite = undefined;
  }

  setTreeCurrentSiteGroupStatus(siteGroup: SiteTreeNode): void {
    siteGroup['_isChecked'] = !siteGroup['_isChecked'];
    this.setAllChildrenCheckStatus([siteGroup], siteGroup['_isChecked']);
    this.setCheckboxIndeterminate(siteGroup);
    this.updateSiteTreeList();
    // Count devices
    this.treeNodeCheckOn();
  }

  leafSiteChecked(leafSite: SiteTreeNode, treeNode: SiteTreeNode): void {
    leafSite['_isChecked'] = !leafSite['_isChecked'];
    this.setAllChildrenCheckStatus([leafSite], leafSite['_isChecked']);
    this.setCheckboxIndeterminate(treeNode);
    this.updateSiteTreeList();
    // Count devices
    this.treeNodeCheckOn();
  }

  setTreeCurrentLeafSiteStatus(leafSite: SiteTreeNode): void {
    leafSite['_isChecked'] = !leafSite['_isChecked'];
    this.setAllChildrenCheckStatus([leafSite], leafSite['_isChecked']);
    if (this.treeCurrentSiteGroup) {
      this.setCheckboxIndeterminate(this.treeCurrentSiteGroup);
    }
    this.updateSiteTreeList();
    // Count devices
    this.treeNodeCheckOn();
  }

  leafCameraChecked(camera: SiteTreeNode): void {
    camera['_isChecked'] = !camera['_isChecked'];
    this.setAllChildrenCheckStatus([camera], camera['_isChecked']);
    this.treeCurrentLeafSite && this.setCheckboxIndeterminate(this.treeCurrentLeafSite);
    this.treeCurrentSiteGroup && this.setCheckboxIndeterminate(this.treeCurrentSiteGroup);
    this.updateSiteTreeList();
    // Count devices
    this.treeNodeCheckOn();
  }

  updateSiteTreeList(): void {
    window.setTimeout(() => {
      this.updateTreeCheckStatus(this.siteTreeList);
    }, 50);
  }

  updateTreeCheckStatus(list: SiteTreeNode[], parentLevel?:SiteTreeNode): void {
    list.forEach(item => {
      if (this.isHasChildren(item)) {
        this.updateTreeCheckStatus(item.children, item);
      }
    });
    parentLevel && this.setCheckboxIndeterminate(parentLevel);
  }

  // Collects the number of selected items
  getSelectedDeviceCount(treeList:SiteTreeNode[]): void {
    treeList.forEach(item => {
      if (item['_isChecked']) {
        if (item.areaType === 3) {
          this.selectedCount += 1;
        } else {
          this.selectedCount += (item.childrenCount || 0);
        }
      } else {
        if (this.isHasChildren(item)) {
          this.getSelectedDeviceCount(item.children);
        }
      }
    });
  }

  treeNodeCheckOn(): void {
    this.selectedCount = 0;
    this.getSelectedDeviceCount(this.siteTreeList);
    this.selectCountEmit.emit(this.selectedCount);
  }

  siteListBackToTree(): void {
    this.showLeafSiteList = false;
    this.searchContent = '';
    this.searchLeafSite.children = [];
  }

  setSiteTreeStatusOnSearchLeafSite(
    list: SiteTreeNode[],
    treeNodeCodes: (string | undefined)[],
    flag:boolean,
    parentLevel?:SiteTreeNode,
  ): void {
    if (list && Array.isArray(list)) {
      list.forEach(item => {
        if (treeNodeCodes?.includes(item.code) || treeNodeCodes?.includes(item.cameraCode)) {
          item['_isChecked'] = flag;
          this.setAllChildrenCheckStatus(item.children, flag);
        } else {
          if (this.isHasChildren(item)) {
            this.setSiteTreeStatusOnSearchLeafSite(item.children, treeNodeCodes, flag, item);
          }
        }
      });
      parentLevel && this.setCheckboxIndeterminate(parentLevel);
    }
  }

  setAllLeafSiteCheckStatus(): void {
    this.searchLeafSite['_isChecked'] = !this.searchLeafSite['_isChecked'];
    const treeNodeCodes = this.searchLeafSite.children.map(item => (item.code || item.cameraCode));
    const flag = this.searchLeafSite['_isChecked'];
    if (flag) {
      this.searchLeafSite['_activedCount'] = this.searchLeafSite.children.length + 1;
    } else {
      this.searchLeafSite['_activedCount'] = 1;
      this.searchLeafSite['_indeterminate'] = false;
    }
    this.setSiteTreeStatusOnSearchLeafSite(this.siteTreeList, treeNodeCodes, flag);
    // Count devices
    this.treeNodeCheckOn();
  }

  changeLeafSiteStatus(leafSite: SiteTreeNode):void {
    if (leafSite['_isChecked']) {
      this.searchLeafSite['_activedCount'] += 1;
    } else {
      this.searchLeafSite['_activedCount'] -= 1;
    }
    const activedCount = this.searchLeafSite['_activedCount'];
    const comparativeCount = activedCount - 1;
    if (comparativeCount === 0 ) {
      this.searchLeafSite['_indeterminate'] = false;
      this.searchLeafSite['_isChecked'] = false;
    } else if (comparativeCount > 0 && comparativeCount < this.searchLeafSite.children.length) {
      this.searchLeafSite['_indeterminate'] = true;
      this.searchLeafSite['_isChecked'] = false;
    } else {
      this.searchLeafSite['_indeterminate'] = false;
      this.searchLeafSite['_isChecked'] = true;
    }
    this.setCheckboxIndeterminate(this.searchLeafSite);
    // Count devices
    this.treeNodeCheckOn();
  }

  isHasChildren(data: SiteTreeNode): boolean {
    this;
    return !!(data.children && data.children.length);
  }

  setCheckboxIndeterminate(data: SiteTreeNode): void {
    let indeterminate = false;
    if (this.isHasChildren(data)) {
      const checkedCount = data?.children.filter((item: SiteTreeNode) => item['_isChecked']).length;
      const childrenCount = data.children.length;
      data['_isChecked'] = checkedCount ? (checkedCount === childrenCount) : false;
      indeterminate = (checkedCount > 0 && checkedCount < childrenCount);
    }
    const indeterminateCount = data?.children.filter((item: SiteTreeNode) => item['_indeterminate']).length;
    data['_indeterminate'] = indeterminate || !!indeterminateCount;
  }

  addLeafCamera2LeafSite(leafSite: SiteTreeNode): void {
    this.currentLeafSite = leafSite;
    if (leafSite.children.length) {
      return;
    }
    if (leafSite.code) {
      this.getAllLeafCameras(leafSite);
    }
  }

  getAllLeafCameras(leafSite: SiteTreeNode): void {
    this.loadService.startLoader('site-and-device-search-loader');
    const response = this.siteHttpRequest.queryCameraInfoBySitesApi({ siteCode: leafSite.code || '' });
    response.pipe(
      finalize(() => {
        this.loadService.stopLoader('site-and-device-search-loader');
      }),
    ).subscribe((data: CamerasListRes) => {
      if (data.status === 200) {
        const cameraList = data.result;
        const children:SiteTreeNode[] = cameraList.map(camera => {
          if (!('_isChecked' in camera)) {
            camera['_isChecked'] = leafSite['_isChecked'] || false;
          }
          if (!('codeDesc' in camera)) {
            camera['codeDesc'] = camera.cameraName;
          }
          camera.areaType = 3;
          return camera;
        });

        if (this.currentLeafSite && this.currentLeafSite.children) {
          this.currentLeafSite.children = children;
        }
      }
    });
  }

  cameraListBackTo(): void {
    // If the site list does not exist, it falls back to the tree state
    if (!this.searchLeafSite.children.length) {
      // When returning the tree state, selected the state in the tree through the selected camera
      const selectedCameraIds = this.currentLeafSite?.children.filter(item => item['_isChecked']).map(camera => camera.cameraId);
      this.handleSiteTreeList(this.siteTreeList, 0, selectedCameraIds);
      this.showLeafSiteList = false;
      this.searchContent = '';
      this.currentLeafSite = undefined;
    } else {
      this.currentLeafSite = undefined;
    }
    if (this.searchLeafSite) {
      this.setCheckboxIndeterminate(this.searchLeafSite);
    }
  }

  changeLeafCameraStatus(camera: SiteTreeNode):void {
    if (!this.currentLeafSite) return;
    if (this.currentLeafSite['_activedCount']) {
      if (camera['_isChecked']) {
        this.currentLeafSite['_activedCount'] += 1;
      } else {
        this.currentLeafSite['_activedCount'] -= 1;
      }
      const activedCount = this.currentLeafSite['_activedCount'];
      const comparativeCount = activedCount - 1;
      if (comparativeCount === 0 ) {
        this.currentLeafSite['_indeterminate'] = false;
        this.currentLeafSite['_isChecked'] = false;
      } else if (comparativeCount > 0 && comparativeCount < this.currentLeafSite.children.length) {
        this.currentLeafSite['_indeterminate'] = true;
        this.currentLeafSite['_isChecked'] = false;
      } else {
        this.currentLeafSite['_indeterminate'] = false;
        this.currentLeafSite['_isChecked'] = true;
      }
    }
    this.setCheckboxIndeterminate(this.currentLeafSite);
    // Count devices
    this.treeNodeCheckOn();
  }

  setAllLeafCameraCheckStatus(): void {
    if (this.currentLeafSite) {
      this.currentLeafSite['_isChecked'] = !this.currentLeafSite['_isChecked'];
      const treeNodeCodes = this.currentLeafSite.children.map(item => (item.code || item.cameraCode));
      const flag = this.currentLeafSite['_isChecked'];
      if (flag) {
        this.currentLeafSite['_activedCount'] = this.currentLeafSite.children.length + 1;
      } else {
        this.currentLeafSite['_activedCount'] = 1;
        this.currentLeafSite['_indeterminate'] = false;
      }
      this.setSiteTreeStatusOnSearchLeafSite(this.siteTreeList, treeNodeCodes, flag);
      // Count devices
      this.treeNodeCheckOn();
    }
  }

  resetTree(): void {
    this.activedSearchType = 'site';
    this.searchContent = '';
    this.filterSiteStrLowerCase = '';
    this.filterCameraStrLowerCase = '';
    this.currentSiteTreeIndex = undefined;
    this.treeCurrentSiteGroup = undefined;
    this.treeCurrentLeafSite = undefined;
    this.selectedCount = 0;
    this.showLeafSiteList = false;
    this.searchContent = '';
    this.currentLeafSite = undefined;
    this.searchLeafSite = {
      children: [],
      _isChecked: false,
      _indeterminate: false,
      _activedCount: 0,
    };
    this.setSiteTreeStatusOnSelectedList(this.siteTreeList, []);
    this.treeNodeCheckOn();
  }

  confirmSelected(): void {
    this.allSelectedNodeList = [];
    this.recursionSelected(this.siteTreeList);
    const copySelectedNodeList = JSON.parse(JSON.stringify(this.allSelectedNodeList));
    const leafAreaType:(string|number)[] = [2, 3];  // 2:site  3:camera
    copySelectedNodeList.forEach((item:SiteTreeNode) => {
      if (item['_parentName'] && !leafAreaType.includes((item.areaType || 0))) {
        item.codeDesc = `${item['_parentName']} / ${item.codeDesc}`;
      }
    });
    this.confirmEmit.emit(copySelectedNodeList);
    this.loadService.stopLoader('site-and-device-search-loader');
    this.visibleChange.emit(false);
  }

  recursionSelected(siteTreeList: SiteTreeNode[]): void {
    const allChildrenList: SiteTreeNode[] = [];
    siteTreeList.forEach(site => {
      if (site['_isChecked']) {
        const copySite = JSON.parse(JSON.stringify(site));
        delete copySite.children;
        this.allSelectedNodeList.push(copySite);
      } else if (site['_indeterminate']) {
        allChildrenList.push(...site.children);
      }
    });
    if (allChildrenList.length) {
      this.recursionSelected(allChildrenList);
    }
  }

  closeSiteModal(): void {
    if (this.hiddenConfirmBtn) {
      this.confirmSelected();
    }
    this.visibleChange.emit(false);
  }
  /* custom function   -----end */
}
