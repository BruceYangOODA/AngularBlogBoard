import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';

export interface UserData {
  items: User[],
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }, 
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findOne(id: string): Observable<User> {
    return this.http.get('/api/users/' + id)
  }
  findAll(page: number, size:number): Observable<UserData> {
    let params = new HttpParams()
    params = params.append('page', String(page))
    params = params.append('limit', String(size))

    return this.http.get<UserData>('/api/users', {params})
  }

  updateOne(user: User): Observable<any> {
    return this.http.put<FormData>('/api/users', user)
  }

  updateProfileImage(id: string | null, imgname: string): Observable<any> {    
    return this.http.post<any>('api/users/image',{id:id, imgname:imgname})
  }
  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>('/api/users/upload', formData, 
          {
            reportProgress: true,
            observe: 'events'
          })
  }

  paginateByName(page: number, size: number, username: string): Observable<UserData> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(size));
    params = params.append('username', username);
    return this.http.get<UserData>('/api/users', {params})
  }
}
