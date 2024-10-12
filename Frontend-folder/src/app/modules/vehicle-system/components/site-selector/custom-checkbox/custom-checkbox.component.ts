import { Component, Input } from '@angular/core';

@Component({
  selector: 'vs-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss'],
})
export class CustomCheckboxComponent {
  @Input() indeterminate?:boolean;
  @Input() checked?:boolean;
}
