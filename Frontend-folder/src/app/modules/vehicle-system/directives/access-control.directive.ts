import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { TRAFFICMenuList } from '../interfaces/rbac';

@Directive({selector: '[vsAccessControlDirective]'})
export class VsAccessControlDirective implements OnInit {
  @Input() accessParams: string | undefined = '';

  constructor(
    public ref: ElementRef,
  ) {}

  ngOnInit(): void {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    if (this.accessParams) {
      const accessParams = this.accessParams || '';
      const next = meunListRes.some((item: TRAFFICMenuList) => {
        return item.uriSet.includes(accessParams);
      });
      if(!next) {
        this.ref.nativeElement.style.display = 'none';
      }
    }
  }

}
