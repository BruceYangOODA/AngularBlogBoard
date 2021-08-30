import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

class CustomValidators {
  static passwordContainsNumber(control: AbstractControl): ValidationErrors | null {
    const regex = /\d/
    if(regex.test(control.value) && control.value != null) {
      return null
    }
    else {
      return { passwordInvalid: true}
    }
  }

  static passwordsMatch(control:AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value
    const confirmPassword = control.get('confirmPassword')?.value

    if((password === confirmPassword) && 
        (password !== null && confirmPassword !== null)) {
          return null
        }
    else {
      return { passwordsNotMatching: true }
    }

  }
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.authService.getUserId().subscribe((id: string) => {
      if (id != '0')
        this.router.navigate(['home'])
    })
   }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: [null,[Validators.required]],
      username: [null,[Validators.required]],
      email: [null,[
        Validators.required,
        Validators.email,
        Validators.minLength(6)]],
      password: [null,[
        Validators.required,
        Validators.minLength(3),
        CustomValidators.passwordContainsNumber]],
      confirmPassword: [null, [Validators.required]]
    }, { validators: CustomValidators.passwordsMatch })
  }

  onSubmit() {
    if(this.registerForm.invalid) {
      return;
    }
    this.authService.register(this.registerForm.value)
      .subscribe((registReply) =>{
        if (registReply.valid) {
          this.router.navigate(['login'])
        }
        else {
          confirm(registReply.msg)
        }      
    })    

  }

}
