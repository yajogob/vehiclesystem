import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { KeyValueType } from '../../interfaces/key-value-type';
import { PublicModalService } from '../../services/public-modal.service';

/**
 * simple public modal
*/
@Component({
  selector: 'vs-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss'],
})
export class ModalComponentComponent implements OnInit, OnDestroy {
  @Input() modalCss: KeyValueType = {
    'width': '57.9167rem',
    'display': 'flex',
    'flex-direction': 'column',
    'margin': '0 2rem',
  };  // Default value, can be passed in

  showModalValue$!: Subscription;
  isShow!: boolean;

  constructor(
    private publicModalService: PublicModalService,
  ) {}

  ngOnInit(): void {
    this.subscribeOb(); // subscribe
  }

  ngOnDestroy(): void {
    if (this.showModalValue$) {
      this.showModalValue$.unsubscribe(); // unsubscribe
    }
  }

  // hideModal
  close(): void {
    this.publicModalService.hideModal();
  }

  // subscription switch
  subscribeOb(): void {
    this.showModalValue$ = this.publicModalService.getShowModal().subscribe(
      res => this.isShow = res,
    );
  }
}
