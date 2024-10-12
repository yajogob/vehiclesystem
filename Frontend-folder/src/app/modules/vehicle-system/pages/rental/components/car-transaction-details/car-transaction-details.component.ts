import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OutCarRentalTransactions } from 'src/app/modules/vehicle-system/interfaces/car-rental/car-rental';
import { DIRECTION, I18nService } from 'src/app/modules/vehicle-system/utils/i18n.service';

@Component({
  selector: 'vs-car-transaction-details',
  templateUrl: './car-transaction-details.component.html',
  styleUrls: ['./car-transaction-details.component.scss'],
  animations: [
    trigger('slideTrigger', [
      transition(':enter', [
        style({ transform: 'translateX({{tx}})' }),
        animate('200ms ease-in-out', style({ transform: 'translateX(0)' })),
      ], {params: {tx: '100%'}}),
      transition(':leave', [
        animate('200ms ease-in-out', style({ transform: 'translateX({{tx}})' })),
      ], {params: {tx: '100%'}}),
    ])],
})
export class CarTransactionDetailsComponent implements OnInit {
  @Input() isShow!: boolean;
  @Input() currentTransactionsData!: OutCarRentalTransactions;
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  currentColorTheme!: string | null;
  slideX = "100%";

  constructor(
    private i18nService: I18nService,
  ) {
    const enableRtl = i18nService.getDirection() === DIRECTION.RTL;
    if(enableRtl) {
      this.slideX = "-100%";
    }
  }

  ngOnInit(): void {
    this.getColorTheme();
  }

  getColorTheme(): void {
    this.currentColorTheme = localStorage.getItem('color-theme');
  }
  
  close(): void {
    this.closeModalEvent.emit();
  }
}
