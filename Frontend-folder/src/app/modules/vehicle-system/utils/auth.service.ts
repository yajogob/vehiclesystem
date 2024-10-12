import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { EnvironmentService } from 'src/app/services/EnvironmentService';
import { OutLoginParams, loginResponseResult } from '../interfaces/rbac';
export class UserInfo {
  username = '';
  user_name = '';
  access_token = '';
  refresh_token = '';
  token_type = '';
  constructor(_username = '', tokenInfo: loginResponseResult = {}) {
    this.username = _username;
    this.user_name = tokenInfo.user_name as string;
    this.token_type = tokenInfo.token_type as string;
    this.access_token = tokenInfo.access_token as string;
    this.refresh_token = tokenInfo.refresh_token as string;
  }

  static createFromJsonObject(jsonObject: unknown): UserInfo {
    let userinfo = new UserInfo();
    try {
      if (typeof jsonObject == 'string' && jsonObject &&
        (jsonObject.search(/^\{.*\}$/) === 0 || jsonObject.search(/^\[.*\]$/) === 0)) {
        jsonObject = JSON.parse(jsonObject);
      }
      return Object.assign(userinfo, jsonObject);
    } catch (e) {
      userinfo = new UserInfo();
    }
    return userinfo;
  }

  public getJwtToken(): string {
    return this.access_token;
  }

  public getUsername(): string {
    return this.username;
  }

  public getFefreshToken(): string {
    return this.refresh_token;
  }
}

@Injectable()
export class AuthService implements CanActivate {

  private accessToken = '';
  constructor(
    private environmentService: EnvironmentService,
  ) { }

  canActivate(): boolean {
    if (AuthService.isLogin()) {
      return true;
    } else {
      this.signout();
      return false;
    }
  }

  static getJwtToken(): string {
    const userinfo = AuthService.getUserInfo();
    if (userinfo) {
      return userinfo.getJwtToken();
    } else {
      return '';
    }
  }

  getToken(): string {
    const userinfo = AuthService.getUserInfo();
    if (userinfo) {
      this.accessToken = userinfo.getJwtToken();
    } else {
      return this.accessToken = '';
    }
    return this.accessToken;
  }

  static setUserInfo(val: UserInfo | OutLoginParams): void {
    localStorage.setItem('UserInfoKey', JSON.stringify(val));
  }

  static getUserInfo(): UserInfo {
    return UserInfo.createFromJsonObject(localStorage.getItem('UserInfoKey'));
  }

  static isLogin(): boolean {
    const userinfo = AuthService.getUserInfo();
    if (userinfo == null || userinfo === undefined || userinfo.getJwtToken() == '') {
      return false;
    } else {
      return true;
    }
  }

  signout(): void {
    sessionStorage.clear();
    const SSO_LOGIN = this.environmentService.getGlobalVariable('SSO_LOGIN');
    window.location.href = `${location.protocol}//${SSO_LOGIN}`;  // login page url
    this;
  }
}
