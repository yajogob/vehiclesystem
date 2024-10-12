import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SiteTreeNode } from '../interfaces/http.response';

@Component({
  selector: 'vs-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss'],
})
export class SiteListComponent {
  @Input() treeData: SiteTreeNode[] = [];
  @Input() filterStr = '';
  @Output() nodeClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeSelectEmit: EventEmitter<SiteTreeNode> = new EventEmitter<SiteTreeNode>();
  @Output() unfoldEmit: EventEmitter<SiteTreeNode> = new EventEmitter<SiteTreeNode>();


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

  siteNodeChecked(leafSite: SiteTreeNode, treeNode: SiteTreeNode): void {
    leafSite['_isChecked'] = !leafSite['_isChecked'];
    this.setAllChildrenCheckStatus([leafSite], leafSite['_isChecked']);
    this.setCheckboxIndeterminate(treeNode);
    this.changeSelectEmit.emit(leafSite);
  }

  unfoldLeafSite(leafSite: SiteTreeNode): void {
    this.unfoldEmit.emit(leafSite);
  }
}
