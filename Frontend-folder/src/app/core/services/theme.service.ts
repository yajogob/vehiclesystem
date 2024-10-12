// TODO: draft theme service
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Theme } from '@enums/theme';

@Injectable({providedIn: 'root'})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme!: Theme;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initTheme(): void {
    this.getColorTheme();
    this.renderer.addClass(document.documentElement, this.colorTheme);
    this.renderer.setAttribute(document.documentElement, 'data-theme', this.colorTheme);
  }

  update(theme: Theme): void {
    const previousColorTheme = this.colorTheme === Theme.DARK ? Theme.DARK : Theme.LIGHT;
    this.setColorTheme(theme);
    this.renderer.setAttribute(document.documentElement, 'data-theme', this.colorTheme);
    this.renderer.removeClass(document.documentElement, previousColorTheme);
    this.renderer.addClass(document.documentElement, this.colorTheme);
  }

  public getColorTheme(): Theme {
    if (localStorage.getItem('color-theme') !== null) {
      this.colorTheme = localStorage.getItem('color-theme') as Theme;
    } else {
      this.colorTheme = Theme.DARK;
    }
    return this.colorTheme;
  }

  private setColorTheme(theme: Theme): void {
    this.colorTheme = theme;
    localStorage.setItem('color-theme', theme);
  }
}
