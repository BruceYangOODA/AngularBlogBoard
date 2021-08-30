import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  
  //private userId$: Observable<string> = 
   //   this.activatedRoute.params
    //  .pipe(map((params: Params) => params['id']))
  //user$: Observable<User> = this.userId$
  //    .pipe(switchMap((userId: string) => this.userService.findOne(userId)))
  user!: User

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {        
    this.activatedRoute.params.pipe(
      switchMap((params: Params) => 
        this.userService.findOne(params['id'])
      )
    ).subscribe((user: User) =>{
      this.user = user
    })
  }

}
