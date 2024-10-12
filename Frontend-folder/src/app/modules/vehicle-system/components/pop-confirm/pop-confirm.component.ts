import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { MadalType } from '../../interfaces/key-value-type';
import { PublicModalService } from '../../services/public-modal.service';

@Component({
  selector: 'vs-pop-confirm',
  templateUrl: './pop-confirm.component.html',
  styleUrls: ['./pop-confirm.component.scss'],
})
export class PopConfirmComponent implements OnInit, OnDestroy {
  isShow = false;
  modalInfo: MadalType = {
    isShow: false,
    title: 'vs.public.tips',
    content: 'Are you sure to delete this task ?', // this one, Translate it first and then pass it on
    cancelText: 'vs.public.no',
    confirmText: 'vs.public.yes',
  };

  position!: {top: string, left: string, transform: string};

  private conirmShow$!: Subscription;
  private position$!: Subscription;

  constructor(
    private publicModalService: PublicModalService,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.conirmShowFn();
    this.positionFn();
  }

  private conirmShowFn(): void {
    this.conirmShow$ = this.publicModalService.popConirmShow$.subscribe(info => {
      this.modalInfo = Object.assign(this.modalInfo, info);
      this.isShow = info.isShow as boolean;
    });
  }

  private positionFn(): void {
    this.position$ = this.publicModalService.divPosition$.subscribe(position => {
      const activeLangValue = this.translocoService.getActiveLang();
      const halfHeight = position.height / 2 + 2;
      const ltr = `translate(-105%, calc(-50% + ${halfHeight}px))`;
      const rtl = `translate(9%, calc(-50% + ${halfHeight}px))`;
      const trans = activeLangValue === 'en' ? ltr : rtl;
      this.position = {transform: trans, top: position.y + 'px', left: position.x + 'px'};
    });
  }

  confirm(): void {
    this.modalInfo.onOk && this.modalInfo.onOk();
    this.close();
  }

  close(): void {
    this.publicModalService.popConirmShow$.next({isShow: false});
  }

  ngOnDestroy(): void {
    this.conirmShow$ && this.conirmShow$.unsubscribe();
    this.position$ && this.position$.unsubscribe();
  }
}
