import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { Router } from '@angular/router';

export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  @ViewChild("fileUpload", { static: false }) fileUpload!: ElementRef;
  hasChanges: boolean = true
  file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

  form!: FormGroup
  imgURL: any

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {    
    this.authService.getUserId().subscribe((id: string) => {
      if (id == '0')
        this.router.navigate(['home'])
    })

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{ value: null, disabled: true }, [Validators.required]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      profileImage: [null]
    })
    //this.authService.removeToken()
    //this.authService.setToken()
    this.authService.getUserId().pipe(
      switchMap((id: string) =>
        this.userService.findOne(id).pipe(
          tap((user: User) => {            
            this.form.patchValue({
              id: user.id,
              name: user.name,
              username: user.username,
              profileImage: user.profileImage
            })
          })
        )
      )
    ).subscribe()

  }

  loadIMG() {
    const fileInput = this.fileUpload.nativeElement
    fileInput.click()
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0
      }
      let reader = new FileReader()
      reader.readAsDataURL(fileInput.files[0])
      reader.onload = () => {
        console.log(this.file.data.name)
        this.form.patchValue({ profileImage: this.file.data.name })
        this.imgURL = reader.result
      }
      
    }
   }

   updateUser() {    
    if (this.file.data != null) {
      const formData = new FormData();
      this.file.inProgress = true;

      formData.append('file', this.file.data)

      this.userService.uploadProfileImage(formData).pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.file.progress = Math.round(event.loaded * 100 / event.total);
              break;
            case HttpEventType.Response:
              return event;          
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.file.inProgress = false;
          return of('Upload failed');
        })).subscribe((event: any) => {
          if(typeof (event) == 'object') {
            this.file.data = null
            this.file.inProgress = false
            this.file.progress = 0
          }
        })
    }
    
    this.userService.updateOne(this.form.getRawValue()).subscribe()    
  }


}
