import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'vs-switch-button-form',
  templateUrl: './switch-button-form.component.html',
  styleUrls: ['./switch-button-form.component.scss'],
})
export class SwitchButtonFormComponent implements OnChanges {
  @Output() switchChangedEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() value = false;

  switchValue = false;

  ngOnChanges(): void {
    this.switchValue = this.value;
  }

  switchChanged(): void {
    this.switchChangedEmit.emit(this.switchValue);
  }
}
