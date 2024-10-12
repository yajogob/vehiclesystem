import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vs-mode-switch',
  templateUrl: './mode-switch.component.html',
  styleUrls: ['./mode-switch.component.scss'],
})
export class ModeSwitchComponent {
  @Input() renderMode='table';
  @Output() renderModeChange = new EventEmitter<string>();


  setRenderType(type:string):void {
    this.renderMode = type;
    this.renderModeChange.emit(type);
  }
}
