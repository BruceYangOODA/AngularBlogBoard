import { Component, EventEmitter,Output, Input, OnInit, ViewChild, Injectable } from '@angular/core';
import { BlogEntriesPageable } from 'src/app/models/blog-entry.interface';
import { Observable } from 'rxjs';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';

@Injectable()
export class MatPaginatorIntlCro extends MatPaginatorIntl {
  itemsPerPageLabel = '每頁'
  nextPageLabel     = '下一頁'
  previousPageLabel = '上一頁'
  lastPageLabel = '尾頁'
  firstPageLabel = '首頁'


  getRangeLabel = function (page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) {
      return '0 of ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' of ' + length;
  };

}

@Component({
  selector: 'app-all-blog-entries',
  templateUrl: './all-blog-entries.component.html',
  styleUrls: ['./all-blog-entries.component.css']
})
export class AllBlogEntriesComponent implements OnInit {

  blogEntries!: BlogEntriesPageable
  
  pageEvent!: PageEvent

  //@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private router: Router,
    private blogService: BlogService) { 
  }

  ngOnInit(): void {
    //this.paginator._intl.itemsPerPageLabel = "a"
    this.blogService.indexAll(1,10).subscribe((replyObj) => this.blogEntries = replyObj)
  }

  navigate(id : string) {
    this.router.navigateByUrl('blog-entries/' + id);
  }

  onPaginateChange(event: PageEvent): void {
    let page = event.pageIndex
    let size = event.pageSize
    this.blogService.indexAll(page+1,size)
      .subscribe((replyObj) => this.blogEntries = replyObj);
  }
  

}
