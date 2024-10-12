import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import videojs from 'video.js';
import { AuthService } from '../../utils/auth.service';
import { I18nService } from '../../utils/i18n.service';

@Component({
  selector: 'vs-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoTarget', {static: true}) videoTarget!: ElementRef;

  // See options: https://videojs.com/guides/options
  @Input() options = {
    sources: [{
      type: '',
      src: '',
      loop: false,
    }],
  };

  @Input() videoUrl = '';

  player!: videojs.Player;
  language = '';

  constructor(
    private http: HttpClient,
    private i18nService: I18nService,
  ) {
    this.language = this.i18nService.getLanguage();
  }

  // Instantiate a Video.js player OnInit
  ngOnInit(): void {
    const options = {
      ...this.options,
      controls: true,
      autoplay: true,
      muted: true,
      controlBar: {
        children: [
          'progressControl',
          'playToggle',
          'currentTimeDisplay',
          'durationDisplay',
          'timeDivider',
          'fullscreenToggle',
        ],
      },
    };
    this.player = videojs(this.videoTarget.nativeElement, options, () => {
      this.player.addClass('custom-controls');
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.player.on('error', (videoJsDom:any) => {
      const errorMsg = this.language === 'ar' ? 'تشغيل الوسائط غير متاح أو غير مدعوم' : 'The media playback is not available or not supported';
      const errorDom = videoJsDom.target.querySelector('.vjs-modal-dialog-content');
      errorDom.innerText = errorMsg;
    });

    if (this.videoUrl) {
      const {access_token} = AuthService.getUserInfo();
      const headers = new HttpHeaders().set('sub-system', 'traffic').set('authorization', `Bearer ${access_token}`);
      this.http.get(this.videoUrl, {
        headers,
        responseType: 'blob',
        observe: 'response',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }).subscribe((response:any) => {
        const videoBlob = response.body;
        // Create an object URL for the video blob
        const url = URL.createObjectURL(videoBlob);
        // Set the video source to the object URL
        this.player.src({ src: url, type: 'video/mp4' });
      });
    }
  }

  // Dispose the player OnDestroy
  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
