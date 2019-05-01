import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';

import { ENV } from "./_global/global";

const API = ENV.debug.apiurl;

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private http: HttpClient) { }

  login(email: string, pass: string) {
  	return this.http.post(API+"/login", {email: email, password: pass});
  }
}
