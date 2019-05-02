import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENV } from "./_global/global";

const API = ENV.debug.apiurl;

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(
  	private http: HttpClient,
  	private localStorage: LocalStorageService) { }

  login(email: string, pass: string) {
  	return this.http.post(API+"/login", {email: email, password: pass});
  }

  check_token(): Observable<boolean> {
  	let token = this.localStorage.retrieve("token")
  	if (token === undefined || token === "") {
  		return of(false)
  	} else {
  		return this.http.post(API+"/session", {token: token}).pipe(
  			map(result => {
          return result["success"] ? result["success"] : false
        })
  		)
  	}

  }
}
