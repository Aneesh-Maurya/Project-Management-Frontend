import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoginSignupService {

  constructor(private http:HttpClient) { }
  
  url='https://project-management-backend-kwuy.onrender.com/api/v1/users';


  login(data:any){
    console.log(data)
     return this.http.post(this.url+'/login',data)
  }
   
  signup(data:any){
    return this.http.post(this.url+'/signup',data)
  }

}
