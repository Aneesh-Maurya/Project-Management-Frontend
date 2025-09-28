import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupAndLoginComponent } from './signup-and-login/signup-and-login.component';
import { DashboardComponent } from './project/dashboard/dashboard.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
const routes: Routes = [
  {path: '', component: SignupAndLoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path:'project-detalis/:id',component:ProjectDetailsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
