import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColDef } from "../index";

export interface ColumnStatus {
  id: string,
  label?: string,
  checked: boolean,
  disabled?: boolean
}

@Component({
  selector: 'vs-column-panel',
  templateUrl: './column-panel.component.html',
  styleUrls: ['./column-panel.component.scss'],
})
export class ColumnPanelComponent implements OnInit {

  @Input()
  set columnDefs(defs:ColDef[]) {
    this.updatedColumnDefs = defs.map(def => {
      return {...def};
    });
  }

  @Output() updateColumns: EventEmitter<ColDef[]> = new EventEmitter<ColDef[]>();

  isHidden = true;

  columns: ColumnStatus[] = [];
  updatedColumnDefs: ColDef[] = [];

  private lastCheckedColumn?: ColumnStatus;

  ngOnInit(): void {
    this.resetStatus();
  }

  onToggle(event: MouseEvent): void {
    if (this.isHidden) {
      const element = event.currentTarget as HTMLDivElement;
      const rect = element.getBoundingClientRect();
      const firstChildElement = element.firstChild as HTMLDivElement;
      const elementWidth = element.offsetWidth;

      firstChildElement.style.visibility = "hidden";
      firstChildElement.style.display = "block";
      if (rect.x < firstChildElement.offsetWidth - elementWidth) {
        firstChildElement.style.left = '0';
      } else {
        firstChildElement.style.left = (firstChildElement.offsetWidth - elementWidth) * -1 + 'px';
      }
      firstChildElement.style.visibility = "";
      firstChildElement.style.display = "";
    }
    this.isHidden = !this.isHidden;
    this.resetStatus();
  }

  onCheckChange(event: ColumnStatus): void {
    const column = this.columns.find(col => col.id === event.id);
    if (column) {
      column.checked = event.checked;
      if (this.lastCheckedColumn) {
        this.lastCheckedColumn.disabled = false;
        this.lastCheckedColumn = undefined;
      } else {
        this.lastCheckedColumn = this.disableLastCheckedColumn();
      }
    }
  }

  onCancel(): void {
    this.isHidden = true;
  }

  onUpdate(): void {
    this.updatedColumnDefs.forEach((def, index) => {
      def.hide = !this.columns[index].checked;
    });
    this.updateColumns.emit(this.updatedColumnDefs);
    this.isHidden = true;
  }

  private resetStatus(): void {
    this.columns = this.updatedColumnDefs.map(def => {
      return {id: def.field, label: def.headerName, checked: !def.hide, disabled: false} as ColumnStatus;
    });
    if (this.columns.length === 1) {
      this.columns[0].disabled = true;
    }
    this.lastCheckedColumn = this.disableLastCheckedColumn();
  }

  private disableLastCheckedColumn(): ColumnStatus | undefined {
    const checkedColumns = this.columns.filter(col => col.checked);
    if (checkedColumns.length <= 1) {
      checkedColumns[0].disabled = true;
      return checkedColumns[0];
    }
    return undefined;
  }
}
