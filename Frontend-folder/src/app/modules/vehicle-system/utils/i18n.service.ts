import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Observable } from 'rxjs';

export enum DIRECTION {
  LTR = 'ltr',
  RTL = 'rtl',
}
@Injectable({providedIn: 'root'})
export class I18nService {
  switchLanguage$: BehaviorSubject<string> = new BehaviorSubject<string>('en');

  private renderer: Renderer2;
  private language = 'en';

  constructor(rendererFactory: RendererFactory2,
    private readonly translocoService: TranslocoService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.init();
  }

  init(): void {
    const language = this.getLanguage();
    this.setLanguage(language);
    const direction = this.getDirection();
    this.setDirection(direction);
  }

  update(language: string): void {
    this.setLanguage(language);
    const direction = this.getDirection();
    this.setDirection(direction);
  }

  private setDirection(direction: DIRECTION): void {
    this.renderer.setAttribute(document.documentElement, 'dir', direction);
    this.renderer.removeClass(document.documentElement, 'root-' + DIRECTION.LTR);
    this.renderer.removeClass(document.documentElement, 'root-' +DIRECTION.RTL);
    this.renderer.addClass(document.documentElement, 'root-' + direction);
  }

  public getDirection(): DIRECTION {
    const language = this.getLanguage();
    return (language == 'ar' ? DIRECTION.RTL : DIRECTION.LTR);
  }

  private setLanguage(language: string): void {
    if (this.translocoService.isLang(language)) {
      this.language = language;
      this.setLanguageObservable(language);
      localStorage.setItem('root-language', language);
      this.renderer.setAttribute(document.documentElement, 'lang', language);
      this.translocoService.setActiveLang(language);
    }
  }

  public getLanguage(): string {
    this.language = localStorage.getItem('root-language') || 'en';
    return this.language;
  }

  // 发布订阅式 设置语言
  private setLanguageObservable(language: string): void {
    this.switchLanguage$.next(language);
  }

  // 发布订阅式 获取语言 给那些组件钩子不会再次更新， 但需要实时根据语言切换时做操作的地方用
  public getLanguageObservable(): Observable<string> {
    return this.switchLanguage$.asObservable();
  }
}
