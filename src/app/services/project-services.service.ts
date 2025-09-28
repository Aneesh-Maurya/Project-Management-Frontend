import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ProjectServicesService {

  

  url='https://project-management-backend-kwuy.onrender.com/api/v1/projects';

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem('UserInfo')
      ? JSON.parse(sessionStorage.getItem('UserInfo') || '{}').accessToken
      : '';

    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserProjects(){
  
    return this.http.get(this.url+'/get-all-project',{headers:this.headers})
  }
  updateProject(projectid:any,data:any){
    return this.http.put(this.url+'/update-project/'+projectid,data,{headers:this.headers})
  }
  addProject(data:any){
    
    return this.http.post(this.url+'/create-project',data,{headers:this.headers})
  }
  deleteProject(projectid:any){
    return this.http.delete(this.url+'/delete-project/'+projectid,{headers:this.headers})
  }
}
