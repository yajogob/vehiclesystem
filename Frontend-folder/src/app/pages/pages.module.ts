import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { WidgetsComponent } from './widgets/widgets.component';


@NgModule({
  declarations: [
    PagesComponent,
    WidgetsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
  ],
})
export class PagesModule { }
