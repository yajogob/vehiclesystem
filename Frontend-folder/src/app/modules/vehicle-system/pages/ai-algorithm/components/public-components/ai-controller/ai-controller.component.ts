import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'vs-ai-controller',
  templateUrl: './ai-controller.component.html',
  styleUrls: ['./ai-controller.component.scss'],
})
export class AiControllerComponent {
  @Output() taskClickEmit: EventEmitter<string> = new EventEmitter<string>();

  taskClick(type: string): void {
    this.taskClickEmit.emit(type);
  }
}
