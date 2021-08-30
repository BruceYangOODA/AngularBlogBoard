import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserData, UserService } from 'src/app/services/user.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
  dataSource?: UserData
  filterValue: string  = ''
  pageEvent?: PageEvent
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role']
  
  constructor(
    private userService: UserService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.findAll(1,10).subscribe((replyObj) => {
      this.dataSource = replyObj
    })
  }

  navigateToProfile(id: number): void {
    this.router.navigate(['./' + id], {relativeTo: this.activatedRoute});
  }

  onPaginateChange(event: PageEvent): void {
    let page = event.pageIndex;
    let size = event.pageSize;    
    console.log(event)

    if(this.filterValue == '') {      
      page = page +1;
      this.userService.findAll(page, size).subscribe((replyObj) =>{
        this.dataSource = replyObj
      })
    } else {
      this.userService.paginateByName(page, size, this.filterValue).subscribe((replyObj) =>{
        this.dataSource = replyObj
      })
    }
  }

  findByName(username: string): void {
    if (username == '') return
    
    this.userService.paginateByName(0, 10, username)
      .subscribe((replyObj) => {
        this.dataSource = replyObj
      })
  }

}
