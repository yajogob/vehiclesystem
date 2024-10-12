import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'vs-switch-button-renderer',
  templateUrl: './switch-button-renderer.component.html',
  styleUrls: ['./switch-button-renderer.component.scss'],
})
export class SwitchButtonRendererComponent implements ICellRendererAngularComp {
  switchValue = false;
  enabledText!: string;
  disabledText!: string;
  params!: ICellRendererParams;
  disableSwitch = false;

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.disableSwitch = params.colDef?.cellRendererParams?.disableSwitch;
    const list: Array<{[key: string]: string}> = params.colDef?.cellRendererParams?.statusList;
    list?.forEach( item => {
      if (item['value'] === '3') this.enabledText = item['key'];
      if (item['value'] === '5') this.disabledText = item['key'];
    });

    this.params = params;

    if (params.data.currentStatus) {
      this.switchValue = params.data.currentStatus === '3';
    }
    if (params.data.taskStatus) {
      this.switchValue = true;
    }
  }

  // gets called whenever the cell refreshes
  refresh = (): boolean => {
    return false;
  };

  switchChange(): void {
    this.params?.context.componentParent.switchCallback(this.params.colDef?.field, this.switchValue, this.params.data);
  }
}
