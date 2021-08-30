import { Component, OnInit } from '@angular/core';
import { BlogEntry } from 'src/app/models/blog-entry.interface';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-view-blog-entry',
  templateUrl: './view-blog-entry.component.html',
  styleUrls: ['./view-blog-entry.component.css']
})
export class ViewBlogEntryComponent implements OnInit {

  blogEntry$: Observable<BlogEntry> = this.activatedRoute.params.pipe(
    switchMap((params: Params) => {
      const blogEntryId: string = params['id']
      
      return this.blogService.findOne(blogEntryId).pipe()
    })
  )
  constructor(
    private activatedRoute: ActivatedRoute, 
    private blogService: BlogService) { }

  ngOnInit(): void {
  }

}
