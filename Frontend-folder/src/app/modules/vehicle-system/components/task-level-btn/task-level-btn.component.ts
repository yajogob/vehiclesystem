import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'vs-task-level-btn',
  templateUrl: './task-level-btn.component.html',
  styleUrls: ['./task-level-btn.component.scss'],
})
export class TaskLevelBtnComponent implements OnChanges {
  @Input() taskLevel:(string | null | undefined) = '';
  @Output() taskLevelChange  = new EventEmitter();

  taskLevelList: Array<string>=[];

  /* Lifecycle function  -----start */
  ngOnChanges(): void {
    if (!this.taskLevel) {
      this.taskLevelList = [];
    } else {
      this.taskLevelList = this.taskLevel.split(',');
    }
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  setTaskLevelList(type: string):void {
    const index = this.taskLevelList.indexOf(type);
    if (index > -1) {
      this.taskLevelList.splice(index, 1);
    } else {
      this.taskLevelList.push(type);
    }
    this.taskLevel = this.taskLevelList.join();
    this.taskLevelChange.emit(this.taskLevel);
  }
  /* custom function   -----end */
}
