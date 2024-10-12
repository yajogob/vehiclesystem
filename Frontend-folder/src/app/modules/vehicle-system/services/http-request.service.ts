import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { AuthService } from "../utils/auth.service";
import { ConfigService } from "../utils/config.service";

@Injectable()
export class HttpRequestService {

  constructor(private http: HttpClient, private auth: AuthService, private config: ConfigService) {

  }

  public get(url: string, params: unknown): Promise<unknown> {
    const headers = new HttpHeaders({'Content-Type':  'application/json'});
    if(AuthService.getJwtToken()) {
      headers.set('jwt-token', AuthService.getJwtToken());
    }
    return new Promise((resolve, reject) => {
      this.http.get(url, {headers, observe: 'response', params: params as HttpParams}).subscribe(resp => {
        if(resp?.status == 200 && resp?.body){
          resolve(resp.body as never);
        } else {
          reject();
        }
      });
    });
  }

  public post(url: string, params: unknown): Promise<unknown> {
    const headers = new HttpHeaders({'Content-Type':  'application/json'});
    if(AuthService.getJwtToken()) {
      headers.set('jwt-token', AuthService.getJwtToken());
    }
    return new Promise((resolve, reject) => {
      this.http.post(url, params, {headers, observe: 'response'}).subscribe(resp => {
        if(resp.status == 200 && resp.body){
          resolve(resp.body as never);
        } else {
          reject();
        }
      });
    });
  }
}
