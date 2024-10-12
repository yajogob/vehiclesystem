import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SiteTreeNode } from '../interfaces/http.response';

@Component({
  selector: 'vs-site-tree',
  templateUrl: './site-tree.component.html',
  styleUrls: ['./site-tree.component.scss'],
})
export class SiteTreeComponent implements OnInit {
  @Input() treeData: SiteTreeNode[] = [];
  @Input() treeIndex = 0;
  @Input() currentSiteGroup?: SiteTreeNode;
  @Output() nodeClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() checkTreeIndexEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() checkSiteGroupEmit: EventEmitter<SiteTreeNode> = new EventEmitter<SiteTreeNode>();


  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this;
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  isHasChildren(data: SiteTreeNode): boolean {
    this;
    return !!(data.children && data.children.length);
  }

  setAllChildrenCheckStatus(list: SiteTreeNode[], flag = false): void {
    list.forEach(item => {
      item['_isChecked'] = flag;
      if (!item['_isChecked']) {
        item['_indeterminate'] = false;
      }
      if (this.isHasChildren(item)) {
        this.setAllChildrenCheckStatus(item.children, flag);
      }
    });
  }

  setCheckboxIndeterminate(data: SiteTreeNode): void {
    let flag = false;
    if (this.isHasChildren(data)) {
      const checked = data.children.filter((item: SiteTreeNode) => item['_isChecked']);
      const checkedCount = checked.length;
      data['_isChecked'] = checkedCount === data.children.length;
      flag = (checkedCount > 0 && checkedCount < data.children.length);
    } else {
      flag = false;
    }
    const indeterminateCount = data.children.filter((item: SiteTreeNode) => item['_indeterminate']).length;
    data['_indeterminate'] = flag || !!indeterminateCount;
    // Events are passed up through the hierarchy
    this.nodeClick.emit();
  }

  treeNodeChecked(treeNode:SiteTreeNode): void {
    treeNode['_isChecked'] = !treeNode['_isChecked'];
    this.setAllChildrenCheckStatus([treeNode], treeNode['_isChecked']);
    this.setCheckboxIndeterminate(treeNode);
  }

  setCurrentSiteGroup(treeNode: SiteTreeNode): void {
    this.checkSiteGroupEmit.emit(treeNode);
    this.checkTreeIndexEmit.emit(this.treeIndex);
  }
  /* custom function   -----end */
}
