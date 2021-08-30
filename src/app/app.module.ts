import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import {MatIconModule} from '@angular/material/icon';
import { HomeComponent } from './components/home/home.component';
import { CreateBlogEntryComponent } from './components/blog-entry/create-blog-entry/create-blog-entry.component';
import { AllBlogEntriesComponent,  MatPaginatorIntlCro } from './components/blog-entry/all-blog-entries/all-blog-entries.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/user/users/users.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { ViewBlogEntryComponent } from './components/blog-entry/view-blog-entry/view-blog-entry.component';
import { UserBlogEntriesComponent } from './components/blog-entry/user-blog-entries/user-blog-entries.component';
//import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CreateBlogEntryComponent,
    AllBlogEntriesComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    UserProfileComponent,
    UpdateUserComponent,
    ViewBlogEntryComponent,
    UserBlogEntriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,

    MatToolbarModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    //MarkdownModule.forRoot()
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
