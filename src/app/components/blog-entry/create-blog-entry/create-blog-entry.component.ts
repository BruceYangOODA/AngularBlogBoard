import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';


export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}

@Component({
  selector: 'app-create-blog-entry',
  templateUrl: './create-blog-entry.component.html',
  styleUrls: ['./create-blog-entry.component.css']
})
export class CreateBlogEntryComponent implements OnInit {

  @ViewChild("fileUpload", { static: false }) fileUpload!: ElementRef;

  file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

  form!: FormGroup;

  imgURL?: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      body: [null, [Validators.required]],
      headerImage: [null]
    })
  }


  onClick() {
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
        this.form.patchValue({ headerImage: this.file.data.name })
        this.imgURL = reader.result
      }
    }
  }

  postBlog() {
    const formData = new FormData()
    if (this.file.data != null) {
      formData.append('file', this.file.data)
    }
    let blob = new Blob([JSON.stringify(this.form.getRawValue())]
      , {type : 'application/json'})
    formData.append('blog', blob)

    this.file.inProgress = true
    
    this.authService.getUserId().pipe(
      switchMap((id: string| null) => {
        let blob = new Blob([JSON.stringify({userid: id})]
        , {type : 'application/json'})
        formData.append('userid', blob)
        return this.blogService.uploadBlog(formData).pipe(
          map((event) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                this.file.progress = Math.round(event.loaded * 100 / event.total)
                break;
              case HttpEventType.Response:
                return event
            }
          }),
          catchError((error: HttpErrorResponse) => {
            this.file.inProgress = false
            return of('Upload failed')
          })
        )
      })
    ).subscribe((event: any) => {
      if (typeof (event) == 'object') {
        this.file.data = null
        this.file.inProgress = false
        this.file.progress = 0
        this.fileUpload.nativeElement.value = ''
        //redirect
      }
    })
  }


}
