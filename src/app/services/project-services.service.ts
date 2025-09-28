import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ProjectServicesService {

  constructor(private http:HttpClient) { }

  url='https://project-management-backend-kwuy.onrender.com/api/v1/projects';

  getUserProjects(){
    const token = sessionStorage.getItem('UserInfo') ? JSON.parse(sessionStorage.getItem('UserInfo') || '{}').accessToken : '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.url+'/get-all-project',{headers:headers})
  }
  updateProject(projectid:any,data:any){
   const token = sessionStorage.getItem('UserInfo') ? JSON.parse(sessionStorage.getItem('UserInfo') || '{}').accessToken : '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(this.url+'/update-project/'+projectid,data,{headers:headers})
  }
  addProject(data:any){
    
   const token = sessionStorage.getItem('UserInfo') ? JSON.parse(sessionStorage.getItem('UserInfo') || '{}').accessToken : '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.url+'/create-project',data,{headers:headers})
  }
  deleteProject(projectid:any){
   const token = sessionStorage.getItem('UserInfo') ? JSON.parse(sessionStorage.getItem('UserInfo') || '{}').accessToken : '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(this.url+'/delete-project/'+projectid,{headers:headers})
  }
}
