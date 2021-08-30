import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup
  loginToken!: string

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    //this.authService.removeToken()
    //this.authService.setToken('1')
    this.authService.getUserId().pipe(
      switchMap((userid: string) => {
        this.loginToken = userid
        return this.userService.findOne(userid)
      })
    ).subscribe((user) => {
      if (user == null)
        return

      this.loginForm.get('email')?.setValue(user.email)
      this.loginForm.get('password')?.setValue(user.password)
    })

  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6)]],
      password: [null, [
        Validators.required,
        Validators.minLength(3)]]
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }
    this.authService.login(this.loginForm.value)
      .subscribe(loginReply => {
        if (loginReply.valid) {
          if(loginReply.token)
            this.authService.setToken(loginReply.token)
          this.router.navigate(['home'])
        }
        else {
          confirm(loginReply.msg)
        }
      })
  }
}
