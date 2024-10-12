import { Component, ElementRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IconsListType } from '../../interfaces/key-value-type';
import { AiConstLibrary } from '../../pages/ai-algorithm/libs/ai-const-library';
import { PublicModalService } from '../../services/public-modal.service';

@Component({
  selector: 'vs-table-actions-renderer',
  templateUrl: './table-actions-renderer.component.html',
  styleUrls: ['./table-actions-renderer.component.scss'],
})
export class TableActionsRendererComponent implements ICellRendererAngularComp {
  public params!: ICellRendererParams;
  iconsList: Array<IconsListType> = [];

  constructor(
    private el: ElementRef,
    private publicModalService: PublicModalService,
  ) {}

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
    if(params.colDef?.cellRendererParams) {
      this.handleIcons(params.colDef.cellRendererParams as string[], params?.data?.taskStatus);
    }
  }

  // gets called whenever the cell refreshes
  refresh(): boolean {
    this;
    return false;
  }

  handleIcons(list: string[], taskStatus?: string): void {
    list.forEach((value: string) => {
      const item: IconsListType = {
        imgClass: value,
        imgType: value,
      };
      if (value === AiConstLibrary.starter) {
        if (taskStatus === '1') item.imgClass = 'stop';
        if (taskStatus === '0' || taskStatus === '5') item.imgClass = 'start';
      }
      this.iconsList.push(item);
    });
  }

  clickIcon(type: string): void {
    if (type === 'delete') {
      const ele = this.el.nativeElement.querySelector('#ele').getBoundingClientRect();
      this.publicModalService.divPosition$.next(ele);
    }
    this.params.context.componentParent.actionCallback(type, this.params.data);
  }
}
