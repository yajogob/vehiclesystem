import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { INoRowsOverlayAngularComp } from "ag-grid-angular";
import { INoRowsOverlayParams } from "ag-grid-community";

@Component({
  selector: 'vs-no-rows-overlay',
  templateUrl: './no-rows-overlay.component.html',
  styleUrls: ['./no-rows-overlay.component.scss'],
})
export class NoRowsOverlayComponent implements INoRowsOverlayAngularComp, OnInit {

  public params?: INoRowsOverlayParams & { noRowsMessageFunc: () => string};
  language = 'en';

  constructor(
    protected tl: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.language = this.tl.getActiveLang();
  }

  agInit(params: INoRowsOverlayParams & { noRowsMessageFunc: () => string}): void {
    this.params = params;
  }
}
