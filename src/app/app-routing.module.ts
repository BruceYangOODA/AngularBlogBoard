import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBlogEntryComponent } from './components/blog-entry/create-blog-entry/create-blog-entry.component';
import { ViewBlogEntryComponent } from './components/blog-entry/view-blog-entry/view-blog-entry.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UsersComponent } from './components/user/users/users.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },  
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UsersComponent
      },
      {
        path: ':id',
        component: UserProfileComponent
      },
    ]
  },
  {
    path: 'blog-entries/:id',
    component: ViewBlogEntryComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'create-blog-entry',
    component: CreateBlogEntryComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'update-profile',
    component: UpdateUserComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
