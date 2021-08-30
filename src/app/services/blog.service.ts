import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogEntriesPageable, BlogEntry } from '../models/blog-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  findOne(blogEntryId: string): Observable<BlogEntry> {
    return this.http.get<BlogEntry>('/api/blog-entries/'+blogEntryId)
  }

  findAllById(id: string, page: number, limit: number): Observable<BlogEntriesPageable> {
    let params = new HttpParams();    
    params = params.append('page', String(page));
    params = params.append('limit', String(limit));
    console.log(params)
    return this.http.get<BlogEntriesPageable>('/api/blog-entries/user/'+id, {params});
  }

  indexAll(page: number, limit: number): Observable<BlogEntriesPageable> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    return this.http.get<BlogEntriesPageable>('/api/blog-entries', {params});
  }

  uploadBlog(formData: FormData): Observable<any> {
    return this.http.post<FormData>('/api/blog-entries/upload',formData, 
    {
      reportProgress: true,
      observe: 'events'
    })
  }

  test() : Observable<BlogEntriesPageable> {
    return this.http.get<BlogEntriesPageable>('/api/blog-entries');
  }
  
}
