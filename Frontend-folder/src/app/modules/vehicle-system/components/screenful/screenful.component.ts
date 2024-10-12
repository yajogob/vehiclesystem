import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '../../utils/logger.service';

@Component({
  selector: 'vs-screenful',
  templateUrl: './screenful.component.html',
  styleUrls: ['./screenful.component.scss'],
})
export class ScreenfulComponent implements OnInit, OnDestroy{

  constructor(
    private logger: LoggerService,
  ) {}

  isFullscreen = false;
  handlefullscreenchange = (): void => {
    this.logger.info('handlefullscreenchange0>>>', this.isFullscreen);
  };
  
  ngOnInit(): void {
    this.handlefullscreenchange = (): void => {
      if(document.fullscreenElement){
        this.isFullscreen = true;
      } else {
        this.isFullscreen = false;
      }
      sessionStorage.setItem('is-fullscreen', this.isFullscreen ? '1' : '0');
    };
    document.addEventListener("fullscreenchange", this.handlefullscreenchange);
  }

  ngOnDestroy(): void {
    document.removeEventListener("fullscreenchange", this.handlefullscreenchange);
  }

  toggle(): void {
    this.isFullscreen = sessionStorage.getItem('is-fullscreen') == '1' ? true : false;
    this.isFullscreen = ! this.isFullscreen;
    if(this.isFullscreen){
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    sessionStorage.setItem('is-fullscreen', this.isFullscreen ? '1' : '0');
  }
}
