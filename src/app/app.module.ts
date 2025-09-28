import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupAndLoginComponent } from './signup-and-login/signup-and-login.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './project/dashboard/dashboard.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
@NgModule({
  declarations: [
    AppComponent,
    SignupAndLoginComponent,
    DashboardComponent,
    ProjectDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
