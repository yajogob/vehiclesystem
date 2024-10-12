import { Component, Input } from '@angular/core';
import { PaginationComponent } from 'src/app/modules/vehicle-system/components/pagination-grid';
import { OutTrafficFineSearch } from 'src/app/modules/vehicle-system/interfaces/traffic-fine/traffic-fine';

@Component({
  selector: 'vs-fine-details-retracted-expanded',
  templateUrl: './fine-details-retracted-expanded.component.html',
  styleUrls: ['./fine-details-retracted-expanded.component.scss'],
})
export class FineDetailsRetractedExpandedComponent {
  @Input() wFull!: boolean;
  @Input() imgFull!: boolean;
  @Input() allDetailsData!: Array<OutTrafficFineSearch>;
  @Input() paginationComponent!: PaginationComponent;

  // like vue :key = index
  trackByIndex = (index: number): number => {
    return index;
  };
}
