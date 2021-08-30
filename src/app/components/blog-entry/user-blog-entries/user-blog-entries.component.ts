import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BlogEntriesPageable } from 'src/app/models/blog-entry.interface';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-user-blog-entries',
  templateUrl: './user-blog-entries.component.html',
  styleUrls: ['./user-blog-entries.component.css']
})
export class UserBlogEntriesComponent implements OnInit {

  @Input() userid!: string
  blogEntries!: BlogEntriesPageable 
  pageEvent!: PageEvent

  constructor(
    private blogService: BlogService,
    private router: Router
  ) { 
      
  }

  ngOnInit(): void {
    this.blogService.findAllById(this.userid,1,10)
    .subscribe((reply) => {
      this.blogEntries = reply
      console.log(reply)
    })
  }

  navigate(id: string): void {
    this.router.navigate(['blog-entries/'+id])
  }

  onPaginateChange(event: PageEvent): void {
    let page = event.pageIndex
    let size = event.pageSize
    this.blogService.findAllById(this.userid,page+1,size)
      .subscribe((replyObj) => this.blogEntries = replyObj);
  }

}
