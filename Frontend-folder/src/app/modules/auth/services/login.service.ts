import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import {
  LogoutParams,
  LogoutResponse,
  MeunListResponse,
  RefreshTokenResponse,
  SsoLoginRes,
} from '../../vehicle-system/interfaces/rbac';
export interface LoginParams {
  name: string | undefined,
  password: string | undefined
}

export interface LoginResponse {
  message: string;
  result: {
    jwt_token: '',
    refresh_token: '',
    access_token: ""
  }
}

export interface ConfigResponse {
  xhr_base_url: ''
}

@Injectable()
export class LoginService {
  constructor(private httpClient: HttpClient) {

  }

  getConfig(name: string): Observable<ConfigResponse> {
    name = name.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = name ?
      { params: new HttpParams().set('name', name) } : {};

    return this.httpClient.get<ConfigResponse>('assets/vehicle-system/config/env.json?v=1686555439348', options);
  }

  public login(params: LoginParams): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/lpr/login', params);
  }

  public logout(params: LogoutParams): Observable<LogoutResponse> {
    return this.httpClient.post<LogoutResponse>('/lpr/user/logout', params);
  }

  public refreshToken(params: LogoutParams): Observable<RefreshTokenResponse> {
    return this.httpClient.post<RefreshTokenResponse>('/lpr/refresh/token', params);
  }

  public getMenuList(): Observable<MeunListResponse> {
    return this.httpClient.post<MeunListResponse>('/lpr/user/resources', {});
  }

  public ssoLogin(params: string): Observable<SsoLoginRes> {
    return this.httpClient.post<SsoLoginRes>('/lpr/login/third', params);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public ssoLoginByRefreshToken(params: any): Observable<SsoLoginRes> {
    return this.httpClient.post<SsoLoginRes>('/lpr/login/third/withRefreshToken', params);
  }
}
