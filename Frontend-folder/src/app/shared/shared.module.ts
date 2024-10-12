import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GomapComponent } from './components/gomap/gomap.component';


@NgModule({
  declarations: [
    GomapComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    GomapComponent,
    FormsModule,
  ],
})
export class SharedModule { }
