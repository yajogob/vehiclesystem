import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MapService } from '../../../../services/map-event.service';

@Component({
  selector: 'vs-map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.scss'],
})
export class MapControllerComponent implements OnInit {
  isFullScreen=false;
  mapMode='3D';

  constructor(
    private router: Router,
    private mapService: MapService,
  ) {}


  ngOnInit(): void {
    this.isFullScreen = sessionStorage.getItem('is-fullscreen') == '1' ? true : false;
    // After leaving "/alert", clear loading on this page
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.isFullScreen = sessionStorage.getItem('is-fullscreen') == '1' ? true : false;
      }
    });

    this.changeMapMode(this.mapMode);
  }


  /* custom function   -----start */
  changeMapZoom(type:string):void {
    this.mapService.subject.next({
      eventType: 'set-map-zoom',
      data: {type},
    });
  }

  changeMapMode(type:string):void {
    this.mapMode = type;
    this.mapService.subject.next({
      eventType: 'set-map-mode',
      data: {type},
    });
  }

  mapReset():void {
    this.mapMode = '3D';
    this.mapService.subject.next({
      eventType: 'map-reset',
      data: {},
    });
  }

  fullScreen():void {
    if(!this.isFullScreen){
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
    sessionStorage.setItem('is-fullscreen', this.isFullScreen ? '1' : '0');
  }
  /* custom function   -----end */
}
