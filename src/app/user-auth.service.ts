import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENV } from "./_global/global";
import { User } from "./_models/user"
import { ApiResponse } from "./_models/utils"

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

  register(email: string, pass: string, username: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(API+"/user/register", 
      {email: email, password: pass, username: username}).pipe(
      map(result => {
        let resp = new ApiResponse<string>()
        resp.success = result["success"]
        resp.errorId = result["id"]
        if (resp.success === true) {
          resp.data = result["data"]["new_user_id"]
        }
        return resp
      })
    )
    
  }

  confirmEmail(confirmationToken: string): Observable<ApiResponse<Boolean>> {
    return this.http.get(API+"/user/confirm?token="+confirmationToken).pipe(map(
      result => {
        let resp = new ApiResponse<Boolean>()
        resp.success = result["success"]
        resp.errorId = result["id"]
        resp.data = resp.success
        return resp
      }
    ))
  }

  getCurrentUser(): Observable<User> {
    let token = this.localStorage.retrieve("token")
    return this.http.post(API+"/user/current", {token: token}).pipe(
      map(result => {
        if (result["success"] === true) {
          let data = result["data"]
          let user = new User()
          user.id = data["id"]
          user.email = data["email"]
          user.username = data["username"]
          user.role = data["role"]
          user.isActive = data["is_active"] === 1
          user.profilePicUrl = data["profile_pic"]
          user.createdAt = new Date(data["created_at"])
          return user
        } else {
          return null
        }
      })
    );
  }

  editUsername(newUsername: string): Observable<ApiResponse<String>> {
    let token = this.localStorage.retrieve("token")
    let params = {token: token, username: newUsername}
    return this.http.post<ApiResponse<String>>(API+"/user/username/edit", params).pipe(
      map(result => {
        let resp = new ApiResponse<String>()
        resp.success = result["success"]
        resp.errorId = result["id"]
        return resp
      })
    )
  }

  uploadProfilePicture(file: File): Observable<ApiResponse<String>> {
    let token = this.localStorage.retrieve("token")
    let formData = new FormData()
    formData.append("profile_picture", file)
    formData.append("token", token)
    return this.http.post(API+"/user/profilepicture/edit", formData).pipe(map(result => {
      let resp = new ApiResponse<string>()
      resp.success = result["success"] ? result["success"] : false
      resp.errorId = result["success"] === false ? result["id"] : undefined
      resp.data = result["data"] ? result["data"]["profile_picture_path"] : undefined
      return resp
    }))
  }

  logout() {
    let token = this.localStorage.retrieve("token")
    this.localStorage.clear("token")
    return this.http.post(API+"/logout", {token: token});
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
