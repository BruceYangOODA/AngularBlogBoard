import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { BlogEntriesPageable } from 'src/app/models/blog-entry.interface';
import { PageEvent } from '@angular/material/paginator';
import { AuthService, USER_ID } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit { 

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    //this.authService.setToken()
    //this.authService.removeToken()
    //this.authService.getUserId().subscribe((id) => console.log('id',id))
    
   }

  ngOnInit(): void {   
  }


}
