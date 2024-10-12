import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OutAlgorithmsListSearch } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { DIRECTION, I18nService } from 'src/app/modules/vehicle-system/utils/i18n.service';

@Component({
  selector: 'vs-ai-algorithm-modal',
  templateUrl: './ai-algorithm-modal.component.html',
  styleUrls: ['./ai-algorithm-modal.component.scss'],
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
export class AiAlgorithmModalComponent {
  @Input() isShow!: boolean;
  @Input() currentAlgorithmsData!: OutAlgorithmsListSearch;
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  slideX = "100%";
  language = '';

  constructor(
    private i18nService: I18nService,
  ) {
    const enableRtl = i18nService.getDirection() === DIRECTION.RTL;
    if(enableRtl) {
      this.slideX = "-100%";
    }
    this.language = this.i18nService.getLanguage();
  }

  getAlgorithmName(item:OutAlgorithmsListSearch): string {
    if (this.language === 'en') {
      return item.enName || '';
    }
    if (this.language === 'ar') {
      return item.arName || '';
    }
    return '';
  }

  getAlgorithmDescription(item:OutAlgorithmsListSearch): string {
    if (this.language === 'en') {
      return item.enDescription || '';
    }
    if (this.language === 'ar') {
      return item.arDescription || '';
    }
    return '';
  }

  close(): void {
    this.closeModalEvent.emit();
  }
}
