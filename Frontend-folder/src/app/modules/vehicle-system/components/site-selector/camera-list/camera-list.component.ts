import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SiteTreeNode } from '../interfaces/http.response';

@Component({
  selector: 'vs-camera-list',
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.scss'],
})
export class CameraListComponent {
  @Input() treeData: SiteTreeNode[] = [];
  @Input() filterStr = '';
  @Input() parentCode = '';
  @Output() nodeClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeSelectEmit: EventEmitter<SiteTreeNode> = new EventEmitter<SiteTreeNode>();


  /* custom function   -----start */
  isHasChildren(data: SiteTreeNode): boolean {
    this;
    return !!(data.children && data.children.length);
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

  siteNodeChecked(camera: SiteTreeNode, treeNode: SiteTreeNode): void {
    camera['_isChecked'] = !camera['_isChecked'];
    this.setCheckboxIndeterminate(treeNode);
    this.changeSelectEmit.emit(camera);
  }
}
