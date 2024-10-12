import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoreModule } from '@core/core.module';
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnvironmentService } from './services/EnvironmentService';
import { SimpleReuseStrategy } from './shared/SimpleReuseStrategy/SimpleReuseStrategy';
import { TranslocoRootModule } from './transloco-root.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,

    ServiceWorkerModule.register('./ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    HttpClientModule,
    TranslocoRootModule,
    ToastrModule.forRoot({maxOpened: 5}),
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/',
    },
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy },
    {
      provide: APP_INITIALIZER,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      useFactory: (envService: EnvironmentService) => () => envService.initGlobalConfig(),
      deps: [EnvironmentService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
