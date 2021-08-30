import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, switchMap } from "rxjs/operators";
import { User } from '../models/user.interface';

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginReply {
  valid: boolean;
  msg: string;
  token?: string;
}

export interface RegisterReply {
  valid: boolean;
  msg: string;
}

export const USER_ID = 'blog-token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(loginForm: LoginForm): Observable<LoginReply> {
    let params = new HttpParams();
    console.log('email', loginForm.email)
    console.log('password', loginForm.password)
    params = params.append('email', loginForm.email);
    params = params.append('password', loginForm.password);
    return this.http.get<LoginReply>(
      '/api/user/login', 
      {params})
  }

  register(user: User): Observable<RegisterReply> {
    return this.http.post<RegisterReply>('/api/users/regist', user)
  }

  setToken(token: string): void {
    localStorage.setItem(USER_ID, token)    
  }
  removeToken(): void {
    localStorage.removeItem(USER_ID);
  }

  getUserId(): Observable<string>{    
    return of(localStorage.getItem(USER_ID)).pipe(
      switchMap((id: string | null) => {
        if(id == null) return of ('0')
        return of(id)
      })
    )    
  }
}
