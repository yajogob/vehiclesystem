import { Component, Input } from '@angular/core';
import { FineInfo } from 'src/app/modules/vehicle-system/interfaces/traffic-fine/traffic-fine';

@Component({
  selector: 'vs-fine-details-modal-content',
  templateUrl: './fine-details-modal-content.component.html',
  styleUrls: ['./fine-details-modal-content.component.scss'],
})
export class FineDetailsModalContentComponent {
  @Input() modalData = new FineInfo();
}
